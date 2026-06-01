/* app.js — shared engine for every page.
   Loaded after content.js. Each page calls initPage('<key>') at the end.
   Handles: header/nav, footer, chat assistant, universal + per-page search,
   video modal, section rendering, reveal animations. Single source of behavior. */

document.documentElement.classList.add('js');

/* ---------- helpers ---------- */
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function matchable(s){return String(s).toLowerCase().replace(/[-–—.]/g,'');}
function svg(name,size){return '<svg width="'+(size||28)+'" height="'+(size||28)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICONS[name]+'</svg>';}
function appIcon(key,img){
  if(img&&/^https?:\/\//i.test(img)){
    return '<img class="app-icon" src="'+esc(img)+'" alt="" loading="lazy" onerror="this.outerHTML=appIcon(this.dataset.k)" data-k="'+esc(key||'generic')+'">';
  }
  return '<svg class="app-icon" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" role="img">'+(APP_ICONS[key]||APP_ICONS.generic)+'</svg>';
}

/* ---------- nav model (single source for header + mobile sheet + search) ---------- */
const NAV=[
  {key:'switch',       url:'windows-vs-mac.html', label:'Windows vs. Mac', ico:'swap'},
  {key:'shortcuts',    url:'shortcuts.html',      label:'Shortcuts',       ico:'cmd'},
  {key:'gestures',     url:'gestures.html',       label:'Gestures',        ico:'hand'},
  {key:'control',      url:'control-center.html', label:'Control Center',  ico:'sliders'},
  {key:'apps',         url:'apps.html',           label:'Apps',            ico:'grid'},
  {key:'accessibility',url:'accessibility.html',  label:'Accessibility',   ico:'access'},
  {key:'videos',       url:'videos.html',         label:'Videos',          ico:'video'},
  {key:'faq',          url:'faq.html',            label:'FAQ',             ico:'help'},
  {key:'resources',    url:'resources.html',      label:'Resources',       ico:'book'}
];

/* ============================================================
   SECTION RENDERERS (each guarded by container presence)
   ============================================================ */
function renderHome(){
  const ht=document.getElementById('heroTitle');
  if(ht)ht.innerHTML=esc(CONTENT.meta.title).replace(/,\s*/,',<br>')+'<span class="dot">.</span>';
  const tg=document.getElementById('heroTagline');
  if(tg)tg.textContent=CONTENT.meta.tagline;
  const grid=document.getElementById('browseGrid');
  if(!grid)return;
  grid.innerHTML=BROWSE.map(b=>{
    const count=b.k?(b.k==='shortcuts'?CONTENT.shortcuts.reduce((n,g)=>n+g.items.length,0):CONTENT[b.k].length):null;
    const nav=NAV.find(n=>n.key===b.id);
    const open=(b.id==='assistant')?'href="#" onclick="openChat();return false;"':'href="'+(nav?nav.url:'#')+'"';
    return '<a '+open+' class="card"><span class="ico">'+svg(b.ico,30)+'</span>'
      +'<h3>'+b.t+'</h3><span class="desc">'+b.d+'</span>'
      +(count!=null?'<span class="meta">'+count+(b.k==='shortcuts'?' shortcuts':b.k==='videos'?' videos':' items')+'</span>':'<span class="meta">Open chat</span>')+'</a>';
  }).join('');
}
function renderSwitch(){
  const el=document.getElementById('switchRows');if(!el)return;
  el.innerHTML='<div class="cmp-header"><span class="h-topic">Task</span><span class="h-win">On Windows</span><span class="h-mac">On a Mac</span></div>'
    +CONTENT.switch.map(r=>
      '<div class="cmp" data-s="'+esc((r.topic+' '+r.win+' '+r.mac).toLowerCase())+'">'
      +'<div class="cmp-topic">'+esc(r.topic)+'</div>'
      +'<div class="cmp-val cmp-win">'+esc(r.win)+'</div>'
      +'<div class="cmp-val cmp-mac">'+esc(r.mac)+'</div></div>'
    ).join('');
}
function renderShortcuts(){
  const el=document.getElementById('scList');if(!el)return;
  const all=CONTENT.shortcuts.reduce((a,g)=>a.concat(g.items),[]);
  el.innerHTML=all.map(it=>
    '<div class="sc-row" data-s="'+esc(it.label.toLowerCase())+'"><span class="label">'+esc(it.label)+'</span>'
    +'<span class="keys">'+it.keys.map(k=>'<span class="kbd">'+esc(k)+'</span>').join('')+'</span></div>'
  ).join('');
}
function renderGestures(){
  const el=document.getElementById('gestureRows');if(!el)return;
  el.innerHTML=CONTENT.gestures.map(g=>
    '<div class="gest" data-s="'+esc((g.name+' '+g.how).toLowerCase())+'">'
    +'<span class="gname">'+esc(g.name)+'</span><span class="ghow">'+esc(g.how)+'</span></div>'
  ).join('');
}
function renderControlCenter(){
  const el=document.getElementById('ccGrid');if(!el)return;
  el.innerHTML=CONTENT.control.map(c=>
    '<div class="cc-card" data-s="'+esc((c.t+' '+c.body).toLowerCase())+'">'
    +'<span class="cc-ico">'+svg(c.ico,30)+'</span>'
    +'<span class="cc-name">'+esc(c.t)+'</span>'
    +'<span class="cc-desc">'+esc(c.body)+'</span></div>'
  ).join('');
}
function renderApps(){
  const el=document.getElementById('appsGrid');if(!el)return;
  el.innerHTML=CONTENT.apps.map(a=>
    '<a class="app-card" '+(a.url?'href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer"':'')+' data-s="'+esc((a.name+' '+a.desc).toLowerCase())+'">'
    +'<div class="app-head">'+appIcon(a.icon,a.img)+'<span class="app-name">'+esc(a.name)+'</span></div>'
    +'<span class="app-desc">'+esc(a.desc)+'</span>'
    +(a.url?'<span class="app-link">Learn more<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span>':'')
    +'</a>'
  ).join('');
}
function renderAccessibility(){
  const el=document.getElementById('a11yGrid');if(!el)return;
  el.innerHTML=CONTENT.accessibility.map(a=>
    '<a class="a11y-card" href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer" data-s="'+esc((a.name+' '+a.desc).toLowerCase())+'">'
    +'<span class="a11y-ico">'+svg(a.ico,30)+'</span>'
    +'<span class="a11y-name">'+esc(a.name)+'</span>'
    +'<span class="a11y-desc">'+esc(a.desc)+'</span>'
    +'<span class="a11y-link">Learn how<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span>'
    +'</a>'
  ).join('');
}
function renderVideos(){
  const el=document.getElementById('videoGrid');if(!el)return;
  el.innerHTML=CONTENT.videos.map((v,i)=>
    '<button type="button" class="video-card" data-vi="'+i+'" data-s="'+esc(v.title.toLowerCase())+'">'
    +'<span class="video-thumb"><img src="https://i.ytimg.com/vi/'+esc(v.yt)+'/hqdefault.jpg" alt="" loading="lazy">'
    +'<span class="video-play"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>'
    +(v.duration?'<span class="video-dur">'+esc(v.duration)+'</span>':'')+'</span>'
    +'<span class="video-vtitle">'+esc(v.title)+'</span></button>'
  ).join('');
}
function renderFaq(){
  const el=document.getElementById('faqList');if(!el)return;
  el.innerHTML=CONTENT.faq.map(f=>
    '<details class="exp" data-s="'+esc((f.q+' '+f.a).toLowerCase())+'"><summary class="exp-summary">'
    +'<span class="exp-title">'+esc(f.q)+'</span>'
    +'<span class="exp-icon"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><line x1="2" y1="8" x2="14" y2="8"/><line class="plus-v" x1="8" y1="2" x2="8" y2="14"/></svg></span>'
    +'</summary><div class="exp-body"><div class="exp-body-inner"><div class="exp-a">'+esc(f.a)+'</div></div></div></details>'
  ).join('');
  // FAQ structured data for search engines
  try{
    const data={"@context":"https://schema.org","@type":"FAQPage","mainEntity":CONTENT.faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))};
    const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(data);document.head.appendChild(s);
  }catch(e){}
}
function renderResources(){
  const el=document.getElementById('resGrid');if(!el)return;
  el.innerHTML=CONTENT.resources.map(resCard).join('')+helpCard();
}
function resCard(a){
  return '<a href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer" data-s="'+esc((a.rname+' '+a.rdesc).toLowerCase())+'">'
    +'<span class="rtop"><span class="rname">'+esc(a.rname)+'</span><span class="ext">'+svg('ext',22)+'</span></span>'
    +'<span class="rdesc">'+esc(a.rdesc)+'</span></a>';
}
function helpCard(){
  return '<button type="button" class="res-help" id="helpBtn" data-s="request help support email helpdesk technology pufsd">'
    +'<span class="help-default"><span class="rtop"><span class="rname">PUFSD Help Desk</span>'
    +'<span class="ext"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span></span>'
    +'<span class="rdesc">Tap to copy the Help Desk email</span></span>'
    +'<span class="help-copied" aria-hidden="true">Email copied!</span></button>';
}

const RENDER={home:renderHome,switch:renderSwitch,shortcuts:renderShortcuts,gestures:renderGestures,control:renderControlCenter,apps:renderApps,accessibility:renderAccessibility,videos:renderVideos,faq:renderFaq,resources:renderResources};

/* ---------- copy-to-clipboard (help desk) ---------- */
function fallbackCopy(text,cb){
  const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.position='absolute';t.style.left='-9999px';
  document.body.appendChild(t);t.select();
  try{document.execCommand('copy');cb();}catch(e){if(window.prompt)window.prompt('Copy this email address:',text);}
  document.body.removeChild(t);
}
function copyTo(btnId){
  const btn=document.getElementById(btnId);
  if(!btn||btn.classList.contains('is-copied'))return;
  const done=()=>{btn.classList.add('is-copied');setTimeout(()=>btn.classList.remove('is-copied'),2000);};
  const email=CONTENT.helpEmail;
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(email).then(done).catch(()=>fallbackCopy(email,done));}
  else{fallbackCopy(email,done);}
}

/* ---------- video modal ---------- */
function openVideo(i){
  const v=CONTENT.videos[i];if(!v)return;
  const modal=document.getElementById('videoModal');
  document.getElementById('vmFrame').innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(v.yt)+'?autoplay=1&rel=0" title="'+esc(v.title)+'" allow="accelerated-rotation; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  document.getElementById('vmTitle').textContent=v.title;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeVideo(){
  const modal=document.getElementById('videoModal');if(!modal)return;
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');
  document.getElementById('vmFrame').innerHTML='';document.body.style.overflow='';
}

/* ---------- chat assistant ---------- */
function chatLog(){return document.getElementById('chatLog');}
function addMsg(role,text){const d=document.createElement('div');d.className='msg '+role;d.textContent=text;chatLog().appendChild(d);chatLog().scrollTop=chatLog().scrollHeight;return d;}
function addTyping(){const d=document.createElement('div');d.className='msg bot typing';d.innerHTML='<span class="dot"></span><span class="dot"></span><span class="dot"></span>';chatLog().appendChild(d);chatLog().scrollTop=chatLog().scrollHeight;return d;}
function hideChips(){const c=document.getElementById('chatChips');if(c)c.style.display='none';}
async function sendChat(preset){
  const ta=document.getElementById('chatInput');const q=(preset||ta.value).trim();if(!q)return;
  hideChips();addMsg('user',q);ta.value='';
  const thinking=addTyping();
  try{
    const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q})});
    if(!r.ok)throw new Error('no backend');
    const data=await r.json();
    thinking.classList.remove('typing');thinking.innerHTML='';thinking.textContent=data.reply||'(no reply)';
  }catch(err){
    thinking.remove();
    addMsg('sys','The assistant is briefly unavailable. Please try again in a moment, or visit support.apple.com.');
  }
}
/* ---------- AI assistant: slide-in panel (mirrors the nav) ---------- */
let aiLastFocus=null;
function aiIsOpen(){return document.body.classList.contains('ai-open');}
function openChat(){
  const panel=document.getElementById('aiPanel'),scrim=document.getElementById('aiScrim');
  if(!panel)return;
  if(navIsOpen())closeNav();
  aiLastFocus=document.activeElement;
  panel.hidden=false;if(scrim)scrim.hidden=false;
  requestAnimationFrame(()=>document.body.classList.add('ai-open'));
  setTimeout(()=>{const i=document.getElementById('chatInput');if(i)i.focus();},120);
}
function closeChat(){
  const panel=document.getElementById('aiPanel'),scrim=document.getElementById('aiScrim');
  if(!panel)return;
  document.body.classList.remove('ai-open');
  const onEnd=e=>{
    if(e.target!==panel||e.propertyName!=='transform')return;
    panel.removeEventListener('transitionend',onEnd);
    if(!aiIsOpen()){panel.hidden=true;if(scrim)scrim.hidden=true;}
  };
  panel.addEventListener('transitionend',onEnd);
  if(aiLastFocus&&aiLastFocus.focus)aiLastFocus.focus();
}

/* ---------- nav: slide-in panel ---------- */
let navLastFocus=null;
function navIsOpen(){return document.body.classList.contains('nav-open');}
function resetNavSearch(){
  const s=document.getElementById('navSearch'),p=document.getElementById('navPanel'),r=document.getElementById('navResults');
  if(s)s.value='';if(p)p.classList.remove('nav-searching');if(r)r.innerHTML='';
}
function openNav(){
  const toggle=document.getElementById('navToggle'),panel=document.getElementById('navPanel'),scrim=document.getElementById('navScrim');
  if(!panel)return;
  if(aiIsOpen())closeChat();
  navLastFocus=document.activeElement;
  resetNavSearch();
  panel.hidden=false;if(scrim)scrim.hidden=false;
  requestAnimationFrame(()=>document.body.classList.add('nav-open'));
  if(toggle){toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close menu');}
  const fine=window.matchMedia('(pointer:fine)').matches;
  const first=fine?document.getElementById('navSearch'):panel.querySelector('.nav-primary a');
  if(first)setTimeout(()=>first.focus(),80);
}
function closeNav(){
  const toggle=document.getElementById('navToggle'),panel=document.getElementById('navPanel'),scrim=document.getElementById('navScrim');
  if(!panel)return;
  document.body.classList.remove('nav-open');
  if(toggle){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
  const onEnd=e=>{
    if(e.target!==panel||e.propertyName!=='transform')return;
    panel.removeEventListener('transitionend',onEnd);
    if(!navIsOpen()){panel.hidden=true;if(scrim)scrim.hidden=true;}
  };
  panel.addEventListener('transitionend',onEnd);
  if(navLastFocus&&navLastFocus.focus)navLastFocus.focus();
}

/* ---------- universal search (index across all pages) ---------- */
function buildIndex(){
  const idx=[];
  CONTENT.switch.forEach(r=>idx.push({cat:'Windows vs. Mac',title:r.topic,url:'windows-vs-mac.html',text:(r.topic+' '+r.win+' '+r.mac).toLowerCase()}));
  CONTENT.shortcuts.forEach(g=>g.items.forEach(it=>idx.push({cat:'Shortcut',title:it.label,url:'shortcuts.html',text:it.label.toLowerCase()})));
  CONTENT.gestures.forEach(g=>idx.push({cat:'Gesture',title:g.name,url:'gestures.html',text:(g.name+' '+g.how).toLowerCase()}));
  CONTENT.control.forEach(c=>idx.push({cat:'Control Center',title:c.t,url:'control-center.html',text:(c.t+' '+c.body).toLowerCase()}));
  CONTENT.apps.forEach(a=>idx.push({cat:'App',title:a.name,url:'apps.html',text:(a.name+' '+a.desc).toLowerCase()}));
  CONTENT.accessibility.forEach(a=>idx.push({cat:'Accessibility',title:a.name,url:'accessibility.html',text:(a.name+' '+a.desc).toLowerCase()}));
  CONTENT.videos.forEach(v=>idx.push({cat:'Video',title:v.title,url:'videos.html',text:v.title.toLowerCase()}));
  CONTENT.faq.forEach(f=>idx.push({cat:'FAQ',title:f.q,url:'faq.html',text:(f.q+' '+f.a).toLowerCase()}));
  CONTENT.resources.forEach(r=>idx.push({cat:'Resource',title:r.rname,url:r.url,ext:true,text:(r.rname+' '+r.rdesc).toLowerCase()}));
  return idx;
}
let SEARCH_INDEX=[];
function runNavSearch(q){
  q=(q||'').trim();
  const panel=document.getElementById('navPanel'),box=document.getElementById('navResults');
  if(!box||!panel)return;
  if(!q){panel.classList.remove('nav-searching');box.innerHTML='';return;}
  panel.classList.add('nav-searching');
  const nq=matchable(q);
  const hits=SEARCH_INDEX.filter(it=>matchable(it.text).includes(nq)).slice(0,12);
  if(!hits.length){box.innerHTML='<div class="nav-no-results">No matches for &ldquo;'+esc(q)+'&rdquo;. Try Ask AI.</div>';return;}
  box.innerHTML=hits.map(h=>
    '<a class="nav-result" href="'+esc(h.url)+'"'+(h.ext?' target="_blank" rel="noopener noreferrer"':'')+'>'
    +'<span class="nav-r-title">'+esc(h.title)+'</span><span class="nav-r-cat">'+esc(h.cat)+'</span></a>'
  ).join('');
}

/* ---------- per-page search (FAQ + Videos live filter) ---------- */
function wirePageSearch(inputId,itemSelector,noResultId){
  const input=document.getElementById(inputId);if(!input)return;
  const no=noResultId?document.getElementById(noResultId):null;
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    let shown=0;
    document.querySelectorAll(itemSelector).forEach(el=>{
      const hit=!q||matchable(el.dataset.s||'').includes(matchable(q));
      el.style.display=hit?'':'none';if(hit)shown++;
    });
    if(no)no.style.display=(q&&!shown)?'block':'none';
  });
}

/* ---------- reveal animation ---------- */
function wireReveal(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('in'));return;
  }
  const obs=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){
    [...en.target.children].forEach((c,i)=>c.style.setProperty('--i',Math.min(i,10)));
    en.target.classList.add('in');obs.unobserve(en.target);
  }});},{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>obs.observe(el));
}

/* ============================================================
   CHROME INJECTION (header, footer, overlays) + wiring
   ============================================================ */
const ICO_SPARK='<svg class="ai-spark" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9z"/></svg>';

function injectChrome(activeKey){
  // favicon + theme-color (kept out of every shell head)
  if(!document.querySelector('link[rel="icon"]')){
    const fav="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%23000'/%3E%3Crect x='22' y='28' width='56' height='38' rx='5' fill='none' stroke='%23fff' stroke-width='5'/%3E%3Crect x='38' y='70' width='24' height='5' rx='2.5' fill='%23fff'/%3E%3Ccircle cx='50' cy='47' r='6' fill='%235eea8e'/%3E%3C/svg%3E";
    const l=document.createElement('link');l.rel='icon';l.href=fav;document.head.appendChild(l);
    const a=document.createElement('link');a.rel='apple-touch-icon';a.href=fav;document.head.appendChild(a);
  }
  // Header: a single corner toggle that opens the overlay panel
  const header=document.getElementById('site-header');
  if(header){
    header.className='nav-bar';
    header.innerHTML=
      '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navPanel" aria-label="Open menu">'
        +'<span class="nav-bars" aria-hidden="true"><span></span><span></span></span>'
      +'</button>';
  }
  // Overlays appended to body
  const overlays=document.createElement('div');
  const navLinks=[{key:'home',url:'index.html',label:'Home'}].concat(NAV.map(n=>({key:n.key,url:n.url,label:n.label})));
  overlays.innerHTML=
    // nav scrim + slide-in panel
    '<div class="nav-scrim" id="navScrim" hidden></div>'
    +'<aside class="nav-panel" id="navPanel" role="dialog" aria-modal="true" aria-label="Site menu" hidden><nav>'
      +'<div class="nav-search">'
        +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>'
        +'<input id="navSearch" type="search" placeholder="Search Mac Hub" aria-label="Search Mac Hub" autocomplete="off"></div>'
      +'<div class="nav-primary">'
        +navLinks.map(n=>'<a href="'+n.url+'"'+(n.key===activeKey?' aria-current="page"':'')+'>'+esc(n.label)+'</a>').join('')
      +'</div>'
      +'<div class="nav-actions">'
        +'<a href="mailto:'+esc(CONTENT.helpEmail)+'">Get Help</a>'
        +'<button type="button" id="navAskAi">Ask AI</button>'
      +'</div>'
      +'<div class="nav-results" id="navResults" role="region" aria-label="Search results"></div>'
      +'<div class="nav-foot"><a class="nav-lock" href="admin.html" aria-label="Admin">'
        +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
      +'</a></div>'
    +'</nav></aside>'
    // AI assistant: scrim + slide-in panel, opened from the menu's Ask AI
    +'<div class="ai-scrim" id="aiScrim" hidden></div>'
    +'<aside class="ai-panel" id="aiPanel" role="dialog" aria-modal="true" aria-label="AI assistant" hidden>'
      +'<button type="button" class="ai-back" id="aiBack" aria-label="Back to menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>'
      +'<div class="ai-inner">'
      +'<div class="ai-head"><span class="ai-title">'+ICO_SPARK+'Ask AI</span><span class="ai-sub">Answers grounded in Apple Support and Pleasantville district guidance.</span></div>'
      +'<div class="chat-log" id="chatLog"><div class="msg sys">Ask anything about using your MacBook or iPad.</div>'
      +'<div class="chat-chips" id="chatChips">'
        +'<button type="button" class="chat-chip">How do I take a screenshot?</button>'
        +'<button type="button" class="chat-chip">How do I install an app?</button>'
        +'<button type="button" class="chat-chip">Where should I save my schoolwork?</button>'
        +'<button type="button" class="chat-chip">How do I connect to Wi-Fi?</button>'
      +'</div></div>'
      +'<div class="chat-input"><div class="chat-field"><textarea id="chatInput" placeholder="How do I take a screenshot?"></textarea></div>'
      +'<button class="cta" id="chatSend">Send</button></div>'
    +'</div></aside>'
    // video modal
    +'<div class="video-modal" id="videoModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Video player">'
    +'<button type="button" class="vm-close" id="vmClose" aria-label="Close video"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
    +'<div class="vm-inner"><div class="vm-frame" id="vmFrame"></div><div class="vm-title" id="vmTitle"></div></div></div>';
  while(overlays.firstChild)document.body.appendChild(overlays.firstChild);

  wireChrome();
}

function wireChrome(){
  SEARCH_INDEX=buildIndex();

  // nav panel open/close
  const toggle=document.getElementById('navToggle');
  if(toggle)toggle.addEventListener('click',()=>{navIsOpen()?closeNav():openNav();});
  const scrim=document.getElementById('navScrim');
  if(scrim)scrim.addEventListener('click',closeNav);

  // panel search (universal, reuses the cross-page index)
  const navSearch=document.getElementById('navSearch');
  if(navSearch)navSearch.addEventListener('input',e=>runNavSearch(e.target.value));

  // Ask AI -> open the assistant
  const askAi=document.getElementById('navAskAi');
  if(askAi)askAi.addEventListener('click',()=>{closeNav();openChat();});

  // close the panel after following an in-site link
  const panel=document.getElementById('navPanel');
  if(panel)panel.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(a&&a.getAttribute('target')!=='_blank')closeNav();
  });

  // chat
  document.getElementById('chatSend').onclick=()=>sendChat();
  document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  document.querySelectorAll('.chat-chip').forEach(c=>c.addEventListener('click',()=>sendChat(c.textContent)));

  // AI panel: opened from the menu's Ask AI; back arrow returns to the menu
  const aiBack=document.getElementById('aiBack');
  if(aiBack)aiBack.addEventListener('click',()=>{closeChat();openNav();});
  const aiScrim=document.getElementById('aiScrim');
  if(aiScrim)aiScrim.addEventListener('click',closeChat);

  // help-desk copy on the resources page card
  document.addEventListener('click',e=>{
    if(e.target.closest&&e.target.closest('#helpBtn'))copyTo('helpBtn');
  });

  // video modal (delegated)
  document.addEventListener('click',e=>{
    const card=e.target.closest&&e.target.closest('.video-card');
    if(card){openVideo(+card.dataset.vi);return;}
    if(e.target.closest&&e.target.closest('#vmClose')){closeVideo();return;}
    const modal=document.getElementById('videoModal');
    if(modal&&modal.classList.contains('open')&&e.target===modal)closeVideo();
  });

  // global escape + focus trap (nav + AI panels share the pattern)
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(navIsOpen()){closeNav();return;}if(aiIsOpen()){closeChat();return;}closeVideo();return;}
    if(e.key==='Tab'){
      if(navIsOpen())trapTab(e,document.getElementById('navPanel'),toggle);
      else if(aiIsOpen())trapTab(e,document.getElementById('aiPanel'),null);
    }
  });
}

function trapTab(e,panel,trigger){
  if(!panel)return;
  const f=(trigger?[trigger]:[]).concat(Array.prototype.slice.call(panel.querySelectorAll('a[href],button:not([disabled]),input,textarea')));
  const i=f.indexOf(document.activeElement);
  if(e.shiftKey){if(i<=0){e.preventDefault();f[f.length-1].focus();}}
  else{if(i===f.length-1){e.preventDefault();f[0].focus();}}
}

/* ============================================================
   PAGE INIT — every page calls this once
   ============================================================ */
function initPage(key){
  injectChrome(key);
  if(RENDER[key])RENDER[key]();
  if(key==='faq')wirePageSearch('faqSearch','#faqList details','faqNo');
  if(key==='videos')wirePageSearch('videoSearch','#videoGrid .video-card','videoNo');
  wireReveal();
}
