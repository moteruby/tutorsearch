import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Rating, 
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const TutorCard = ({ tutor }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showError, setShowError] = React.useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChatClick = () => {
    if (currentUser.id === tutor.id) {
      setShowError(true);
      return;
    }
    navigate(`/chat/${tutor.id}`);
  };

  return (
    <>
      <Paper
        elevation={24}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: `0 8px 32px 0 ${theme.palette.primary.dark}20`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 40px 0 ${theme.palette.primary.dark}30`,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            paddingTop: '75%', // 4:3 Aspect Ratio
            backgroundColor: theme.palette.grey[100],
          }}
        >
          <Box
            component="img"
            src={tutor.imageUrl || '/images/default-avatar.png'}
            alt={tutor.username}
            onError={(e) => {
              e.target.src = '/images/default-avatar.png';
            }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            {tutor.username}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '4.5em',
            }}
          >
            {tutor.description || 'No description available'}
          </Typography>

          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tutor.subjects.map((subject, index) => (
              <Chip
                key={index}
                label={subject}
                size="small"
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.dark,
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={tutor.averageRating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({tutor.averageRating.toFixed(1)})
              </Typography>
            </Box>
            {tutor.hourlyRate && (
              <Typography
                variant="subtitle1"
                color="secondary.main"
                fontWeight="600"
              >
                ${tutor.hourlyRate}/hr
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(`/tutor/${tutor.id}`)}
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
            Details
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleChatClick}
            disabled={currentUser.id === tutor.id}
            sx={{
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                backgroundColor: 'rgba(43, 122, 120, 0.1)',
              },
              '&.Mui-disabled': {
                borderColor: theme.palette.grey[300],
                color: theme.palette.grey[500],
              },
            }}
          >
            Chat
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="warning"
          variant="filled"
          sx={{ width: '100%' }}
        >
          You cannot start a chat with yourself
        </Alert>
      </Snackbar>
    </>
  );
};

export default TutorCard; 