import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class ChatService {
  constructor() {
    this.stompClient = null;
    this.subscription = null;
    this.connected = false;
  }

  connect(userId, onMessageReceived) {
    if (this.connected) {
      console.log('Already connected');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(() => socket);

        // Отключаем логи
        this.stompClient.debug = () => {};

        this.stompClient.connect(
          {},
          () => {
            console.log('WebSocket Connected');
            this.connected = true;

            // Подписываемся на личные сообщения
            if (this.subscription) {
              this.subscription.unsubscribe();
            }

            this.subscription = this.stompClient.subscribe(
              `/user/${userId}/queue/messages`,
              (message) => {
                try {
                  const receivedMessage = JSON.parse(message.body);
                  onMessageReceived(receivedMessage);
                } catch (error) {
                  console.error('Error processing message:', error);
                }
              }
            );

            resolve();
          },
          (error) => {
            console.error('WebSocket Connection Error:', error);
            this.connected = false;
            reject(error);
          }
        );
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.connected = false;
        reject(error);
      }
    });
  }

  sendMessage(senderId, receiverId, content) {
    if (!this.connected || !this.stompClient) {
      console.error('Not connected to WebSocket');
      return;
    }

    const chatMessage = {
      senderId,
      receiverId,
      content,
      type: 'CHAT',
      timestamp: new Date().toISOString()
    };

    try {
      this.stompClient.send(
        '/app/chat.send',
        {
          'content-type': 'application/json'
        },
        JSON.stringify(chatMessage)
      );
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  disconnect() {
    try {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      if (this.stompClient) {
        this.stompClient.disconnect();
        this.stompClient = null;
      }

      this.connected = false;
      console.log('Disconnected from WebSocket');
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }
}

// Создаем единственный экземпляр сервиса
const chatService = new ChatService();
export default chatService; 