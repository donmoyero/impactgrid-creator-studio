async function generate(){

let topic = document.getElementById("topic").value.toLowerCase();

let agent = chooseAgent(topic);

let room = chooseRoom(agent);

let speech = "Generating AI script...";


// UI update while loading
document.getElementById("output").innerHTML =
"<p>DIJO is creating advertising content...</p>";

try{

let response = await fetch("https://dijo-ai.onrender.com/generate",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
topic: topic,
agent: agent
})

});

let data = await response.json();

speech = data.text;

}catch(error){

console.error(error);

speech = "DIJO could not generate advertising content right now.";

}


// OUTPUT PANEL
let output = document.getElementById("output");

output.innerHTML =
"<h2>" + agent + "</h2>" +
"<p><b>Location:</b> " + room + "</p>" +
"<p><b>Topic:</b> " + topic + "</p>" +
"<p class='caption'>" + speech + "</p>";


// SPEAK
speakText(speech);

}
