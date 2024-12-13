import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box 
          component="img"
          src="/images/logo.png"
          alt="TutorSearch Logo"
          sx={{
            height: 40,
            mr: 2,
            cursor: 'pointer',
            objectFit: 'contain',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={() => navigate('/')}
        />

        <Button color="inherit" onClick={() => navigate('/')}>
          Home
        </Button>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/my-chats')}>
            Chats
          </Button>
          <Button color="inherit" onClick={() => navigate('/calendar')}>
            Calendar
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            Edit Profile
          </Button>
          {user?.role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
              Admin Panel
            </Button>
          )}
        </Box>

        <Typography variant="body1" sx={{ mr: 2 }}>
          {user?.username}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 