import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    IconButton,
    Typography,
    Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import api from '../../services/api';

const AddUserModal = ({ open, onClose, onUserAdded, theme }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            onUserAdded(response.data);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'STUDENT'
            });
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to add user');
        }
    };

    const handleClose = () => {
        setError('');
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'STUDENT'
        });
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: `0 8px 32px 0 ${theme.palette.primary.dark}40`,
                }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Typography variant="h6">Add New User</Typography>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.secondary.main,
                                    },
                                },
                            }}
                        />

                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.secondary.main,
                                    },
                                },
                            }}
                        />

                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.secondary.main,
                                    },
                                },
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                label="Role"
                                required
                                sx={{
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.secondary.main,
                                    },
                                }}
                            >
                                <MenuItem value="STUDENT">Student</MenuItem>
                                <MenuItem value="TUTOR">Tutor</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button 
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            borderColor: theme.palette.secondary.main,
                            color: theme.palette.secondary.main,
                            '&:hover': {
                                borderColor: theme.palette.secondary.dark,
                                backgroundColor: 'rgba(43, 122, 120, 0.1)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained"
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
                        Add User
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddUserModal; 