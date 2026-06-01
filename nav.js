/* ============================================================
   Mac Hub navigation injector.  Pairs with nav.css.

   Usage (zero-config): just load nav.css then nav.js. It injects
   the trigger, scrim and panel into every page, highlights the
   current page automatically, and runs universal search.

   Hooks (all optional, read lazily so they can be set anywhere):
     - Assistant: define window.openChat (a function), OR listen
       for the "machub:ask-ai" event, OR pass onAskAI to init().
     - Search index: set window.MAC_HUB_SEARCH_INDEX to an array
       of { title, page, href }, OR pass searchIndex to init().
       A small demo index is used until you provide a real one.

   Override defaults before DOMContentLoaded if needed, e.g.
     MacHubNav.init({ pages:[...], helpEmail:'...', adminHref:'...' });
   ============================================================ */
(function(){
  'use strict';
  if (window.MacHubNav && window.MacHubNav._rendered) return;

  function assign(t){ for(var i=1;i<arguments.length;i++){var s=arguments[i];if(s)for(var k in s)if(Object.prototype.hasOwnProperty.call(s,k))t[k]=s[k];}return t; }
  function norm(s){ return String(s).toLowerCase().replace(/-/g,''); }           // hyphen-insensitive: wifi matches Wi-Fi
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function el(html){ var t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; }
  function currentFile(){ var p=location.pathname.split('/').pop(); return (!p) ? 'index.html' : p; }

  var DEFAULTS = {
    pages: [
      {label:'Home',           href:'index.html'},
      {label:'Windows vs Mac', href:'windows-vs-mac.html'},
      {label:'Shortcuts',      href:'shortcuts.html'},
      {label:'Gestures',       href:'gestures.html'},
      {label:'Apps',           href:'apps.html'},
      {label:'Accessibility',  href:'accessibility.html'},
      {label:'Videos',         href:'videos.html'},
      {label:'FAQ',            href:'faq.html'},
      {label:'Resources',      href:'resources.html'}
    ],
    helpEmail: 'helpdesk@pleasantvilleschools.org',
    adminHref: 'admin.html',
    onAskAI: null,
    searchIndex: null
  };

  // demo index, replaced by your real cross-page index from content.js
  var DEMO_INDEX = [
    {title:'Connect to Wi-Fi',            page:'FAQ',            href:'faq.html'},
    {title:'Copy, cut and paste',         page:'Shortcuts',      href:'shortcuts.html'},
    {title:'Take a screenshot',           page:'Shortcuts',      href:'shortcuts.html'},
    {title:'Right-click on the trackpad', page:'Gestures',       href:'gestures.html'},
    {title:'Swipe between desktops',      page:'Gestures',       href:'gestures.html'},
    {title:'Where your files live',       page:'Windows vs Mac', href:'windows-vs-mac.html'},
    {title:'Install an app',              page:'Apps',           href:'apps.html'},
    {title:'Turn on VoiceOver',           page:'Accessibility',  href:'accessibility.html'},
    {title:'Reset your password',         page:'Resources',      href:'resources.html'}
  ];

  var CONFIG = assign({}, DEFAULTS);
  var rendered = false;
  var body, toggle, panel, scrim, search, results, lastFocus = null;

  var SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15" y2="15"/></svg>';
  var LOCK_SVG   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  function getIndex(){ return CONFIG.searchIndex || window.MAC_HUB_SEARCH_INDEX || DEMO_INDEX; }

  function askAI(){
    if (typeof CONFIG.onAskAI === 'function') { CONFIG.onAskAI(); return; }
    if (typeof window.openChat === 'function') { window.openChat(); return; }
    document.dispatchEvent(new CustomEvent('machub:ask-ai'));
  }

  function render(){
    body = document.body;
    var here = currentFile();

    var linksHtml = CONFIG.pages.map(function(p){
      var active = (p.href.split('/').pop() === here) ? ' aria-current="page"' : '';
      return '<a href="'+esc(p.href)+'"'+active+'>'+esc(p.label)+'</a>';
    }).join('');

    var bar = el('<header class="mh-bar"><button class="mh-toggle" id="mhNavToggle" aria-expanded="false" aria-controls="mhNavPanel" aria-label="Open menu"><span class="mh-bars"><span></span><span></span></span></button></header>');
    scrim = el('<div class="mh-scrim" id="mhNavScrim" hidden></div>');
    panel = el(
      '<aside class="mh-panel" id="mhNavPanel" role="dialog" aria-modal="true" aria-label="Site menu" hidden>'+
        '<nav>'+
          '<div class="mh-search">'+SEARCH_SVG+'<input id="mhNavSearch" type="search" placeholder="Search Mac Hub" aria-label="Search Mac Hub" autocomplete="off"></div>'+
          '<div class="mh-primary">'+linksHtml+'</div>'+
          '<div class="mh-actions">'+
            '<a href="mailto:'+esc(CONFIG.helpEmail)+'">Get Help</a>'+
            '<button type="button" id="mhAskAi">Ask AI</button>'+
          '</div>'+
          '<div class="mh-results" id="mhNavResults" role="region" aria-label="Search results"></div>'+
          '<div class="mh-bottom"><a class="mh-lock" href="'+esc(CONFIG.adminHref)+'" aria-label="Admin">'+LOCK_SVG+'</a></div>'+
        '</nav>'+
      '</aside>'
    );

    body.appendChild(bar);
    body.appendChild(scrim);
    body.appendChild(panel);

    toggle  = document.getElementById('mhNavToggle');
    search  = document.getElementById('mhNavSearch');
    results = document.getElementById('mhNavResults');

    wire();
  }

  function focusable(){
    return Array.prototype.slice.call(panel.querySelectorAll('a[href],button:not([disabled]),input'));
  }
  function isOpen(){ return body.classList.contains('mh-menu-open'); }

  function resetSearch(){ search.value=''; panel.classList.remove('mh-searching'); results.innerHTML=''; }

  function open(){
    lastFocus = document.activeElement;
    resetSearch();
    panel.hidden = false; scrim.hidden = false;
    requestAnimationFrame(function(){ body.classList.add('mh-menu-open'); });
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
    var fine = window.matchMedia('(pointer:fine)').matches;
    var first = fine ? search : panel.querySelector('.mh-primary a');
    if (first) { setTimeout(function(){ first.focus(); }, 80); }
  }

  function close(){
    body.classList.remove('mh-menu-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    var onEnd = function(e){
      if (e.target !== panel || e.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onEnd);
      if (!isOpen()) { panel.hidden = true; scrim.hidden = true; }
    };
    panel.addEventListener('transitionend', onEnd);
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  function wire(){
    toggle.addEventListener('click', function(){ isOpen() ? close() : open(); });
    scrim.addEventListener('click', close);

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && isOpen()) { close(); return; }
      if (e.key === 'Tab' && isOpen()) {
        var f = [toggle].concat(focusable());
        if (!f.length) return;
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey) { if (i <= 0) { e.preventDefault(); f[f.length-1].focus(); } }
        else { if (i === f.length-1) { e.preventDefault(); f[0].focus(); } }
      }
    });

    // follow an in-site link, then close
    panel.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (a && a.getAttribute('target') !== '_blank') { close(); }
    });

    document.getElementById('mhAskAi').addEventListener('click', function(){ close(); askAI(); });

    search.addEventListener('input', function(){
      var raw = search.value.trim();
      if (!raw) { panel.classList.remove('mh-searching'); results.innerHTML=''; return; }
      var q = norm(raw);
      panel.classList.add('mh-searching');
      var hits = getIndex().filter(function(it){ return norm((it.title||'')+' '+(it.page||'')).indexOf(q) > -1; });
      if (!hits.length) { results.innerHTML = '<div class="mh-no-results">No matches for that yet.</div>'; return; }
      results.innerHTML = hits.map(function(it){
        return '<a class="mh-result" href="'+esc(it.href)+'">'+
               '<span class="mh-r-title">'+esc(it.title)+'</span>'+
               '<span class="mh-r-page">'+esc(it.page||'')+'</span></a>';
      }).join('');
    });
  }

  function init(options){
    if (options) assign(CONFIG, options);
    if (rendered) return window.MacHubNav;
    render();
    rendered = true;
    window.MacHubNav._rendered = true;
    return window.MacHubNav;
  }

  window.MacHubNav = { init: init, open: function(){ rendered && open(); }, close: function(){ rendered && close(); }, _rendered: false };

  function autoInit(){ if (!rendered) init({}); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
  else autoInit();
})();
