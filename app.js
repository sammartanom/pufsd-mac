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

const RENDER={home:renderHome,switch:renderSwitch,shortcuts:renderShortcuts,gestures:renderGestures,apps:renderApps,accessibility:renderAccessibility,videos:renderVideos,faq:renderFaq,resources:renderResources};

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
function openChat(){const w=document.getElementById('chatWindow');w.classList.add('open');w.setAttribute('aria-hidden','false');setMenu(false);setSearch(false);setTimeout(()=>document.getElementById('chatInput').focus(),120);}
function closeChat(){const w=document.getElementById('chatWindow');w.classList.remove('open');w.setAttribute('aria-hidden','true');}

/* ---------- nav: menu sheet + search overlay ---------- */
function setMenu(open){
  const b=document.getElementById('menuBtn'),m=document.getElementById('menu'),s=document.getElementById('menuScrim');
  if(!m)return;
  if(b)b.setAttribute('aria-expanded',open);
  m.classList.toggle('open',open);m.setAttribute('aria-hidden',!open);
  if(s)s.classList.toggle('open',open);
  if(open)setSearch(false);
}
function setSearch(open){
  const b=document.getElementById('searchBtn'),pop=document.getElementById('searchPop');
  if(!pop)return;
  if(b)b.setAttribute('aria-expanded',open);
  pop.classList.toggle('open',open);pop.setAttribute('aria-hidden',!open);
  document.body.classList.toggle('search-open',open);
  if(open){setMenu(false);setTimeout(()=>{const s=document.getElementById('search');if(s)s.focus();},100);}
  else{const s=document.getElementById('search');if(s&&s.value){s.value='';runSearch('');}}
}

/* ---------- universal search (index across all pages) ---------- */
function buildIndex(){
  const idx=[];
  CONTENT.switch.forEach(r=>idx.push({cat:'Windows vs. Mac',title:r.topic,url:'windows-vs-mac.html',text:(r.topic+' '+r.win+' '+r.mac).toLowerCase()}));
  CONTENT.shortcuts.forEach(g=>g.items.forEach(it=>idx.push({cat:'Shortcut',title:it.label,url:'shortcuts.html',text:it.label.toLowerCase()})));
  CONTENT.gestures.forEach(g=>idx.push({cat:'Gesture',title:g.name,url:'gestures.html',text:(g.name+' '+g.how).toLowerCase()}));
  CONTENT.apps.forEach(a=>idx.push({cat:'App',title:a.name,url:'apps.html',text:(a.name+' '+a.desc).toLowerCase()}));
  CONTENT.accessibility.forEach(a=>idx.push({cat:'Accessibility',title:a.name,url:'accessibility.html',text:(a.name+' '+a.desc).toLowerCase()}));
  CONTENT.videos.forEach(v=>idx.push({cat:'Video',title:v.title,url:'videos.html',text:v.title.toLowerCase()}));
  CONTENT.faq.forEach(f=>idx.push({cat:'FAQ',title:f.q,url:'faq.html',text:(f.q+' '+f.a).toLowerCase()}));
  CONTENT.resources.forEach(r=>idx.push({cat:'Resource',title:r.rname,url:r.url,ext:true,text:(r.rname+' '+r.rdesc).toLowerCase()}));
  return idx;
}
let SEARCH_INDEX=[];
function runSearch(q){
  q=(q||'').trim().toLowerCase();
  const box=document.getElementById('searchResults'),hint=document.getElementById('searchHint');
  if(!box)return;
  if(hint)hint.classList.toggle('hidden',!!q);
  if(!q){box.innerHTML='';return;}
  const nq=matchable(q);
  const hits=SEARCH_INDEX.filter(it=>matchable(it.text).includes(nq)).slice(0,12);
  if(!hits.length){box.innerHTML='<div class="sr-empty">No matches for &ldquo;'+esc(q)+'&rdquo;. Try the assistant.</div>';return;}
  box.innerHTML=hits.map(h=>
    '<a class="sr-item" href="'+esc(h.url)+'"'+(h.ext?' target="_blank" rel="noopener noreferrer"':'')+'>'
    +'<span class="sr-cat">'+esc(h.cat)+'</span><span class="sr-title">'+esc(h.title)+'</span></a>'
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
const ICO_AGENT='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+ICONS.spark+'</svg>';
const ICO_SEARCH='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';

function injectChrome(activeKey){
  // favicon + theme-color (kept out of every shell head)
  if(!document.querySelector('link[rel="icon"]')){
    const fav="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%23000'/%3E%3Crect x='22' y='28' width='56' height='38' rx='5' fill='none' stroke='%23fff' stroke-width='5'/%3E%3Crect x='38' y='70' width='24' height='5' rx='2.5' fill='%23fff'/%3E%3Ccircle cx='50' cy='47' r='6' fill='%235eea8e'/%3E%3C/svg%3E";
    const l=document.createElement('link');l.rel='icon';l.href=fav;document.head.appendChild(l);
    const a=document.createElement('link');a.rel='apple-touch-icon';a.href=fav;document.head.appendChild(a);
  }
  // Header
  const header=document.getElementById('site-header');
  if(header){
    header.className='site-header';
    header.innerHTML=
      '<a class="brand" href="index.html"><span class="brand-dot"></span> Mac Hub</a>'
      +'<nav class="top-nav">'+NAV.map(n=>'<a href="'+n.url+'"'+(n.key===activeKey?' class="active"':'')+'>'+esc(n.label)+'</a>').join('')+'</nav>'
      +'<div class="controls">'
        +'<button class="ctrl-btn agent-btn" id="agentBtn" aria-label="Ask the AI assistant">'+ICO_AGENT+'</button>'
        +'<button class="ctrl-btn search-btn" id="searchBtn" aria-label="Search" aria-expanded="false" aria-controls="searchPop">'+ICO_SEARCH+'</button>'
        +'<button class="ctrl-btn menu-btn only-mobile" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="menu"><span class="bars" aria-hidden="true"><span></span><span></span><span></span></span></button>'
      +'</div>';
  }
  // Footer
  const footer=document.getElementById('site-footer');
  if(footer){
    footer.outerHTML=
      '<footer class="site-footer">'
      +'<div class="foot-main"><div class="foot-brand">'
        +'<span class="foot-title">Your Mac, made simple<span class="dot">.</span></span>'
        +'<span class="foot-sub">Pleasantville Union Free School District &middot; Technology Department</span></div>'
      +'<div class="foot-links"><button type="button" class="foot-help" id="footHelpBtn"><span class="foot-help-label">Copy Help Desk email</span><span class="foot-help-done">Copied!</span></button></div></div>'
      +'<div class="foot-meta"><span>For Pleasantville students and staff</span><span id="footUpdated"></span></div>'
      +'</footer>';
    const fu=document.getElementById('footUpdated');
    if(fu)fu.textContent='Updated '+new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'});
  }
  // Overlays appended to body
  const overlays=document.createElement('div');
  overlays.innerHTML=
    // search overlay
    '<div class="search-pop" id="searchPop" aria-hidden="true"><div class="search-bar"><div class="search-field">'
    +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>'
    +'<input id="search" type="search" placeholder="Search the hub..." autocomplete="off"></div>'
    +'<button class="search-cancel" id="searchCancel">Cancel</button></div>'
    +'<p class="search-hint" id="searchHint">Search shortcuts, apps, answers, videos, and more.</p>'
    +'<div class="search-results" id="searchResults"></div></div>'
    // mobile menu sheet
    +'<div class="menu-scrim" id="menuScrim" aria-hidden="true"></div>'
    +'<nav class="menu" id="menu" aria-hidden="true">'
      +'<button type="button" class="menu-action" id="menuAgent">'+ICO_AGENT+' Ask the assistant</button>'
      +'<button type="button" class="menu-action" id="menuSearch">'+ICO_SEARCH+' Search</button>'
      +'<span class="menu-divider" aria-hidden="true"></span>'
      +'<a href="index.html" data-ico="grid">Home</a>'
      +NAV.map(n=>'<a href="'+n.url+'" data-ico="'+n.ico+'"'+(n.key===activeKey?' class="active"':'')+'>'+esc(n.label)+'</a>').join('')
    +'</nav>'
    // chat window
    +'<div class="chat-window" id="chatWindow" aria-hidden="true"><div class="chat-head">'
    +'<span class="ttl">'+ICO_AGENT+' Ask the Assistant</span>'
    +'<button class="x" id="chatClose" aria-label="Close">&times;</button></div>'
    +'<div class="chat-log" id="chatLog"><div class="msg sys">Ask anything about using your MacBook or iPad. Answers are grounded in Apple Support and Pleasantville district guidance.</div>'
    +'<div class="chat-chips" id="chatChips">'
      +'<button type="button" class="chat-chip">How do I take a screenshot?</button>'
      +'<button type="button" class="chat-chip">How do I install an app?</button>'
      +'<button type="button" class="chat-chip">Where should I save my schoolwork?</button>'
      +'<button type="button" class="chat-chip">How do I connect to Wi-Fi?</button>'
    +'</div></div>'
    +'<div class="chat-input"><div class="chat-field"><textarea id="chatInput" placeholder="How do I take a screenshot?"></textarea></div>'
    +'<button class="cta" id="chatSend">Send</button></div></div>'
    // video modal
    +'<div class="video-modal" id="videoModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Video player">'
    +'<button type="button" class="vm-close" id="vmClose" aria-label="Close video"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
    +'<div class="vm-inner"><div class="vm-frame" id="vmFrame"></div><div class="vm-title" id="vmTitle"></div></div></div>';
  while(overlays.firstChild)document.body.appendChild(overlays.firstChild);

  // populate mobile-sheet link icons from the ICONS map
  document.querySelectorAll('.menu a[data-ico]').forEach(a=>a.insertAdjacentHTML('afterbegin',svg(a.dataset.ico,19)));

  wireChrome();
}

function wireChrome(){
  // controls
  const menuBtn=document.getElementById('menuBtn');
  const searchBtn=document.getElementById('searchBtn');
  const agentBtn=document.getElementById('agentBtn');
  if(menuBtn)menuBtn.addEventListener('click',e=>{e.stopPropagation();setMenu(menuBtn.getAttribute('aria-expanded')!=='true');});
  if(searchBtn)searchBtn.addEventListener('click',e=>{e.stopPropagation();setSearch(searchBtn.getAttribute('aria-expanded')!=='true');});
  if(agentBtn)agentBtn.addEventListener('click',()=>{document.getElementById('chatWindow').classList.contains('open')?closeChat():openChat();});

  // menu sheet
  document.getElementById('menuScrim').addEventListener('click',()=>setMenu(false));
  document.getElementById('menuAgent').addEventListener('click',e=>{e.stopPropagation();setMenu(false);openChat();});
  document.getElementById('menuSearch').addEventListener('click',e=>{e.stopPropagation();setMenu(false);setSearch(true);});

  // search
  SEARCH_INDEX=buildIndex();
  const searchInput=document.getElementById('search');
  searchInput.addEventListener('input',e=>runSearch(e.target.value));
  searchInput.addEventListener('keydown',e=>{if(e.key==='Escape'){searchInput.value='';runSearch('');setSearch(false);}});
  document.getElementById('searchCancel').addEventListener('click',()=>setSearch(false));
  document.getElementById('searchPop').addEventListener('click',e=>{if(e.target===e.currentTarget)setSearch(false);});

  // chat
  document.getElementById('chatSend').onclick=()=>sendChat();
  document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  document.querySelectorAll('.chat-chip').forEach(c=>c.addEventListener('click',()=>sendChat(c.textContent)));
  document.getElementById('chatClose').addEventListener('click',closeChat);

  // help-desk copy (event delegation; works for footer + resources card)
  document.addEventListener('click',e=>{
    if(e.target.closest&&e.target.closest('#footHelpBtn'))copyTo('footHelpBtn');
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

  // global escape
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);setSearch(false);closeChat();closeVideo();}});

  // swipe-to-dismiss the mobile sheet
  wireSheetSwipe();
}

function wireSheetSwipe(){
  const menuEl=document.getElementById('menu');if(!menuEl)return;
  let startY=0,curY=0,dragging=false,t0=0;
  const isSheet=()=>window.matchMedia('(max-width:560px)').matches;
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function reset(snap){menuEl.style.transition=snap&&!reduce?'transform .22s ease':'';menuEl.style.transform=snap?'':'';}
  menuEl.addEventListener('touchstart',e=>{if(!isSheet()||!menuEl.classList.contains('open'))return;startY=curY=e.touches[0].clientY;dragging=true;t0=Date.now();menuEl.style.transition='none';},{passive:true});
  menuEl.addEventListener('touchmove',e=>{if(!dragging)return;curY=e.touches[0].clientY;const dy=Math.max(0,curY-startY);menuEl.style.transform='translateY('+dy+'px)';},{passive:true});
  menuEl.addEventListener('touchend',()=>{if(!dragging)return;dragging=false;const dy=curY-startY,vel=dy/Math.max(1,Date.now()-t0);if(dy>80||(vel>0.5&&dy>40)){menuEl.style.transition='';setMenu(false);menuEl.style.transform='';}else{reset(true);}});
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
