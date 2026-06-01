/* content.js — single source of truth: all site data + icon maps.
   Loaded by every page before app.js. Edit content here (or via /admin). */

const CONTENT = {
  meta:{ title:"Your Mac, made simple", tagline:"We're excited to be bringing Apple to Pleasantville High School. This guide will help students and staff get started and answer the questions that come up along the way." },
  switch:[
    {topic:"Copy, cut & paste",win:"Ctrl + C / X / V",mac:"\u2318 Command + C / X / V"},
    {topic:"Right-click",win:"Right mouse button",mac:"Click or tap with two fingers, or Control-click"},
    {topic:"Find & open things",win:"Start menu",mac:"Spotlight (\u2318 + Space) or Launchpad"},
    {topic:"Files & folders",win:"File Explorer",mac:"Finder, the smiley face in the Dock"},
    {topic:"The app bar",win:"Taskbar",mac:"The Dock along the bottom of the screen"},
    {topic:"Switch apps",win:"Alt + Tab",mac:"\u2318 Command + Tab"},
    {topic:"Close or quit an app",win:"Click the X to close",mac:"The red dot hides the window; \u2318 + Q quits. Closing is not the same as quitting."},
    {topic:"Force quit a frozen app",win:"Ctrl + Alt + Delete",mac:"\u2318 + Option + Esc"},
    {topic:"Take a screenshot",win:"Print Screen",mac:"\u2318 + Shift + 4 for part of the screen, \u2318 + Shift + 3 for all of it"}
  ],
  shortcuts:[
    {group:"Everyday",items:[
      {label:"Copy",keys:["\u2318","C"]},
      {label:"Paste",keys:["\u2318","V"]},
      {label:"Undo",keys:["\u2318","Z"]},
      {label:"Select all",keys:["\u2318","A"]},
      {label:"Save",keys:["\u2318","S"]},
      {label:"Find on page",keys:["\u2318","F"]},
      {label:"Spotlight search",keys:["\u2318","Space"]},
      {label:"New browser tab",keys:["\u2318","T"]},
      {label:"Reopen closed tab",keys:["\u2318","\u21e7","T"]}
    ]},
    {group:"Windows & apps",items:[
      {label:"Switch between open apps",keys:["\u2318","Tab"]},
      {label:"Quit the current app",keys:["\u2318","Q"]},
      {label:"Close the current window",keys:["\u2318","W"]},
      {label:"Force quit a frozen app",keys:["\u2318","\u2325","Esc"]},
      {label:"Mission Control (see all windows)",keys:["\u2303","\u2191"]},
      {label:"Lock the screen",keys:["\u2303","\u2318","Q"]}
    ]},
    {group:"Screenshots",items:[
      {label:"Capture the whole screen",keys:["\u2318","\u21e7","3"]},
      {label:"Capture a selected area",keys:["\u2318","\u21e7","4"]},
      {label:"Screenshot & recording tools",keys:["\u2318","\u21e7","5"]}
    ]}
  ],
  gestures:[
    {name:"Scroll",how:"Slide two fingers up or down",ico:"scroll",doc:"https://support.apple.com/guide/mac-help/use-trackpad-and-mouse-gestures-mh35884/mac"},
    {name:"Right click",how:"Click or tap with two fingers",ico:"tap",doc:"https://support.apple.com/guide/mac-help/right-click-on-mac-mchlp1380/mac"},
    {name:"Mission Control",how:"Swipe up with three or four fingers",ico:"up",doc:"https://support.apple.com/guide/mac-help/mission-control-mh35798/mac"},
    {name:"Switch full-screen apps",how:"Swipe left or right with three fingers",ico:"side",doc:"https://support.apple.com/guide/mac-help/use-trackpad-and-mouse-gestures-mh35884/mac"},
    {name:"Show Desktop",how:"Spread thumb and three fingers apart",ico:"spread",doc:"https://support.apple.com/guide/mac-help/use-trackpad-and-mouse-gestures-mh35884/mac"},
    {name:"Zoom in and out",how:"Pinch with two fingers",ico:"pinch",doc:"https://support.apple.com/guide/mac-help/zoom-in-on-the-screen-mchlp2745/mac"}
  ],
  apps:[
    {name:"Finder",icon:"finder",desc:"Browse files and folders, the way File Explorer did. The smiley icon lives at the left end of the Dock.",url:"https://support.apple.com/guide/mac-help/welcome/mac"},
    {name:"Safari",icon:"safari",desc:"Apple's web browser, tuned for speed, privacy, and battery life. If you used Edge or Chrome, it will feel familiar.",url:"https://support.apple.com/safari"},
    {name:"Notes",icon:"notes",desc:"Quick notes, checklists, and scanned documents that sync across your Apple devices. Handy for jotting things down fast.",url:"https://support.apple.com/guide/notes/welcome/mac"},
    {name:"Pages",icon:"pages",desc:"Apple's word processor, included free. We use Word for schoolwork, but Pages can open and export Word files if you need it.",url:"https://support.apple.com/guide/pages/welcome/mac"},
    {name:"Numbers",icon:"numbers",desc:"Apple's spreadsheet app, included free. We use Excel for schoolwork, but Numbers can open and export Excel files if you need it.",url:"https://support.apple.com/guide/numbers/welcome/mac"},
    {name:"Keynote",icon:"keynote",desc:"Apple's slides app, included free. We use PowerPoint for schoolwork, but Keynote can open and export PowerPoint files if you need it.",url:"https://support.apple.com/guide/keynote/welcome/mac"},
    {name:"Freeform",icon:"freeform",desc:"A flexible whiteboard for sketching ideas, planning, and collaborating on an endless canvas.",url:"https://support.apple.com/guide/freeform/welcome/mac"},
    {name:"Photos",icon:"photos",desc:"Your picture library, with simple editing tools and all your saved screenshots.",url:"https://support.apple.com/guide/photos/welcome/mac"},
    {name:"System Settings",icon:"settings",desc:"Where every preference lives, from Wi-Fi and displays to trackpad behavior. The Mac's Control Panel.",url:"https://support.apple.com/guide/mac-help/change-system-settings/mac"},
    {name:"Spotlight",icon:"spotlight",desc:"Press \u2318 + Space, then type to open apps, find files, do quick math, and search the web.",url:"https://support.apple.com/guide/mac-help/search-with-spotlight-mchlp1008/mac"},
    {name:"Tips",icon:"tips",desc:"Apple's built-in app of short how-tos and demo videos for getting more out of your Mac.",url:"https://support.apple.com/guide/tips/welcome/web"}
  ],
  faq:[
    {q:"How do I take a screenshot?",a:"Press \u2318 + Shift + 4 to capture part of the screen, or \u2318 + Shift + 3 for the whole thing. Press \u2318 + Shift + 5 for the full screenshot and screen-recording toolbar."},
    {q:"Where did my files go after closing an app?",a:"Closing a window with the red dot does not quit the app or lose your files. Open the app again from the Dock, or use \u2318 + Tab to switch back to it. Files you saved are in Finder."},
    {q:"How do I right-click without a mouse?",a:"Click the trackpad with two fingers, or hold the Control key and click. You can also turn on bottom-right-corner clicking in System Settings > Trackpad."},
    {q:"How do I install or update apps?",a:"The Mac App Store is not available on district devices. Instead, open the Manager app (from Mosyle) to browse and install apps approved by Pleasantville Technology. Some apps and updates install automatically. If something you need is missing, reach out to the Technology Department to request it."},
    {q:"How do I connect to my home Wi-Fi network?",a:"Click the Wi-Fi icon in the menu bar at the top-right of the screen. Turn Wi-Fi on if it is off, then pick your home network from the list and enter its password when asked. Your Mac remembers the network and reconnects automatically the next time you are home. If you do not see your network, make sure Wi-Fi is on and that you are close enough to the router."},
    {q:"What's the difference between iCloud Drive and OneDrive?",a:"Both store your files in the cloud so you can reach them from any device. For schoolwork, use OneDrive. It comes with your district Microsoft 365 account, works alongside Word, Excel, PowerPoint, and Teams, and is where the Technology Department expects your school files to live. iCloud Drive is Apple's version, and a few of Apple's own apps, like Pages, Numbers, Keynote, and Notes, save there by default. That is fine, but when something matters for class, save or move it to OneDrive so it is backed up in the right place and easy to share with teachers."},
    {q:"How do I check for software updates?",a:"Open System Settings, click General, then Software Update. District devices may install some updates for you, so check here if you are asked to update."}
  ],
  resources:[
    {rname:"Apple Support",rdesc:"Official help for Mac and macOS apps",url:"https://support.apple.com"},
    {rname:"Mac User Guide",rdesc:"The full built-in guide for macOS",url:"https://support.apple.com/guide/mac-help/welcome/mac"}
  ],
  accessibility:[
    {name:"Zoom in on the screen",desc:"Magnify the whole screen or just one area to read small text more easily.",ico:"zoom",url:"https://support.apple.com/guide/mac-help/zoom-in-on-your-mac-screen-mchl779716b8/mac"},
    {name:"Make text bigger",desc:"Bump up the size of text and icons across apps with a single slider.",ico:"text",url:"https://support.apple.com/guide/mac-help/make-text-and-icons-bigger-mchld786f2cd/mac"},
    {name:"Dictate instead of type",desc:"Talk and your Mac types it out. Useful for notes, essays, and assignments.",ico:"dictate",url:"https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac"},
    {name:"Have your Mac read aloud",desc:"Select any text and have it read back to you, with words highlighted as it goes.",ico:"speak",url:"https://support.apple.com/guide/mac-help/have-your-mac-speak-text-thats-on-the-screen-mh27448/mac"},
    {name:"Reduce on-screen motion",desc:"Calm down animations and movement to cut distraction and focus while you work.",ico:"motion",url:"https://support.apple.com/guide/mac-help/change-display-settings-for-accessibility-unac089/mac"},
    {name:"Adjust display colors",desc:"Apply color filters or a tint to make text easier to read and reduce eye strain.",ico:"color",url:"https://support.apple.com/guide/mac-help/change-display-settings-for-accessibility-unac089/mac"}
  ],
  // Video Gallery — replace yt with the real YouTube video ID (the part after v= or youtu.be/).
  // duration is optional display text. Thumbnails auto-pull from YouTube when yt is a real ID.
  videos:[
    {title:"Getting started with your MacBook",yt:"dQw4w9WgXcQ",duration:"4:12"},
    {title:"Finding your way around the Dock and Finder",yt:"dQw4w9WgXcQ",duration:"3:45"},
    {title:"Trackpad gestures every student should know",yt:"dQw4w9WgXcQ",duration:"5:20"},
    {title:"Saving your work to OneDrive",yt:"dQw4w9WgXcQ",duration:"2:58"},
    {title:"Installing apps from the Manager app",yt:"dQw4w9WgXcQ",duration:"3:30"},
    {title:"Keyboard shortcuts that save time",yt:"dQw4w9WgXcQ",duration:"4:05"}
  ],
  helpEmail:"helpdesk@pleasantvilleschools.org"
};

const BROWSE=[
  {id:"switch",t:"Windows vs. Mac",d:"How everything maps over",ico:"swap",k:"switch"},
  {id:"shortcuts",t:"Keyboard Shortcuts",d:"The keys that save time",ico:"cmd",k:"shortcuts"},
  {id:"gestures",t:"Gestures",d:"Trackpad moves to know",ico:"hand",k:"gestures"},
  {id:"apps",t:"Native Apps",d:"What comes built in",ico:"grid",k:"apps"},
  {id:"accessibility",t:"Accessibility",d:"Built-in tools that help",ico:"access",k:"accessibility"},
  {id:"videos",t:"Video Gallery",d:"Short how-to videos",ico:"video",k:"videos"},
  {id:"faq",t:"FAQ",d:"Common questions answered",ico:"help",k:"faq"},
  {id:"assistant",t:"Ask the Assistant",d:"Get a quick answer",ico:"spark",k:null}
];

const ICONS={
  // section icons — Tabler Icons (MIT), drawn on 24x24, rendered at 1.8 stroke
  swap:'<path d="M8.286 7.008c-3.216 0-4.286 3.23-4.286 5.92 0 3.229 2.143 8.072 4.286 8.072 1.165-.05 1.799-.538 3.214-.538 1.406 0 1.607.538 3.214.538s4.286-3.229 4.286-5.381c-.03-.011-2.649-.434-2.679-3.23-.02-2.335 2.589-3.179 2.679-3.228-1.096-1.606-3.162-2.113-3.75-2.153-1.535-.12-3.032 1.077-3.75 1.077-.729 0-2.036-1.077-3.214-1.077"/><path d="M12 4a2 2 0 0 0 2-2 2 2 0 0 0-2 2"/>',
  cmd:'<path d="M7 9a2 2 0 1 1 2-2v10a2 2 0 1 1-2-2h10a2 2 0 1 1-2 2v-10a2 2 0 1 1 2 2h-10"/>',
  hand:'<path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7l-.196-.3c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022 1.867 1.867 0 0 1 2.28.28l1.47 1.47"/><path d="M2.541 5.594a13.487 13.487 0 0 1 2.46-1.427"/><path d="M14 3.458c1.32.354 2.558.902 3.685 1.612"/>',
  grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  help:'<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.5 2-2.5 3.5"/><circle cx="12" cy="17.3" r=".6" fill="currentColor" stroke="none"/>',
  spark:'<path d="M12 2l1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9z"/>',
  book:'<path d="M12 4l-8 4l8 4l8-4l-8-4"/><path d="M4 12l8 4l8-4"/><path d="M4 16l8 4l8-4"/>',
  ext:'<path d="M7 17 17 7M8.5 7H17v8.5"/>',
  video:'<path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z"/><rect x="3" y="6" width="12" height="12" rx="2"/>',
  // accessibility — Tabler "accessible"
  access:'<path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0"/><path d="M10 16.5l2-3l2 3m-2-3v-2l3-1m-6 0l3 1"/><path d="M11.5 7.5a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0" fill="currentColor"/>',
  zoom:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.2 15.2 20 20M8 10.5h5M10.5 8v5"/>',
  text:'<path d="M5 7V5.5h14V7M12 5.5V19m-2.5 0h5"/><path d="M16.5 13.5V13h4v.5M18.5 13v6m-1 0h2"/>',
  dictate:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-2.5 0h5"/>',
  speak:'<path d="M4 9.5h3l4-3.5v12l-4-3.5H4z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  motion:'<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/><path d="M12 12 8.5 9.5" opacity=".4"/>',
  color:'<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2 0-1.3-1-1.5-1-2.5 0-.8.7-1.5 1.5-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="8" cy="11" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1.1" fill="currentColor" stroke="none"/><circle cx="16" cy="10.5" r="1.1" fill="currentColor" stroke="none"/>'
};

const APP_ICONS={
  finder:'<defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3aa0ff"/><stop offset="1" stop-color="#1a6ff0"/></linearGradient></defs><rect width="52" height="52" rx="13" fill="#e9eef5"/><path d="M26 0h13a13 13 0 0 1 13 13v26a13 13 0 0 1-13 13H26z" fill="url(#gf)"/><path d="M16 17v6M36 17v6" stroke="#1a4c8f" stroke-width="2.4" stroke-linecap="round"/><path d="M19 33c2 2.4 4.4 3.6 7 3.6s5-1.2 7-3.6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>',
  safari:'<rect width="52" height="52" rx="13" fill="#f2f5f8"/><circle cx="26" cy="26" r="17" fill="#1a8cff"/><circle cx="26" cy="26" r="17" fill="none" stroke="#0a6fd6" stroke-width="1.5"/><path d="M26 26 36 16 30 28z" fill="#fff"/><path d="M26 26 16 36 22 24z" fill="#ff5a4d"/>',
  notes:'<rect width="52" height="52" rx="13" fill="#fff"/><path d="M0 13a13 13 0 0 1 13-13h26a13 13 0 0 1 13 13H0z" fill="#ffd23f"/><path d="M14 24h24M14 31h24M14 38h16" stroke="#c9b020" stroke-width="2.2" stroke-linecap="round"/>',
  pages:'<rect width="52" height="52" rx="13" fill="#ff8a3d"/><rect x="16" y="13" width="20" height="26" rx="3" fill="#fff"/><path d="M20 20h12M20 25h12M20 30h8" stroke="#e07a2c" stroke-width="2" stroke-linecap="round"/>',
  numbers:'<rect width="52" height="52" rx="13" fill="#3ddc84"/><rect x="15" y="15" width="22" height="22" rx="3" fill="#fff"/><path d="M22 32V24M26 32V20M30 32V27" stroke="#27a866" stroke-width="2.4" stroke-linecap="round"/>',
  keynote:'<rect width="52" height="52" rx="13" fill="#5eb0ff"/><rect x="14" y="16" width="24" height="16" rx="2.5" fill="#fff"/><path d="M24 21l5 3-5 3z" fill="#3b8fe0"/><path d="M26 34v3M22 39h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  freeform:'<rect width="52" height="52" rx="13" fill="#1c1c1e"/><rect x="14" y="14" width="24" height="24" rx="5" fill="none" stroke="#5eb0ff" stroke-width="2.4"/><circle cx="20" cy="20" r="2.4" fill="#ff5a4d"/><path d="M24 30c2-4 6-4 8 0" stroke="#3ddc84" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
  photos:'<rect width="52" height="52" rx="13" fill="#fff"/><g transform="translate(26 26)"><circle cx="0" cy="-9" r="5.5" fill="#ffce47"/><circle cx="8.5" cy="-2.8" r="5.5" fill="#ff5a4d"/><circle cx="5.3" cy="7.3" r="5.5" fill="#c45bd6"/><circle cx="-5.3" cy="7.3" r="5.5" fill="#3aa0ff"/><circle cx="-8.5" cy="-2.8" r="5.5" fill="#3ddc84"/></g>',
  settings:'<rect width="52" height="52" rx="13" fill="#8e8e93"/><circle cx="26" cy="26" r="13" fill="none" stroke="#fff" stroke-width="3"/><circle cx="26" cy="26" r="4" fill="#fff"/><g stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M26 9v5M26 38v5M9 26h5M38 26h5M14 14l3.5 3.5M34.5 34.5 38 38M38 14l-3.5 3.5M17.5 34.5 14 38"/></g>',
  tips:'<rect width="52" height="52" rx="13" fill="#ffd23f"/><path d="M26 13a9 9 0 0 0-5 16.5c.8.6 1.3 1.3 1.4 2.2l.3 2.3h6.6l.3-2.3c.1-.9.6-1.6 1.4-2.2A9 9 0 0 0 26 13z" fill="#fff"/><path d="M22 38h8M23 41h6" stroke="#c9920a" stroke-width="2.4" stroke-linecap="round"/>',
  spotlight:'<rect width="52" height="52" rx="13" fill="#2a2a2e"/><circle cx="23" cy="23" r="9" fill="none" stroke="#fff" stroke-width="3"/><path d="M30 30l8 8" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>',
  generic:'<rect width="52" height="52" rx="13" fill="#2a2a2a"/><rect x="14" y="14" width="24" height="24" rx="6" fill="none" stroke="#8a8985" stroke-width="2"/>'
};
