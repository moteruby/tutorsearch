import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Layout/Navbar';
import TutorFields from '../components/Profile/TutorFields';
import api from '../services/api';

const ProfilePage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    imageUrl: '',
    description: '',
    hourlyRate: '',
    subjects: []
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/profile/current');
      const userData = response.data;
      setCurrentUser(userData);
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        password: '',
        imageUrl: userData.imageUrl || '',
        description: userData.description || '',
        hourlyRate: userData.hourlyRate || '',
        subjects: userData.subjects || []
      });
      setLoading(false);
    } catch (error) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/profile/update', profileData);
      setSuccess('Profile updated successfully!');
      setProfileData(prev => ({
        ...prev,
        ...response.data,
        password: '' // Очищаем пароль после успешного обновления
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleFieldChange = (field) => (value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
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
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Edit Profile
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Avatar
                    src={profileData.imageUrl || '/images/default-avatar.png'}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: '0 auto',
                      mb: 2,
                      border: `4px solid ${theme.palette.secondary.main}`,
                    }}
                  />
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
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
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('profileImage', file);
                          api.put('/profile/update', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          })
                          .then(response => {
                            setProfileData(prev => ({
                              ...prev,
                              imageUrl: response.data.imageUrl
                            }));
                            setSuccess('Profile image updated successfully');
                          })
                          .catch(error => {
                            setError('Failed to update profile image');
                          });
                        }
                      }}
                    />
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={profileData.username}
                    onChange={(e) => handleFieldChange('username')(e.target.value)}
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
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleFieldChange('email')(e.target.value)}
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
                    fullWidth
                    label="New Password (leave empty to keep current)"
                    type="password"
                    value={profileData.password}
                    onChange={(e) => handleFieldChange('password')(e.target.value)}
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

                  {currentUser?.role === 'TUTOR' && (
                    <TutorFields
                      description={profileData.description}
                      hourlyRate={profileData.hourlyRate}
                      subjects={profileData.subjects}
                      onFieldChange={handleFieldChange}
                      theme={theme}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
                      boxShadow: `0 3px 5px 2px ${theme.palette.secondary.main}30`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 12px 4px ${theme.palette.secondary.main}20`,
                      },
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage; 