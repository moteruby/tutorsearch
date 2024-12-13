import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/current-user');
        setUser(response.data);
        setIsChecking(false);
      } catch (error) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return null;
  }

  // Проверка роли для админских маршрутов
  if (window.location.pathname.startsWith('/admin') && user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute; 