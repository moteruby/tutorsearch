import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link as MuiLink,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '@mui/material/styles';

const RegisterForm = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT'
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

    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
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
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        required
        fullWidth
        value={formData.email}
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

      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleChange}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.secondary.main,
                borderWidth: '2px',
              },
            },
          }}
        >
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="TUTOR">Tutor</MenuItem>
        </Select>
      </FormControl>

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
        Create Account
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Already have an account?{' '}
          <MuiLink
            component={Link}
            to="/login"
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
            Sign In
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm; 