import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Avatar, 
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ChatPreview = ({ chat }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2, 
        '&:hover': { 
          bgcolor: 'action.hover',
          cursor: 'pointer'
        }
      }}
      onClick={() => navigate(`/chat/${chat.userId}`)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={chat.imageUrl || '/images/default-avatar.png'}
          alt={chat.username}
          sx={{ width: 50, height: 50 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {chat.username}
            </Typography>
            {chat.lastMessageTime && (
              <Typography variant="caption" color="text.secondary">
                {formatDate(chat.lastMessageTime)}
              </Typography>
            )}
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {chat.lastMessage || 'No messages yet'}
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/chat/${chat.userId}`);
          }}
        >
          Open Chat
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatPreview; 