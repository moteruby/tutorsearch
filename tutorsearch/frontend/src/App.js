import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import TutorDetailsPage from './pages/TutorDetailsPage';
import ChatPage from './pages/ChatPage';
import ChatsListPage from './pages/ChatsListPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import api from './services/api';

// Создаем тему для Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#17252A', // темно-бирюзовый
      light: '#2B7A78', // бирюзовый
      dark: '#17252A', // темно-бирюзовый
    },
    secondary: {
      main: '#3AAFA9', // светло-бирюзовый
      light: '#DEF2F1', // очень светлый бирюзовый
      dark: '#2B7A78', // бирюзовый
    },
    background: {
      default: '#DEF2F1', // очень светлый бирюзовый
      paper: '#FEFFFF', // белый
    },
    text: {
      primary: '#17252A', // темно-бирюзовый
      secondary: '#2B7A78', // бирюзовый
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#17252A',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Компонент для проверки аутентификации
const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (location.pathname === '/login' || location.pathname === '/register') {
        return;
      }

      try {
        await api.get('/auth/current-user');
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, location]);

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthCheck>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } />
            <Route path="/admin/dashboard" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/tutor/:id" element={
              <PrivateRoute>
                <TutorDetailsPage />
              </PrivateRoute>
            } />
            <Route path="/chat/:receiverId" element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            } />
            <Route path="/my-chats" element={
              <PrivateRoute>
                <ChatsListPage />
              </PrivateRoute>
            } />
            <Route path="/calendar" element={
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/chats" element={<ChatsListPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthCheck>
      </Router>
    </ThemeProvider>
  );
};

export default App;
