import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Avatar,
  Grid,
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Layout/Navbar';
import Message from '../components/Chat/Message';
import chatService from '../services/chat.service';
import api from '../services/api';

const ChatPage = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatInitializedRef = useRef(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id === Number(receiverId)) {
      alert('You cannot chat with yourself');
      navigate('/');
    }
  }, [receiverId, navigate]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  const handleMessageReceived = useCallback((message) => {
    if (!currentUser) return;
    
    const isSentByMe = message.sender?.id === currentUser.id;
    setMessages(prev => [...prev, { ...message, isSentByMe }]);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [currentUser]);

  const loadChatHistory = useCallback(async (userId, receiverId) => {
    try {
      const response = await api.get(`/chat/history/${userId}/${receiverId}`);
      const processedMessages = response.data.map(message => ({
        ...message,
        isSentByMe: message.sender.id === userId
      }));
      setMessages(processedMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeChat = async () => {
      if (!currentUser || !receiverId || chatInitializedRef.current) return;

      try {
        // Загружаем информацию о полчателе
        const receiverResponse = await api.get(`/users/${receiverId}`);
        if (!mounted) return;
        setReceiver(receiverResponse.data);

        // Инициализируем WebSocket подключение
        await chatService.connect(currentUser.id, handleMessageReceived);
        
        // Загружаем историю чата
        await loadChatHistory(currentUser.id, receiverId);
        
        chatInitializedRef.current = true;
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (mounted) setLoading(false);
      }
    };

    if (currentUser) {
      initializeChat();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser, receiverId, handleMessageReceived, loadChatHistory]);

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await api.get('/auth/current-user');
        if (mounted) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
        if (mounted) navigate('/');
      }
    };

    loadCurrentUser();

    return () => {
      mounted = false;
      if (chatInitializedRef.current) {
        chatService.disconnect();
        chatInitializedRef.current = false;
      }
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      const messageObject = {
        content: newMessage.trim(),
        sender: currentUser,
        receiver: receiver,
        timestamp: new Date(),
        isSentByMe: true
      };

      chatService.sendMessage(currentUser.id, receiverId, newMessage.trim());
      setMessages(prev => [...prev, messageObject]);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
      }}>
        <CircularProgress sx={{ color: theme.palette.background.paper }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Paper elevation={24} sx={{ 
              height: 'calc(100vh - 200px)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4 
            }}>
              {/* Заголовок чата */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <IconButton onClick={() => navigate(-1)}>
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Avatar src={receiver?.imageUrl} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">{receiver?.username}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Область сообщений */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                <Grid container direction="column" spacing={2}>
                  {messages.map((message, index) => (
                    <Grid item key={index}>
                      <Message message={message} isSent={message.isSentByMe} theme={theme} />
                    </Grid>
                  ))}
                  <div ref={messagesEndRef} />
                </Grid>
              </Box>

              {/* Форма отправки */}
              <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item>
                    <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
                      <SendIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatPage; 