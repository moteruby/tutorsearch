import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Rating,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Schedule as ScheduleIcon,
  Chat as ChatIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import Navbar from '../components/Layout/Navbar';
import ReviewForm from '../components/Reviews/ReviewForm';
import ReviewsList from '../components/Reviews/ReviewsList';
import LessonRequestModal from '../components/Lessons/LessonRequestModal';
import api from '../services/api';

const TutorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tutor, setTutor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const loadTutorDetails = useCallback(async () => {
    try {
      const response = await api.get(`/tutors/${id}`);
      setTutor(response.data);
    } catch (error) {
      console.error('Error loading tutor details:', error);
      navigate('/');
    }
  }, [id, navigate]);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/auth/current-user');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    if (id) {
      loadTutorDetails();
    }
  }, [id, loadTutorDetails]);

  if (!tutor) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={24} sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={tutor.imageUrl || '/images/default-avatar.png'}
                  alt={tutor.username}
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mb: 2,
                    border: `4px solid ${theme.palette.secondary.main}`,
                  }}
                />
                <Typography variant="h4" gutterBottom fontWeight="600">
                  {tutor.username}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                  <Rating value={tutor.averageRating} precision={0.5} readOnly />
                  <Typography variant="body1" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                    ({tutor.reviews?.length || 0} reviews)
                  </Typography>
                </Box>
                {tutor.hourlyRate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <MoneyIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="h6" color="secondary.main" fontWeight="600">
                      ${tutor.hourlyRate}/hour
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  Subjects
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tutor.subjects.map((subject) => (
                    <Chip
                      key={subject}
                      label={subject}
                      sx={{
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.secondary.dark,
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {tutor.description || 'No description available'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ScheduleIcon />}
                  onClick={() => setIsLessonModalOpen(true)}
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
                  Schedule Lesson
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ChatIcon />}
                  onClick={() => navigate(`/chat/${tutor.id}`)}
                  sx={{
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      borderColor: theme.palette.secondary.dark,
                      backgroundColor: 'rgba(43, 122, 120, 0.1)',
                    },
                  }}
                >
                  Chat
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={24} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                Reviews
              </Typography>
              
              {currentUser?.role === 'STUDENT' && currentUser?.id && (
                <>
                  <ReviewForm
                    tutorId={tutor.id}
                    currentUserReview={tutor.reviews?.find(
                      r => r.studentId === currentUser.id
                    )}
                    onReviewSubmitted={loadTutorDetails}
                  />
                  <Divider sx={{ my: 4 }} />
                </>
              )}

              <ReviewsList reviews={tutor.reviews || []} />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <LessonRequestModal
        open={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        tutor={tutor}
      />

      {/* Декоративные элементы */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          left: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: theme.palette.secondary.main,
          opacity: 0.1,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '-5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: theme.palette.primary.light,
          opacity: 0.1,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default TutorDetailsPage; 