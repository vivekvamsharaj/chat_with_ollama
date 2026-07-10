const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const clearBtn = document.getElementById("clear-btn");

// Add message to chat
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Simulate Ollama response
function ollamaReply(userText) {
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message bot loading";
  loadingMsg.textContent = "Ollama is thinking...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    loadingMsg.remove();
    // Simple simulated response (replace with real Ollama API if available)
    const reply = `Echo from Ollama: "${userText}"`;
    addMessage(reply, "bot");
  }, 1500);
}

// Handle form submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";
  ollamaReply(text);
});

// Clear chat
clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
});
