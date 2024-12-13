import React from 'react';
import { Container, Paper, Box, Typography, Grid } from '@mui/material';
import LoginForm from '../components/UI/LoginForm';
import { useTheme } from '@mui/material/styles';

const LoginPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          transform: 'skewY(-5deg)',
          transformOrigin: 'top left',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: theme.palette.background.paper,
                  fontWeight: 700,
                  textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                  mb: 2,
                }}
              >
                TutorSearch
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.secondary.light,
                  fontWeight: 400,
                }}
              >
                Sign in to find your perfect tutor
              </Typography>
            </Box>

            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: `0 8px 32px 0 ${theme.palette.primary.dark}40`,
                border: `1px solid ${theme.palette.background.paper}`,
              }}
            >
              <LoginForm />
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: theme.palette.secondary.main,
            opacity: 0.1,
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '-5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: theme.palette.primary.light,
            opacity: 0.1,
            filter: 'blur(40px)',
          }}
        />
      </Container>
    </Box>
  );
};

export default LoginPage; 