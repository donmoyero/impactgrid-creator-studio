function generate(){

let topic = document.getElementById("topic").value;

// choose DIJO agent
let agent = chooseAgent(topic);

// generate script
let script = agent + " is explaining " + topic + ".";

// show result
document.getElementById("output").innerHTML = script;

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
