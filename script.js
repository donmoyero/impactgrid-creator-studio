async function generate(){

let topic = document.getElementById("topic").value.toLowerCase();

let agent = chooseAgent(topic);

let room = chooseRoom(agent);


// CALL AI SERVER
let response = await fetch("https://dijo-ai.onrender.com/generate",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
topic: topic,
agent: agent
})

})

let data = await response.json()

let speech = data.text



// SCENE TIMELINE
let timeline = [
"Intro",
"B-Roll",
"Explanation"
];


// OUTPUT PANEL
let output = document.getElementById("output");

output.innerHTML =
"<h2>" + agent + "</h2>" +
"<p><b>Location:</b> " + room + "</p>" +
"<p><b>Topic:</b> " + topic + "</p>" +
"<p><b>Scene Timeline:</b> " + timeline.join(" → ") + "</p>" +
"<p><b>DIJO says:</b></p>" +
"<p class='caption'>" + speech + "</p>" +
"<br><button onclick='exportVideo()'>Export Video</button>";


// ROOM BACKGROUND
let roomBox = document.getElementById("room");

if(room === "Fitness Studio"){
roomBox.style.backgroundImage = "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438)";
}
else if(room === "Data Lab"){
roomBox.style.backgroundImage = "url(https://images.unsplash.com/photo-1551288049-bebda4e38f71)";
}
else{
roomBox.style.backgroundImage = "url(https://images.unsplash.com/photo-1492724441997-5dc865305da7)";
}


// AVATAR
let avatar = document.getElementById("agentAvatar");

if(agent === "DIJO Coach"){
avatar.src = "https://cdn-icons-png.flaticon.com/512/1995/1995574.png";
}
else if(agent === "DIJO Analyst"){
avatar.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
}
else{
avatar.src = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
}


// BROLL TRIGGER
showBroll(topic);


// CAPTIONS
generateCaptions();


// VOICE
speakText(speech);

}



// AGENT LOGIC
function chooseAgent(topic){

if(topic.includes("gym") || topic.includes("fitness")){
return "DIJO Coach";
}

if(topic.includes("business") || topic.includes("money")){
return "DIJO Analyst";
}

return "DIJO Creator";

}



// ROOM LOGIC
function chooseRoom(agent){

if(agent === "DIJO Coach"){
return "Fitness Studio";
}

if(agent === "DIJO Analyst"){
return "Data Lab";
}

return "Content Studio";

}



// VOICE ENGINE
function speakText(text){

let speech = new SpeechSynthesisUtterance();

speech.text = text;

speech.rate = 1;

speech.pitch = 1;

speech.volume = 1;

window.speechSynthesis.speak(speech);

}



// BROLL SYSTEM
function showBroll(topic){

let roomBox = document.getElementById("room");

if(topic.includes("gym")){
roomBox.style.backgroundImage = "url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b)";
}

if(topic.includes("business")){
roomBox.style.backgroundImage = "url(https://images.unsplash.com/photo-1460925895917-afdab827c52f)";
}

if(topic.includes("content")){
roomBox.style.backgroundImage = "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f)";
}

}



// CAPTION GENERATOR
function generateCaptions(){

let caption = document.querySelector(".caption");

if(!caption) return;

caption.style.fontSize = "18px";
caption.style.background = "rgba(0,0,0,0.6)";
caption.style.padding = "10px";
caption.style.borderRadius = "6px";

}



// EXPORT VIDEO (placeholder)
function exportVideo(){

alert("Video export feature coming next. This will render the DIJO scene as a downloadable video.");

}
