function generate(){

let topic = document.getElementById("topic").value.toLowerCase();

let agent = chooseAgent(topic);

let room = chooseRoom(agent);

// show text
document.getElementById("output").innerHTML = `
<h2>${agent}</h2>
<p><b>Location:</b> ${room}</p>
<p><b>Topic:</b> ${topic}</p>
<p>${agent} is now creating content about ${topic}.</p>
`;

// change visual room
let roomBox = document.getElementById("room");

if(room === "Fitness Studio"){
roomBox.style.backgroundImage = "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438')";
}
else if(room === "Data Lab"){
roomBox.style.backgroundImage = "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71')";
}
else{
roomBox.style.backgroundImage = "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7')";
}

// set avatar
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

function chooseAgent(topic){

if(topic.includes("gym") || topic.includes("fitness")){
return "DIJO Coach";
}

if(topic.includes("business") || topic.includes("money")){
return "DIJO Analyst";
}

return "DIJO Creator";

}

function chooseRoom(agent){

if(agent === "DIJO Coach"){
return "Fitness Studio";
}

if(agent === "DIJO Analyst"){
return "Data Lab";
}

return "Content Studio";

}
