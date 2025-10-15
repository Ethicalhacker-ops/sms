const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const chatbox = document.getElementById('chatbox');

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const msgElement = document.createElement('p');
        msgElement.textContent = "You: " + message;
        chatbox.appendChild(msgElement);
        messageInput.value = '';
        chatbox.scrollTop = chatbox.scrollHeight;

        // Simulate offline receiving
        setTimeout(() => {
            const receivedMsg = document.createElement('p');
            receivedMsg.textContent = "Friend: " + message.split('').reverse().join(''); // just dummy response
            chatbox.appendChild(receivedMsg);
            chatbox.scrollTop = chatbox.scrollHeight;
        }, 1500);
    }
});

// Dummy connection buttons
document.getElementById('wifiBtn').addEventListener('click', () => {
    alert("Wi-Fi connection simulated!");
});
document.getElementById('btBtn').addEventListener('click', () => {
    alert("Bluetooth connection simulated!");
});
