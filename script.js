// ─────────────────────────────────────────────
// DIJO CREW — script.js
// ─────────────────────────────────────────────

const SERVER = 'https://dijo-ai.onrender.com';

let plat        = 'ig';
let type        = 'caption';
let isSpeaking  = false;
let lastSpeech  = '';

// ── B-ROLL BACKGROUNDS (keyword → image) ──
const BROLL = {
  gym:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  fitness:  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  business: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  money:    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  content:  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  food:     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  travel:   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  fashion:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  tech:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  music:    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
  beauty:   'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  sport:    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  health:   'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  finance:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
};

// ── DEFAULT ROOMS PER PLATFORM ──
const PLATFORM_ROOMS = {
  ig: { label: 'INSTAGRAM STUDIO', bg: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=80' },
  tt: { label: 'TIKTOK STAGE',     bg: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80' },
  yt: { label: 'YOUTUBE STUDIO',   bg: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80' },
  li: { label: 'DATA LAB',         bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80' },
};

// ── AVATARS ──
const AVATARS = {
  'DIJO-IG': { src: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', role: 'Instagram Creator'    },
  'DIJO-TT': { src: 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png', role: 'TikTok Performer'     },
  'DIJO-YT': { src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', role: 'YouTube Host'         },
  'DIJO-LI': { src: 'https://cdn-icons-png.flaticon.com/512/4140/4140061.png', role: 'LinkedIn Strategist'  },
};

// ── PLATFORM MAP ──
const platMap = {
  ig: { agent: 'DIJO-IG', emoji: '📸', cls: 'pt-ig' },
  tt: { agent: 'DIJO-TT', emoji: '🎵', cls: 'pt-tt' },
  yt: { agent: 'DIJO-YT', emoji: '🎥', cls: 'pt-yt' },
  li: { agent: 'DIJO-LI', emoji: '💼', cls: 'pt-li' },
};

const typeMap = {
  caption:  'Caption & Hook',
  script:   'Act It Out',
  hashtags: 'Hashtags',
  schedule: 'Schedule',
  ideas:    'Ideas',
};

const spotPos = { ig: '25%', tt: '38%', yt: '50%', li: '62%' };
const timeline = ['Intro', 'B-Roll', 'Explanation'];

// ─────────────────────────────────────────────
// VOICE ENGINE (from your original script.js)
// ─────────────────────────────────────────────
function speakText(text) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate   = 1;
  utt.pitch  = 1;
  utt.volume = 1;
  isSpeaking = true;
  document.getElementById('voice-ind').classList.add('show');
  document.getElementById('vbtn').classList.add('speaking');
  utt.onend = () => {
    isSpeaking = false;
    document.getElementById('voice-ind').classList.remove('show');
    document.getElementById('vbtn').classList.remove('speaking');
  };
  window.speechSynthesis.speak(utt);
  lastSpeech = text;
}

function toggleVoice() {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.getElementById('voice-ind').classList.remove('show');
    document.getElementById('vbtn').classList.remove('speaking');
  } else if (lastSpeech) {
    speakText(lastSpeech);
  }
}

// ─────────────────────────────────────────────
// B-ROLL SYSTEM (from your original script.js)
// ─────────────────────────────────────────────
function setBroll(brief) {
  const topic  = brief.toLowerCase();
  let   bgUrl  = PLATFORM_ROOMS[plat].bg;

  for (const [kw, url] of Object.entries(BROLL)) {
    if (topic.includes(kw)) { bgUrl = url; break; }
  }

  const bg = document.getElementById('stage-bg');
  bg.style.backgroundImage = `url(${bgUrl})`;
  bg.classList.add('show');
}

// ─────────────────────────────────────────────
// ROOM LABEL
// ─────────────────────────────────────────────
function setRoom(brief) {
  const topic = brief.toLowerCase();
  let   label = PLATFORM_ROOMS[plat].label;

  if (topic.includes('gym')     || topic.includes('fitness'))  label = 'FITNESS STUDIO';
  else if (topic.includes('business') || topic.includes('data'))    label = 'DATA LAB';
  else if (topic.includes('music'))                                  label = 'MUSIC STUDIO';
  else if (topic.includes('food'))                                   label = 'KITCHEN STUDIO';
  else if (topic.includes('fashion') || topic.includes('beauty'))   label = 'FASHION STUDIO';
  else if (topic.includes('tech'))                                   label = 'TECH STUDIO';

  document.getElementById('room-label').textContent = label;
}

// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────
function setAvatar(agentKey) {
  const av = AVATARS[agentKey] || AVATARS['DIJO-IG'];
  document.getElementById('avatar-img').src          = av.src;
  document.getElementById('avatar-name').textContent = agentKey;
  document.getElementById('avatar-role').textContent = av.role;
}

// ─────────────────────────────────────────────
// CAPTION BAR (your original generateCaptions)
// ─────────────────────────────────────────────
function showCaption(text) {
  const bar = document.getElementById('caption-bar');
  bar.textContent = text.slice(0, 130) + (text.length > 130 ? '...' : '');
  bar.classList.add('show');
}

function hideCaption() {
  document.getElementById('caption-bar').classList.remove('show');
}

// ─────────────────────────────────────────────
// SPEECH BUBBLE
// ─────────────────────────────────────────────
function showBubble(msg) {
  const el = document.getElementById('speech-bub');
  el.textContent = msg.length > 60 ? msg.slice(0, 60) + '...' : msg;
  el.classList.add('show');
  clearTimeout(window.bubTimer);
  window.bubTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ─────────────────────────────────────────────
// SWITCH PLATFORM
// ─────────────────────────────────────────────
function swPlat(p) {
  plat = p;
  Object.keys(platMap).forEach(k => {
    document.getElementById('tab-' + k).className =
      'ptab ' + platMap[k].cls + (k === p ? ' on' : '');
  });
  document.getElementById('spot').style.left = spotPos[p];
  setAvatar(platMap[p].agent);
  setBroll('');
  setRoom('');
  showBubble('Ready for ' + platMap[p].agent + '!');
}

// ─────────────────────────────────────────────
// SWITCH CONTENT TYPE
// ─────────────────────────────────────────────
function swType(t) {
  type = t;
  Object.keys(typeMap).forEach(k => {
    document.getElementById('tp-' + k).classList.toggle('on', k === t);
  });
}

// ─────────────────────────────────────────────
// PERFORMANCE OVERLAY
// ─────────────────────────────────────────────
function closePerf() {
  document.getElementById('perf').classList.remove('show');
}

// ─────────────────────────────────────────────
// MAIN ACTION — merges your generate() + new content types
// ─────────────────────────────────────────────
async function go() {
  const brief = document.getElementById('binp').value.trim();
  if (!brief) { document.getElementById('binp').focus(); return; }

  const btn = document.getElementById('abtn');
  const out = document.getElementById('out');
  btn.disabled = true;
  hideCaption();
  out.innerHTML = '<div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>';

  // Your original: set room, broll, avatar
  setBroll(brief);
  setRoom(brief);
  setAvatar(platMap[plat].agent);
  showBubble('Creating your ' + typeMap[type] + '...');

  try {
    const res = await fetch(SERVER + '/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        brief,
        agent:       platMap[plat].agent,
        contentType: type
      })
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    const raw  = data.text || '';
    const pc   = platMap[plat];

    // Scene timeline (from your original script)
    let html = `
      <div class="ohdr">
        <div class="ochip">${pc.emoji} ${pc.agent}</div>
        <div class="otype">${typeMap[type].toUpperCase()}</div>
        <div class="oroom">${document.getElementById('room-label').textContent}</div>
      </div>
      <div class="timeline">
        ${timeline.map((s, i) =>
          `<span class="tl-step">${s}</span>${i < timeline.length - 1 ? '<span class="tl-arr">→</span>' : ''}`
        ).join('')}
      </div>
    `;

    // ── CAPTION / SCRIPT ──
    if (type === 'caption' || type === 'script') {
      html += `<div class="ocontent">${raw}</div>`;
      showCaption(raw);
      speakText(raw);
      showBubble('Action! 🎬');

      if (type === 'script') {
        const dm      = raw.match(/\[DELIVER\]([\s\S]*?)(?=\[|$)/);
        const am      = raw.match(/\[ACTION\]([\s\S]*?)(?=\[|$)/);
        const deliver = (dm ? dm[1].trim() : raw).slice(0, 220);
        const action  = am ? am[1].trim() : 'Takes a bow';
        document.getElementById('perf-lbl').textContent = pc.agent + ' · ON STAGE';
        document.getElementById('perf-txt').textContent = deliver;
        document.getElementById('perf-act').textContent = '🎬 ' + action;
        setTimeout(() => document.getElementById('perf').classList.add('show'), 600);
      }
    }

    // ── HASHTAGS ──
    else if (type === 'hashtags') {
      const lines = raw.split('\n').filter(l => l.trim());
      let g = '', gh = '';
      lines.forEach(l => {
        if (/TRENDING|NICHE|BRANDED/i.test(l)) {
          if (g) gh += '</div>';
          gh += `<div class="ostitle">${l.trim()}</div><div class="hcloud">`;
          g = l;
        } else {
          (l.match(/#\w+/g) || []).forEach(t => {
            gh += `<span class="htag h-${plat}">${t}</span>`;
          });
        }
      });
      if (g) gh += '</div>';
      html += gh || `<div class="ocontent">${raw}</div>`;
      speakText('Here are your hashtags for ' + brief);
      showBubble('Hashtags ready!');
    }

    // ── SCHEDULE ──
    else if (type === 'schedule') {
      let items;
      try { items = JSON.parse(raw.replace(/```json|```/g, '').trim()); }
      catch (e) { items = []; }

      if (items.length) {
        html += '<div class="sgrid">';
        items.forEach(d => {
          html += `<div class="sday">
            <div class="sdn">${d.day}</div>
            <div class="sdt">${d.time}</div>
            <div class="sdp">${d.type}</div>
          </div>`;
        });
        html += '</div><div style="margin-top:10px">';
        items.forEach(d => {
          html += `<div class="sdtip"><strong>${d.day}:</strong> ${d.tip}</div>`;
        });
        html += '</div>';
      } else {
        html += `<div class="ocontent">${raw}</div>`;
      }
      speakText('Your 7 day posting schedule is ready');
      showBubble('Schedule locked!');
    }

    // ── IDEAS ──
    else if (type === 'ideas') {
      let items;
      try { items = JSON.parse(raw.replace(/```json|```/g, '').trim()); }
      catch (e) { items = []; }

      if (items.length) {
        html += '<div class="igrid">';
        items.forEach((it, i) => {
          html += `<div class="icard">
            <div class="inum">IDEA ${i + 1}</div>
            <div class="itxt"><strong>${it.title}</strong><br/>${it.hook}</div>
            <div class="ifmt">${it.format || ''}</div>
          </div>`;
        });
        html += '</div>';
      } else {
        html += `<div class="ocontent">${raw}</div>`;
      }
      speakText('Here are 6 content ideas for ' + brief);
      showBubble('Ideas incoming!');
    }

    out.innerHTML = html;

  } catch (err) {
    console.error('DIJO error:', err);
    out.innerHTML = `<div class="err">
      ⚠ Could not reach server.<br/>
      Open <strong>dijo-ai.onrender.com</strong> in a new tab, wait 30 seconds for it to wake up, then try again.<br/>
      <small style="color:#aaa">${err.message}</small>
    </div>`;
  }

  btn.disabled = false;
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
swPlat('ig');
