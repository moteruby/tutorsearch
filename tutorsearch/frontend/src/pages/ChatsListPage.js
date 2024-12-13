import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Avatar,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { 
  Chat as ChatIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import Navbar from '../components/Layout/Navbar';
import api from '../services/api';

const ChatsListPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/auth/current-user');
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadChats = async (userId) => {
    try {
      const response = await api.get(`/chat/list/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  useEffect(() => {
    const initializeChats = async () => {
      const userData = await loadCurrentUser();
      if (userData) {
        loadChats(userData.id);
      }
    };

    initializeChats();
  }, []);

  const ChatPreview = ({ chat }) => {
    const time = chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleString() : '';
    
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${theme.palette.background.paper}`,
          '&:hover': {
            transform: 'translateX(8px)',
            boxShadow: `0 4px 20px 0 ${theme.palette.primary.dark}30`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={chat.imageUrl || '/images/default-avatar.png'}
            sx={{
              width: 56,
              height: 56,
              border: `2px solid ${theme.palette.secondary.main}`,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {chat.username}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '300px',
              }}
            >
              {chat.lastMessage || 'No messages yet'}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {time}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={() => navigate(`/chat/${chat.userId}`)}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
              boxShadow: `0 3px 5px 2px ${theme.palette.secondary.main}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 12px 4px ${theme.palette.secondary.main}20`,
              },
            }}
          >
            Open Chat
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
                My Chats
              </Typography>
                {chats.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {chats.map((chat) => (
                            <ChatPreview key={chat.id} chat={chat} />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No chats available.
                    </Typography>
                )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatsListPage; 