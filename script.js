// ─────────────────────────────────────────────
// DIJO CREW — script.js (LOCAL AI VERSION)
// Works with Node server + Ollama
// ─────────────────────────────────────────────

const SERVER = "https://dijo-ai-server.vercel.app/api";

let activePlat  = "ig";
let activeCtype = "ad";
let isSpeaking  = false;
let lastSpeech  = null;

const CHARS = {
  ig:{name:"DIJO-IG",platform:"Instagram",color:"#E1306C",voice:{pitch:1.2,rate:.95}},
  tt:{name:"DIJO-TT",platform:"TikTok",color:"#69C9D0",voice:{pitch:1.4,rate:1.1}},
  yt:{name:"DIJO-YT",platform:"YouTube",color:"#FF4444",voice:{pitch:.9,rate:1}},
  li:{name:"DIJO-LI",platform:"LinkedIn",color:"#00A0DC",voice:{pitch:.8,rate:.88}}
};

const HOME={ig:"120px",tt:"215px",yt:"310px",li:"405px"};
const SPOTPOS={ig:"18%",tt:"32%",yt:"46%",li:"60%"};

const CTYPE_LABELS={
 ad:"Ad / Promo",
 tutorial:"Tutorial",
 reaction:"Reaction",
 announcement:"Announcement",
 story:"Storytelling"
};

// ─────────────────────────────────────────────
// SERVER CALL
// ─────────────────────────────────────────────

async function callServer(brief){

 for(let i=0;i<3;i++){

  try{

   const res=await fetch(SERVER+"/generate",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({brief})
   });

   if(!res.ok) throw new Error("Server error "+res.status);

   const data=await res.json();

   return data.text;

  }catch(err){

   console.log("Server retry",i+1);

   if(i===2) throw err;

   await new Promise(r=>setTimeout(r,2000));

  }

 }

}

// ─────────────────────────────────────────────
// PROMPT BUILDER
// ─────────────────────────────────────────────

function buildBrief(charKey,ctype,script){

 const c=CHARS[charKey];

 return `
You are ${c.name}, an animated ${c.platform} content creator performing on stage.

Rewrite the user's idea into a short engaging ${CTYPE_LABELS[ctype]}.

Return format exactly like this:

[SCENE]
Describe what you do on stage.

[SCRIPT]
The spoken script.

[ACTION]
Closing gesture.

User idea:
${script}
`;

}

// ─────────────────────────────────────────────
// CHARACTER SELECT
// ─────────────────────────────────────────────

function selectChar(c){

 activePlat=c;

 ["ig","tt","yt","li"].forEach(k=>{
  document.getElementById("tab-"+k).className="ptab"+(k===c?" on-"+k:"");
  document.getElementById("char-"+k).classList.toggle("active",k===c);
 });

 document.getElementById("beam1").style.left=SPOTPOS[c];

 document.getElementById("stage-label").textContent=CHARS[c].platform+" STUDIO";

}

// ─────────────────────────────────────────────
// CONTENT TYPE
// ─────────────────────────────────────────────

function swType(t){

 activeCtype=t;

 ["ad","tutorial","reaction","announcement","story"].forEach(k=>{
  document.getElementById("ct-"+k).classList.toggle("on",k===t);
 });

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

 document.getElementById("live-status").textContent="ON AIR";

 utt.onend=()=>{

  isSpeaking=false;

  document.getElementById("live-status").textContent="STANDBY";

  moveHome(charKey);

 };

 window.speechSynthesis.speak(utt);

}

function toggleVoice(){

 if(isSpeaking){

  window.speechSynthesis.cancel();
  isSpeaking=false;

 }else if(lastSpeech){

  speakText(lastSpeech.text,lastSpeech.charKey);

 }

}

// ─────────────────────────────────────────────
// MOVE CHARACTER
// ─────────────────────────────────────────────

function moveChar(c,leftPx,bottomPx){

 const el=document.getElementById("char-"+c);

 el.style.left=leftPx;
 el.style.bottom=(bottomPx||105)+"px";

}

function moveHome(c){

 moveChar(c,HOME[c],105);

}

// ─────────────────────────────────────────────
// MAIN PERFORM FUNCTION
// ─────────────────────────────────────────────

async function perform(){

 const script=document.getElementById("script-inp").value.trim();

 if(!script){
  document.getElementById("script-inp").focus();
  return;
 }

 const btn=document.getElementById("perform-btn");
 const out=document.getElementById("out-area");

 btn.disabled=true;

 out.innerHTML='<div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>';

 moveChar(activePlat,"155px",110);

 try{

  const brief=buildBrief(activePlat,activeCtype,script);

  const raw=await callServer(brief);

  const sceneM=raw.match(/\[SCENE\]([\s\S]*?)(?=\[SCRIPT\]|\[ACTION\]|$)/);
  const scriptM=raw.match(/\[SCRIPT\]([\s\S]*?)(?=\[ACTION\]|$)/);
  const actionM=raw.match(/\[ACTION\]([\s\S]*)/);

  const scene=sceneM?sceneM[1].trim():"Walks to the camera";
  const spoken=scriptM?scriptM[1].trim():raw.trim();
  const action=actionM?actionM[1].trim():"Waves goodbye";

  out.innerHTML=`
  <div class="out-section-title">SCENE</div>
  <div class="out-italic">${scene}</div>

  <div class="out-section-title cyan">SCRIPT</div>
  <div class="out-script">${spoken}</div>

  <div class="out-section-title">ACTION</div>
  <div class="out-italic">${action}</div>
  `;

  setTimeout(()=>speakText(spoken,activePlat),500);

 }catch(err){

  console.error(err);

  out.innerHTML=`
  <div class="err">
  ⚠ AI server not reachable.<br>
  Make sure Node server is running on port 3000.
  </div>
  `;

 }

 btn.disabled=false;

}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

selectChar("ig");
