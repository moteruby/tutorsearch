let currentUser = null;

function login() {
    const userId = document.getElementById('userId').value;
    if (!userId) {
        alert('Please enter user ID');
        return;
    }

    console.log('Logging in with userId:', userId);
    currentUser = userId;
    connect(userId);

    document.getElementById('login-page').style.display = 'none';
    document.getElementById('chat-page').style.display = 'block';

    const receiverId = document.getElementById('receiverId').value;
    if (receiverId) {
        loadChatHistory(receiverId);
    }
}

function logout() {
    disconnect();
    currentUser = null;
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('chat-page').style.display = 'none';
    document.getElementById('message-area').innerHTML = '';
}

function sendNewMessage() {
    const receiverId = document.getElementById('receiverId').value;
    const messageContent = document.getElementById('message').value;

    if (!receiverId || !messageContent) {
        alert('Please fill in all fields');
        return;
    }

    console.log('Sending new message:', {
        senderId: currentUser,
        receiverId: receiverId,
        content: messageContent
    });

    sendMessage(currentUser, receiverId, messageContent);

    // Clear input field
    document.getElementById('message').value = '';
}

function addMessageToChat(content, isSent) {
    console.log(`Adding ${isSent ? 'sent' : 'received'} message to chat:`, content);
    const messageArea = document.getElementById('message-area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    messageDiv.textContent = content;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Переопределяем функции обработки сообщений из chat.js
window.onMessageReceived = function(payload) {
    const message = JSON.parse(payload.body);
    if (message.type === 'CHAT') {
        addMessageToChat(message.content, false);
    }
};

window.onPrivateMessage = function(payload) {
    const message = JSON.parse(payload.body);
    addMessageToChat(message.content, false);
};

// Добавим обработчик изменения получателя
document.getElementById('receiverId').addEventListener('change', function(e) {
    const receiverId = e.target.value;
    if (receiverId) {
        loadChatHistory(receiverId);
    }
});

function loadChatHistory(receiverId) {
    console.log('Loading chat history with user:', receiverId);
    fetch(`/api/chat/history/${currentUser}/${receiverId}`)
        .then(response => response.json())
        .then(messages => {
            console.log('Received chat history:', messages);
            // Очищаем текущую историю чата
            const messageArea = document.getElementById('message-area');
            messageArea.innerHTML = '';

            // Отображаем сообщения
            messages.forEach(message => {
                const isSent = message.sender.id.toString() === currentUser;
                addMessageToChat(message.content, isSent);
            });
        })
        .catch(error => console.error('Error loading chat history:', error));
}