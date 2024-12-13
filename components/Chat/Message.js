import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Message = ({ message, isSent, theme }) => {
  if (!message || !message.content) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 3,
          position: 'relative',
          ...(isSent ? {
            bgcolor: theme.palette.secondary.main,
            color: 'white',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -10,
              top: '50%',
              transform: 'translateY(-50%)',
              border: '10px solid transparent',
              borderLeft: `10px solid ${theme.palette.secondary.main}`,
            }
          } : {
            bgcolor: 'white',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -10,
              top: '50%',
              transform: 'translateY(-50%)',
              border: '10px solid transparent',
              borderRight: '10px solid white',
            }
          }),
        }}
      >
        <Typography variant="body1">
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.8,
            textAlign: 'right',
            fontSize: '0.7rem',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Message; 