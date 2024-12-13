import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Layout/Navbar';
import UsersTable from '../components/Admin/UsersTable';
import EditUserModal from '../components/Admin/EditUserModal';
import AddUserModal from '../components/Admin/AddUserModal';
import api from '../services/api';

const AdminDashboard = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/auth/current-user');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const filterUsers = useCallback(() => {
    let filtered = [...users];

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter, searchQuery]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers, roleFilter, searchQuery]);

  const handleEditUser = async (userId, userData) => {
    try {
      await api.put(`/admin/users/${userId}`, userData);
      loadUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/toggle-status`);
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUserAdded = () => {
    loadUsers();
    setIsAddUserModalOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddUserModalOpen(true)}
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
              Add New User
            </Button>
          </Box>
          
          <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Role Filter</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role Filter"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  },
                }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="STUDENT">Students</MenuItem>
                <MenuItem value="TUTOR">Tutors</MenuItem>
                <MenuItem value="ADMIN">Admins</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Search users"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
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
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Box>

          <UsersTable
            users={filteredUsers}
            onEdit={(user) => {
              setEditUser(user);
              setIsModalOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteUser}
            theme={theme}
          />
        </Paper>
      </Container>

      <EditUserModal
        open={isModalOpen}
        user={editUser}
        onClose={() => {
          setIsModalOpen(false);
          setEditUser(null);
        }}
        onSave={handleEditUser}
        theme={theme}
      />

      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
        theme={theme}
      />

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

export default AdminDashboard; 