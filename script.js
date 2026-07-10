const chatHistory = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const modelInput = document.getElementById('model-name');
const clearBtn = document.getElementById('clear-btn');
const loadingIndicator = document.getElementById('loading-indicator');

let messages = [];

// Helper to render message bubbles
function appendMessage(role, content, isError = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    if (isError) msgDiv.classList.add('error');
    msgDiv.innerText = content;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return msgDiv;
}

// Handle Form Submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add user message to UI and local state
    appendMessage('user', text);
    messages.push({ role: 'user', content: text });
    userInput.value = '';

    // 2. Show loading status
    loadingIndicator.classList.remove('hidden');

    // Create an empty placeholder bubble for streaming response
    const responseBubble = appendMessage('assistant', '');

    try {
        // Fetch stream from local Ollama API
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelInput.value,
                messages: messages,
                stream: true
            })
        });

        if (!response.ok) throw new Error('Failed to connect to local server.');

        loadingIndicator.classList.add('hidden');
        
        // Read stream chunks
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Lines are split by newline delimiter in NDJSON
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.trim() !== '') {
                    const parsed = JSON.parse(line);
                    const token = parsed.message?.content || '';
                    aiResponse += token;
                    responseBubble.innerText = aiResponse + '▌'; // Cursor effect
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                }
            }
        }

        // Finalize token stream
        responseBubble.innerText = aiResponse;
        messages.push({ role: 'assistant', content: aiResponse });

    } catch (error) {
        loadingIndicator.classList.add('hidden');
        responseBubble.remove(); // Remove empty bubble
        appendMessage('assistant', '❌ Connection Error: Ensure Ollama is running (`ollama serve`).', true);
    }
});

// Clear Chat Action
clearBtn.addEventListener('click', () => {
    messages = [];
    chatHistory.innerHTML = '';
});