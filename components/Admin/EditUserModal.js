import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const EditUserModal = ({ open, user, onClose, onSave, theme }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        password: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                role: user.role || '',
                password: ''
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.id, formData);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                <Typography variant="h6">Edit User</Typography>
                <IconButton
                    onClick={onClose}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            >
                                <MenuItem value="STUDENT">Student</MenuItem>
                                <MenuItem value="TUTOR">Tutor</MenuItem>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            name="password"
                            label="New Password (optional)"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.secondary.main,
                                    },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button 
                        onClick={onClose}
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
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditUserModal;