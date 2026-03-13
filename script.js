// ─────────────────────────────────────────────
// DIJO CREW v2 — script.js
// Animated characters + voice + AI performance
// ─────────────────────────────────────────────

const SERVER = 'https://dijo-ai.onrender.com';

let activePlat  = 'ig';
let activeCtype = 'ad';
let isSpeaking  = false;
let lastSpeech  = null;

// ── CHARACTER CONFIG ──
const CHARS = {
  ig: { name:'DIJO-IG', platform:'Instagram', color:'#E1306C', voice:{ pitch:1.2, rate:.95 } },
  tt: { name:'DIJO-TT', platform:'TikTok',    color:'#69C9D0', voice:{ pitch:1.4, rate:1.1 } },
  yt: { name:'DIJO-YT', platform:'YouTube',   color:'#FF4444', voice:{ pitch:.9,  rate:1.0 } },
  li: { name:'DIJO-LI', platform:'LinkedIn',  color:'#00A0DC', voice:{ pitch:.8,  rate:.88 } },
};

// ── HOME POSITIONS ──
const HOME = { ig:'120px', tt:'215px', yt:'310px', li:'405px' };

// ── SPOTLIGHT POSITIONS ──
const SPOTPOS = { ig:'18%', tt:'32%', yt:'46%', li:'60%' };

// ── STAGE BACKGROUNDS ──
const STAGES = {
  ig: { label:'INSTAGRAM STUDIO', bg:'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=900&q=80' },
  tt: { label:'TIKTOK STAGE',     bg:'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=900&q=80' },
  yt: { label:'YOUTUBE STUDIO',   bg:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80' },
  li: { label:'BOARDROOM STUDIO', bg:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80' },
};

// ── B-ROLL KEYWORD OVERRIDES ──
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

// ── CONTENT TYPE LABELS ──
const CTYPE_LABELS = {
  ad:           'Ad / Promo',
  tutorial:     'Tutorial / How-to',
  reaction:     'Reaction / Opinion',
  announcement: 'Announcement',
  story:        'Storytelling',
};

// ─────────────────────────────────────────────
// SELECT CHARACTER
// ─────────────────────────────────────────────
function selectChar(c) {
  activePlat = c;

  // Update tab styles
  ['ig','tt','yt','li'].forEach(k => {
    document.getElementById('tab-'+k).className = 'ptab' + (k === c ? ' on-'+k : '');
  });

  // Highlight active character
  ['ig','tt','yt','li'].forEach(k => {
    document.getElementById('char-'+k).classList.toggle('active', k === c);
  });

  // Move spotlight
  document.getElementById('beam1').style.left = SPOTPOS[c];

  // Update stage
  setBackground(c, '');
  document.getElementById('stage-label').textContent = STAGES[c].label;
  document.getElementById('live-status').textContent = 'STANDBY';

  showBubble(c, ['Ready! Give me a script!', 'Let\'s create content!', 'I\'m on standby — go!'][Math.floor(Math.random()*3)]);
}

// ─────────────────────────────────────────────
// SWITCH CONTENT TYPE
// ─────────────────────────────────────────────
function swType(t) {
  activeCtype = t;
  ['ad','tutorial','reaction','announcement','story'].forEach(k => {
    document.getElementById('ct-'+k).classList.toggle('on', k === t);
  });
}

// ─────────────────────────────────────────────
// SET BACKGROUND
// ─────────────────────────────────────────────
function setBackground(plat, brief) {
  let url = STAGES[plat].bg;
  const topic = brief.toLowerCase();
  for (const [kw, u] of Object.entries(BROLL)) {
    if (topic.includes(kw)) { url = u; break; }
  }
  const el = document.getElementById('stage-bg');
  el.style.backgroundImage = `url(${url})`;
  el.classList.add('show');
}

// ─────────────────────────────────────────────
// SPEECH BUBBLE
// ─────────────────────────────────────────────
function showBubble(c, msg) {
  const el = document.getElementById('bub-' + c);
  el.textContent = msg.length > 55 ? msg.slice(0, 55) + '...' : msg;
  el.classList.add('show');
  clearTimeout(window['bt_' + c]);
  window['bt_' + c] = setTimeout(() => el.classList.remove('show'), 4000);
}

// ─────────────────────────────────────────────
// CAPTION BAR
// ─────────────────────────────────────────────
function showCaption(text) {
  const el = document.getElementById('cap-bar');
  el.textContent = text.slice(0, 130) + (text.length > 130 ? '...' : '');
  el.classList.add('show');
}

function hideCaption() {
  document.getElementById('cap-bar').classList.remove('show');
}

// ─────────────────────────────────────────────
// MOVE CHARACTER
// ─────────────────────────────────────────────
function moveChar(c, leftPx, bottomPx) {
  const el = document.getElementById('char-' + c);
  el.style.left   = leftPx;
  el.style.bottom = (bottomPx || 105) + 'px';
}

function moveHome(c) {
  moveChar(c, HOME[c], 105);
}

// ─────────────────────────────────────────────
// VOICE ENGINE
// ─────────────────────────────────────────────
function speakText(text, charKey) {
  if (!text) return;
  window.speechSynthesis.cancel();

  const utt    = new SpeechSynthesisUtterance(text);
  const v      = CHARS[charKey].voice;
  utt.pitch    = v.pitch;
  utt.rate     = v.rate;
  utt.volume   = 1;
  isSpeaking   = true;
  lastSpeech   = { text, charKey };

  document.getElementById('voice-ind').classList.add('show');
  document.getElementById('voice-btn').classList.add('on');
  document.getElementById('live-status').textContent = 'ON AIR';
  document.getElementById('char-' + charKey).classList.add('performing');

  utt.onend = () => {
    isSpeaking = false;
    document.getElementById('voice-ind').classList.remove('show');
    document.getElementById('voice-btn').classList.remove('on');
    document.getElementById('live-status').textContent = 'STANDBY';
    document.getElementById('char-' + charKey).classList.remove('performing');
    setTimeout(() => moveHome(charKey), 600);
  };

  window.speechSynthesis.speak(utt);
}

function toggleVoice() {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.getElementById('voice-ind').classList.remove('show');
    document.getElementById('voice-btn').classList.remove('on');
    document.getElementById('live-status').textContent = 'STANDBY';
    if (lastSpeech) document.getElementById('char-' + lastSpeech.charKey).classList.remove('performing');
  } else if (lastSpeech) {
    speakText(lastSpeech.text, lastSpeech.charKey);
  }
}

// ─────────────────────────────────────────────
// BUILD SYSTEM PROMPT
// ─────────────────────────────────────────────
function buildPrompt(charKey, ctype, script) {
  const c = CHARS[charKey];
  const personalities = {
    ig: 'warm, aesthetic, aspirational — you speak in a visual storytelling style',
    tt: 'fast, energetic, Gen-Z — you hook in the first 2 seconds, always punchy',
    yt: 'engaging, value-driven, clear — you structure content with strong intros and payoffs',
    li: 'professional, insightful, authoritative — you balance credibility with personality',
  };

  return `You are ${c.name}, an animated ${c.platform} content creator performing LIVE in a professional studio.
Your personality: ${personalities[charKey]}.
Content type: ${CTYPE_LABELS[ctype]}.

The user has given you a script or idea. Your job:
1. Improve and rewrite it perfectly for ${c.platform} as a ${CTYPE_LABELS[ctype]}
2. Make it punchy, natural, and platform-perfect — under 100 words
3. Return EXACTLY in this format, nothing else:

[SCENE] One physical action you do in the studio (walk to camera, pick up mic, point at green screen, open laptop, hold phone up, etc.)
[SCRIPT] The improved spoken script — natural, ready to perform out loud
[ACTION] One closing move or gesture to end the performance`;
}

// ─────────────────────────────────────────────
// MAIN PERFORM FUNCTION
// ─────────────────────────────────────────────
async function perform() {
  const script = document.getElementById('script-inp').value.trim();
  if (!script) {
    document.getElementById('script-inp').focus();
    return;
  }

  const btn = document.getElementById('perform-btn');
  const out = document.getElementById('out-area');

  btn.disabled = true;
  hideCaption();
  out.innerHTML = '<div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>';

  // Move char to camera position
  moveChar(activePlat, '155px', 110);
  setBackground(activePlat, script);
  showBubble(activePlat, 'AI is improving your script...');
  document.getElementById('live-status').textContent = 'GENERATING';

  try {
    const res = await fetch(SERVER + '/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brief:       script,
        agent:       CHARS[activePlat].name,
        contentType: 'script',
        prompt:      buildPrompt(activePlat, activeCtype, script)
      })
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    const raw  = data.text || '';

    // Parse the 3 sections
    const sceneM  = raw.match(/\[SCENE\]([\s\S]*?)(?=\[SCRIPT\]|\[ACTION\]|$)/);
    const scriptM = raw.match(/\[SCRIPT\]([\s\S]*?)(?=\[SCENE\]|\[ACTION\]|$)/);
    const actionM = raw.match(/\[ACTION\]([\s\S]*?)(?=\[SCENE\]|\[SCRIPT\]|$)/);

    const scene  = sceneM  ? sceneM[1].trim()  : 'Walks to centre stage';
    const spoken = scriptM ? scriptM[1].trim()  : raw.trim();
    const action = actionM ? actionM[1].trim()  : 'Takes a bow';

    const c = CHARS[activePlat];
    const emoji = activePlat==='ig'?'📸':activePlat==='tt'?'🎵':activePlat==='yt'?'🎥':'💼';

    out.innerHTML = `
      <div class="out-hdr">
        <div class="out-chip chip-agent">${emoji} ${c.name}</div>
        <div class="out-chip chip-type">${CTYPE_LABELS[activeCtype].toUpperCase()}</div>
        <div class="out-chip chip-stage">${STAGES[activePlat].label}</div>
      </div>
      <div class="out-section-title">🎬 SCENE</div>
      <div class="out-italic">${scene}</div>
      <div class="out-section-title cyan">SCRIPT</div>
      <div class="out-script">${spoken}</div>
      <div class="out-section-title">✨ CLOSING ACTION</div>
      <div class="out-italic">${action}</div>
    `;

    // Show caption + speak in character voice
    showCaption(spoken);
    showBubble(activePlat, 'Lights! Camera! Action! 🎬');
    setTimeout(() => speakText(spoken, activePlat), 500);

  } catch (err) {
    console.error('DIJO error:', err);
    out.innerHTML = `<div class="err">
      ⚠ Server is sleeping (Render free tier).<br/>
      Open <strong>dijo-ai.onrender.com</strong> in a new tab, wait 30 seconds for it to wake up, then try again.<br/>
      <small style="color:#444">${err.message}</small>
    </div>`;
    moveHome(activePlat);
    document.getElementById('live-status').textContent = 'STANDBY';
  }

  btn.disabled = false;
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
selectChar('ig');
