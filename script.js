// ─────────────────────────────────────────────
// DIJO CREW v2 — script.js
// Local / Cloud AI Server
// ─────────────────────────────────────────────

const SERVER = 'http://localhost:3000';

let activePlat  = 'ig';
let activeCtype = 'ad';
let isSpeaking  = false;
let lastSpeech  = null;

const CHARS = {
  ig: { name:'DIJO-IG', platform:'Instagram', color:'#E1306C', voice:{ pitch:1.2, rate:.95 } },
  tt: { name:'DIJO-TT', platform:'TikTok',    color:'#69C9D0', voice:{ pitch:1.4, rate:1.1 } },
  yt: { name:'DIJO-YT', platform:'YouTube',   color:'#FF4444', voice:{ pitch:.9,  rate:1.0 } },
  li: { name:'DIJO-LI', platform:'LinkedIn',  color:'#00A0DC', voice:{ pitch:.8,  rate:.88 } },
};

const HOME    = { ig:'120px', tt:'215px', yt:'310px', li:'405px' };
const SPOTPOS = { ig:'18%',   tt:'32%',   yt:'46%',   li:'60%'   };

const STAGES = {
  ig: { label:'INSTAGRAM STUDIO', bg:'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=900&q=80' },
  tt: { label:'TIKTOK STAGE',     bg:'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=900&q=80' },
  yt: { label:'YOUTUBE STUDIO',   bg:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80' },
  li: { label:'BOARDROOM STUDIO', bg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80' },
};

const BROLL = {
  fitness: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80',
  gym:     'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80',
  business:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
  food:    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80',
  travel:  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
  fashion: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  tech:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80',
  music:   'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=80',
  beauty:  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80',
  sport:   'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80',
};

const CTYPE_LABELS = {
  ad:'Ad / Promo',
  tutorial:'Tutorial / How-to',
  reaction:'Reaction / Opinion',
  announcement:'Announcement',
  story:'Storytelling',
};

// ─────────────────────────────────────────────
// SERVER CALL WITH RETRY
// ─────────────────────────────────────────────
async function callServer(brief, agent, contentType) {

  for(let attempt=1; attempt<=3; attempt++){

    try{

      const res = await fetch(SERVER + '/generate', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({brief,agent,contentType})
      });

      if(!res.ok) throw new Error("Server error "+res.status);

      const data = await res.json();
      return data.text || '';

    }catch(err){

      console.log("Server not ready, retrying...", attempt);

      if(attempt === 3) throw err;

      await new Promise(r=>setTimeout(r,3000));

    }

  }

}

// ─────────────────────────────────────────────
// BUILD AI PROMPT
// ─────────────────────────────────────────────
function buildBrief(charKey, ctype, script) {

  const personalities = {
    ig:'warm, aesthetic, aspirational — visual storytelling style',
    tt:'fast, energetic, Gen-Z — hook in first 2 seconds',
    yt:'engaging, value-driven, clear',
    li:'professional, insightful, authoritative',
  };

  const c = CHARS[charKey];

  return `You are ${c.name}, an animated ${c.platform} creator performing in a studio.

User idea: "${script}"

Rewrite it perfectly for ${c.platform}.

Return EXACTLY in this format:

[SCENE] action in studio
[SCRIPT] spoken script
[ACTION] closing gesture`;
}

// ─────────────────────────────────────────────
// CHARACTER SELECT
// ─────────────────────────────────────────────
function selectChar(c){

  activePlat=c;

  ['ig','tt','yt','li'].forEach(k=>{
    document.getElementById('tab-'+k).className='ptab'+(k===c?' on-'+k:'');
    document.getElementById('char-'+k).classList.toggle('active',k===c);
  });

  document.getElementById('beam1').style.left=SPOTPOS[c];
  setBackground(c,'');
  document.getElementById('stage-label').textContent=STAGES[c].label;
  document.getElementById('live-status').textContent='STANDBY';

}

// ─────────────────────────────────────────────
// CONTENT TYPE
// ─────────────────────────────────────────────
function swType(t){

  activeCtype=t;

  ['ad','tutorial','reaction','announcement','story'].forEach(k=>{
    document.getElementById('ct-'+k).classList.toggle('on',k===t);
  });

}

// ─────────────────────────────────────────────
// BACKGROUND
// ─────────────────────────────────────────────
function setBackground(plat,brief){

  let url=STAGES[plat].bg;

  const topic=brief.toLowerCase();

  for(const [kw,u] of Object.entries(BROLL)){
    if(topic.includes(kw)){url=u;break;}
  }

  const el=document.getElementById('stage-bg');
  el.style.backgroundImage=`url(${url})`;
  el.classList.add('show');

}

// ─────────────────────────────────────────────
// SPEECH ENGINE
// ─────────────────────────────────────────────
function speakText(text,charKey){

  if(!text) return;

  window.speechSynthesis.cancel();

  const utt=new SpeechSynthesisUtterance(text);

  const v=CHARS[charKey].voice;

  utt.pitch=v.pitch;
  utt.rate=v.rate;

  isSpeaking=true;
  lastSpeech={text,charKey};

  document.getElementById('live-status').textContent='ON AIR';

  utt.onend=()=>{
    isSpeaking=false;
    document.getElementById('live-status').textContent='STANDBY';
    moveHome(charKey);
  };

  window.speechSynthesis.speak(utt);

}

// ─────────────────────────────────────────────
// PERFORM
// ─────────────────────────────────────────────
async function perform(){

  const script=document.getElementById('script-inp').value.trim();

  if(!script){
    document.getElementById('script-inp').focus();
    return;
  }

  const out=document.getElementById('out-area');

  out.innerHTML='<div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>';

  try{

    const brief=buildBrief(activePlat,activeCtype,script);

    const raw=await callServer(brief,CHARS[activePlat].name,'script');

    const scriptM=raw.match(/\[SCRIPT\]([\s\S]*)/);

    const spoken=scriptM?scriptM[1].trim():raw;

    out.innerHTML=`<div class="out-script">${spoken}</div>`;

    speakText(spoken,activePlat);

  }catch(err){

    console.error(err);

    out.innerHTML=`<div class="err">
    ⚠ AI server not reachable.<br>
    Make sure your Node server is running.<br>
    </div>`;

  }

}

// ── INIT ──
selectChar('ig');
