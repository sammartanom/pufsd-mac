/**
 * Cloudflare Pages Function  —  /api/chat
 * AI tech-support agent for MacBook / iPad, grounded to official Apple Support.
 *
 * Bindings required (Pages > Settings > Functions):
 *   - AI                 Workers AI binding (name it "AI")
 * Optional:
 *   - AI_GATEWAY_ID      AI Gateway id; enables exact-match response caching
 *
 * Request  (POST JSON):  { "message": "..." }   or   { "messages": [ {role, content}, ... ] }
 * Response (JSON):       { "reply": "...", "blocked"?: true, "error"?: true }
 *
 * Always returns HTTP 200 for intended replies (guardrail / failsafe / success) so the
 * client renders the message text. The frontend treats non-200 as "backend not connected",
 * so we never use error status codes for messages we actually want shown.
 */

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
// For lower latency you can swap to the fp8 fast variant:
// const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";

// --- Tuning -----------------------------------------------------------------
const MAX_TOKENS = 220;
const TEMPERATURE = 0.1;   // low = deterministic, factual, instruction-following
const MAX_TURNS = 3;       // keep system prompt + last 3 turns (≈6 messages) for cache hits

// --- System prompt (closed-book Apple grounding) ----------------------------
const SYSTEM_PROMPT = [
  "You are the technology help assistant for Pleasantville Union Free School District (a K-12 school district), helping students and staff who are new to MacBook and iPad.",
  "Keep answers concise, plain-spoken, friendly, and step-by-step. Aim for a few short sentences. When a task is involved, give numbered steps.",
  "Ground your troubleshooting in official Apple Support guidance and standard macOS/iPadOS methods. Do not suggest third-party terminal hacks, unverified software, or hardware modifications.",
  "Important district specifics you must follow, because they override generic Apple advice:",
  "- The Mac App Store is NOT available on district devices. To install or update apps, students and staff use the Manager app (from Mosyle) which lists apps approved by the Technology Department. Never tell them to use the App Store.",
  "- For schoolwork, files belong in OneDrive (their Microsoft 365 account), not iCloud. Apple apps like Pages, Numbers, Keynote, and Notes default to iCloud, which is fine, but anything for class should be saved or moved to OneDrive. Microsoft Word, Excel, and PowerPoint are the primary apps for schoolwork.",
  "- Siri is disabled for students on district devices, so do not suggest using Siri.",
  "- For account, login, network, or device-management problems you cannot resolve with a standard Apple step, tell them to contact the Technology Department help desk at helpdesk@pleasantvilleschools.org.",
  "If a question is unrelated to using a Mac, iPad, or district technology, politely say that is outside what you can help with.",
  "If you are unsure of the correct answer, say so honestly and point them to support.apple.com or the district help desk rather than guessing."
].join(" ");

// --- Layer 1 guardrail: 0-neuron keyword filter -----------------------------
// Blocks obvious non-Mac topics before any AI (and therefore any neuron) is spent.
const BANNED_KEYWORDS = ["windows 10", "windows 11", "microsoft windows", "windows pc", "android", "linux", "ubuntu", "pc gaming", "exe file"];
const OFF_TOPIC_REPLY =
  "I am your Mac Tech Support assistant. I can only answer questions related to Apple Mac hardware and macOS.";

function isOffTopic(text) {
  const lower = (text || "").toLowerCase();
  return BANNED_KEYWORDS.some((kw) => {
    // whole-word / phrase match; phrases allow flexible whitespace
    const pattern = new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`, "i");
    return pattern.test(lower);
  });
}

// --- Small JSON helper ------------------------------------------------------
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

// --- Build the message array sent to the model ------------------------------
// Accepts either a single { message } or a full { messages } history, then trims
// to the system prompt + last MAX_TURNS turns to maximize exact-match caching.
function buildMessages(payload) {
  let history = [];

  if (Array.isArray(payload?.messages)) {
    history = payload.messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .filter((m) => m.content.length > 0);
  } else if (typeof payload?.message === "string") {
    history = [{ role: "user", content: payload.message.trim() }];
  }

  // Keep only the last MAX_TURNS turns (a turn = up to one user + one assistant message).
  const trimmed = history.slice(-MAX_TURNS * 2);

  return [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed];
}

// Pull the most recent user message (what we run the guardrail against).
function latestUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

// --- Detect Cloudflare neuron-pool / capacity exhaustion --------------------
function looksLikeQuotaError(err) {
  const msg = (err && (err.message || String(err)) || "").toLowerCase();
  return (
    msg.includes("capacity") ||
    msg.includes("limit") ||
    msg.includes("quota") ||
    msg.includes("exceed") ||
    msg.includes("429") ||
    msg.includes("too many requests") ||
    msg.includes("rate")
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Parse body defensively.
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ reply: "Sorry, I couldn't read that request. Please try asking again." });
  }

  const messages = buildMessages(payload);
  const userText = latestUserText(messages);

  if (!userText) {
    return json({ reply: "Ask me anything about using your MacBook or iPad." });
  }

  // Layer 1: free, instant keyword block (no neurons spent).
  if (isOffTopic(userText)) {
    return json({ reply: OFF_TOPIC_REPLY, blocked: true });
  }

  // Layer 2: the model itself, grounded by the system prompt.
  try {
    if (!env.AI) {
      // Binding missing — treat as a graceful failsafe rather than a hard error.
      return json({
        reply:
          "The support system is currently busy or daily limits have been reached. Please check the official Apple Support site directly.",
        error: true
      });
    }

    const runOptions = {
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE
    };

    // If an AI Gateway id is configured, route through it for exact-match caching.
    const gatewayOpts = env.AI_GATEWAY_ID ? { gateway: { id: env.AI_GATEWAY_ID } } : undefined;

    const result = gatewayOpts
      ? await env.AI.run(MODEL, runOptions, gatewayOpts)
      : await env.AI.run(MODEL, runOptions);

    const reply = (result && (result.response || result.result || "")).toString().trim();

    if (!reply) {
      return json({
        reply:
          "I am sorry, but I can only provide solutions verified by official Apple documentation. Please consult support.apple.com for this specific issue."
      });
    }

    return json({ reply });
  } catch (err) {
    // Failsafe: neuron pool exhausted / capacity / any model error.
    if (looksLikeQuotaError(err)) {
      return json({
        reply:
          "The support system is currently busy or daily limits have been reached. Please check the official Apple Support site directly.",
        error: true
      });
    }
    return json({
      reply:
        "Something went wrong reaching the support system. Please try again in a moment, or visit support.apple.com.",
      error: true
    });
  }
}

// Reject non-POST methods cleanly.
export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json({ reply: "This endpoint accepts POST requests only." }, 405);
  }
  return onRequestPost(context);
}
