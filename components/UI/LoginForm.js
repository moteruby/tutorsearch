import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Link as MuiLink, 
  Alert 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '@mui/material/styles';

const LoginForm = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const params = new URLSearchParams();
    params.append('username', formData.username);
    params.append('password', formData.password);

    try {
      await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const userResponse = await api.get('/auth/current-user');
      const userData = userResponse.data;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            bgcolor: 'rgba(211,47,47,0.05)',
            border: '1px solid rgba(211,47,47,0.2)',
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        name="username"
        label="Username"
        variant="outlined"
        required
        fullWidth
        value={formData.username}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              '& fieldset': {
                borderColor: theme.palette.secondary.main,
                borderWidth: '2px',
              },
            },
          },
        }}
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        variant="outlined"
        required
        fullWidth
        value={formData.password}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              '& fieldset': {
                borderColor: theme.palette.secondary.main,
                borderWidth: '2px',
              },
            },
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        sx={{
          mt: 2,
          py: 1.8,
          fontSize: '1.1rem',
          fontWeight: 600,
          background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
          boxShadow: `0 3px 5px 2px ${theme.palette.secondary.main}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 12px 4px ${theme.palette.secondary.main}20`,
          },
        }}
      >
        Sign In
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Don't have an account?{' '}
          <MuiLink
            component={Link}
            to="/register"
            sx={{
              color: theme.palette.secondary.main,
              textDecoration: 'none',
              fontWeight: 500,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '0',
                height: '2px',
                bottom: '-2px',
                left: '0',
                backgroundColor: theme.palette.secondary.main,
                transition: 'width 0.3s ease',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            Sign Up
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm; 