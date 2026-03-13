function generate(){

// get topic
let topic = document.getElementById("topic").value.toLowerCase();

// pick agent
let agent = chooseAgent(topic);

// pick room
let room = chooseRoom(agent);

// generate talking script
let speech = generateSpeech(agent, topic);

// output text
let output = document.getElementById("output");

output.innerHTML =
"<h2>" + agent + "</h2>" +
"<p><b>Location:</b> " + room + "</p>" +
"<p><b>Topic:</b> " + topic + "</p>" +
"<p><b>DIJO says:</b></p>" +
"<p>" + speech + "</p>";


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



// SPEECH GENERATOR
function generateSpeech(agent, topic){

if(agent === "DIJO Coach"){
return "Today we are talking about " + topic + ". If you want results, you need discipline, consistency, and the right mindset. Start small, stay focused, and keep pushing.";
}

if(agent === "DIJO Analyst"){
return "Let's analyze " + topic + ". Understanding the numbers, trends, and strategy behind this topic can help you make smarter decisions and grow faster.";
}

return "Today we’re exploring " + topic + ". Creating great content starts with understanding your audience and delivering value consistently.";
}
