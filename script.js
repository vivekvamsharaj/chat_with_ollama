const chatBox=document.getElementById("chatBox");
const loading=document.getElementById("loading");

async function sendMessage(){

const message=document.getElementById("message").value;

if(message==="") return;

chatBox.innerHTML+=`<div class="user"><b>You:</b> ${message}</div>`;

loading.innerHTML="Thinking...";

const response=await fetch("http://localhost:3001/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message
})

});

const data=await response.json();

loading.innerHTML="";

chatBox.innerHTML+=`<div class="bot"><b>Ollama:</b> ${data.reply}</div>`;

document.getElementById("message").value="";

chatBox.scrollTop=chatBox.scrollHeight;

}

function clearChat(){

chatBox.innerHTML="";

}