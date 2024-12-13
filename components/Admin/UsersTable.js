import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Avatar,
    Box,
    Button
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const UsersTable = ({ users, onEdit, onToggleStatus, onDelete, theme }) => {
    return (
        <TableContainer
            component={Paper}
            sx={{
                backgroundColor: 'transparent',
                '& .MuiTable-root': {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            '& th': {
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        }}
                    >
                        <TableCell>User</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.id}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={user.imageUrl || '/images/default-avatar.png'}
                                        alt={user.username}
                                    />
                                    {user.username}
                                </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Chip
                                    label={user.role}
                                    color={
                                        user.role === 'ADMIN'
                                            ? 'error'
                                            : user.role === 'TUTOR'
                                            ? 'primary'
                                            : 'default'
                                    }
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    onClick={() => onToggleStatus(user.id)}
                                    sx={{
                                        backgroundColor: user.enabled ? 
                                            theme.palette.success.main : 
                                            theme.palette.error.main,
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: user.enabled ? 
                                                theme.palette.success.dark : 
                                                theme.palette.error.dark,
                                        },
                                        textTransform: 'none',
                                        minWidth: '100px',
                                    }}
                                >
                                    {user.enabled ? 'Active' : 'Inactive'}
                                </Button>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => onEdit(user)}
                                    sx={{
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor: `${theme.palette.primary.main}20`,
                                        },
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => onDelete(user.id)}
                                    sx={{
                                        color: theme.palette.error.main,
                                        '&:hover': {
                                            backgroundColor: `${theme.palette.error.main}20`,
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;