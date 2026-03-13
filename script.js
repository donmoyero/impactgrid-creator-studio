function generate(){

let topic = document.getElementById("topic").value;

// choose DIJO agent
let agent = chooseAgent(topic);

// choose room
let room = chooseRoom(agent);

// show result
document.getElementById("output").innerHTML = `
<h2>${agent}</h2>
<p><b>Location:</b> ${room}</p>
<p><b>Topic:</b> ${topic}</p>
<p>${agent} is now creating content about ${topic}.</p>
`;

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
