import React from 'react';
import { Container, Paper, Box, Typography, Grid } from '@mui/material';
import RegisterForm from '../components/UI/RegisterForm';
import { useTheme } from '@mui/material/styles';

const RegisterPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 700 }}>
                Join TutorSearch
              </Typography>
            </Box>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
              <RegisterForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterPage; 