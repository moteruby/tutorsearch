let stompClient = null;
let currentSubscription = null;
let currentUser = null;

function connect(userId) {
    console.log('Attempting to connect with userId:', userId);
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.debug = function(str) {
        console.log('STOMP: ', str);
    };

    stompClient.connect({}, 
        function(frame) {
            console.log('Connected to WebSocket:', frame);
            const subscriptionUrl = '/user/' + userId + '/queue/messages';
            console.log('Subscribing to:', subscriptionUrl);

            currentSubscription = stompClient.subscribe(subscriptionUrl, function(message) {
                console.log('Raw message received:', message);
                try {
                    const receivedMessage = JSON.parse(message.body);
                    console.log('Parsed message:', receivedMessage);
                    addMessageToChat(receivedMessage.content, false);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            });

            console.log('Subscription created:', currentSubscription);
            
            // Отправляем тестовое сообщение для проверки соединения
            stompClient.send("/app/chat.test", {}, JSON.stringify({
                userId: userId,
                content: "Test connection"
            }));
        }, 
        function(error) {
            console.error('STOMP Connection error:', error);
            console.error('Error details:', {
                message: error.message,
                type: error.type,
                stack: error.stack
            });
            setTimeout(() => connect(userId), 5000);
        }
    );
}

function login() {
    const userId = document.getElementById('userId').value;
    if (!userId) {
        console.error('No user ID provided');
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

function disconnect() {
    if (currentSubscription) {
        console.log('Unsubscribing...');
        currentSubscription.unsubscribe();
    }
    if (stompClient !== null) {
        console.log('Disconnecting...');
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

function sendMessage(senderId, receiverId, content) {
    if (stompClient && stompClient.connected) {
        const chatMessage = {
            senderId: senderId,
            receiverId: receiverId,
            content: content,
            type: 'CHAT'
        };

        console.log('Sending message:', chatMessage);
        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        console.log('Message sent to server');
        addMessageToChat(content, true);
    } else {
        console.error('Not connected to WebSocket');
        alert('Connection lost. Please refresh the page.');
    }
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

function loadChatHistory(receiverId) {
    console.log('Loading chat history with user:', receiverId);
    fetch(`/api/chat/history/${currentUser}/${receiverId}`)
        .then(response => response.json())
        .then(messages => {
            console.log('Received chat history:', messages);
            const messageArea = document.getElementById('message-area');
            messageArea.innerHTML = '';

            messages.forEach(message => {
                const isSent = message.sender.id.toString() === currentUser;
                addMessageToChat(message.content, isSent);
            });
        })
        .catch(error => console.error('Error loading chat history:', error));
} 