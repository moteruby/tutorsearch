import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Typography, Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Layout/Navbar';
import TutorCard from '../components/Tutors/TutorCard';
import TutorFilters from '../components/Tutors/TutorFilters';
import api from '../services/api';

const HomePage = () => {
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    maxHourlyRate: '',
    minRating: ''
  });

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/auth/current-user');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadTutors = useCallback(async (filterParams = {}) => {
    try {
      const params = new URLSearchParams();
      if (filterParams.search) params.append('search', filterParams.search);
      if (filterParams.subject) params.append('subject', filterParams.subject);
      if (filterParams.maxHourlyRate) params.append('maxHourlyRate', filterParams.maxHourlyRate);
      if (filterParams.minRating) params.append('minRating', filterParams.minRating);

      const response = await api.get(`/tutors?${params.toString()}`);
      setTutors(response.data);
    } catch (error) {
      console.error('Error loading tutors:', error);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
    loadTutors(filters);
  }, [loadTutors, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadTutors(newFilters);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      search: '',
      subject: '',
      maxHourlyRate: '',
      minRating: ''
    };
    setFilters(resetFilters);
    loadTutors(resetFilters);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
            Find Your Perfect Tutor
          </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.secondary.light }}>
            Connect with experienced tutors who can help you achieve your learning goals
          </Typography>
        </Box>

        <Paper elevation={24} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
          <TutorFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
          />
        </Paper>

        <Grid container spacing={3}>
          {tutors.map(tutor => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tutor.id}>
              <TutorCard tutor={tutor} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 