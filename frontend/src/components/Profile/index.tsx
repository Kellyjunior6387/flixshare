import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    IconButton,
    CssBaseline,
    Paper,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Dashboard/theme';
import TopBar from '../Dashboard/TopBar';
import { useAuth } from '../../utils/auth';
import axios from 'axios';

const Profile: React.FC = () => {
    const { user, loading: userLoading } = useAuth();
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [message, setMessage] = useState<{text: string, severity: 'success' | 'error'} | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.phone_number) {
            setPhoneNumber(user.phone_number);
            setOriginalPhoneNumber(user.phone_number);
        }
    }, [user]);

    const handleEditPhone = () => {
        setIsEditingPhone(true);
    };

    const handleCancelPhoneEdit = () => {
        setPhoneNumber(originalPhoneNumber);
        setIsEditingPhone(false);
    };

    const handleSavePhone = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:8000/auth/profile/phone/',
                { phone_number: phoneNumber },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            setOriginalPhoneNumber(phoneNumber);
            setIsEditingPhone(false);
            setMessage({ text: 'Phone number updated successfully!', severity: 'success' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage({ text: error.response.data.error || 'Failed to update phone number', severity: 'error' });
            } else {
                setMessage({ text: 'An unexpected error occurred', severity: 'error' });
            }
            setPhoneNumber(originalPhoneNumber);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: 'New passwords do not match', severity: 'error' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ text: 'New password must be at least 8 characters long', severity: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:8000/auth/profile/password/',
                {
                    current_password: passwordData.currentPassword,
                    new_password: passwordData.newPassword,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setIsPasswordDialogOpen(false);
            setMessage({ text: 'Password updated successfully!', severity: 'success' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setMessage({ text: error.response.data.error || 'Failed to update password', severity: 'error' });
            } else {
                setMessage({ text: 'An unexpected error occurred', severity: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;
        return strength;
    };

    const passwordStrength = getPasswordStrength(passwordData.newPassword);
    const getStrengthColor = () => {
        if (passwordStrength < 25) return '#ef4444';
        if (passwordStrength < 50) return '#f59e0b';
        if (passwordStrength < 75) return '#eab308';
        return '#10b981';
    };

    const getStrengthText = () => {
        if (passwordStrength < 25) return 'Weak';
        if (passwordStrength < 50) return 'Fair';
        if (passwordStrength < 75) return 'Good';
        return 'Strong';
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Top Navigation Bar */}
                <TopBar showAddButton={false} />

                {/* Main Content Area */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        width: '100%',
                        mt: '70px',
                        minHeight: 'calc(100vh - 70px)',
                    }}
                >
                    <Container maxWidth="lg" disableGutters>
                        {/* Page Title */}
                        <Box sx={{ mb: 4 }}>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.02em',
                                    mb: 1,
                                }}
                            >
                                Profile Settings
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Manage your account information and preferences
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {/* Profile Information Card */}
                            <Grid item xs={12} md={8}>
                                <Card sx={{ height: 'fit-content' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                            <Avatar 
                                                sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700,
                                                    fontSize: '2rem',
                                                    mr: 3,
                                                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                                                }}
                                            >
                                                {userLoading ? '...' : (user?.username?.[0] || 'U')}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {user?.username || 'Loading...'}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                    FlixShare Member
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                                        {/* User Details */}
                                        <Grid container spacing={3}>
                                            {/* Email Field */}
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <EmailIcon sx={{ color: 'text.secondary', mr: 2 }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        Email Address
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    value={user?.email || ''}
                                                    disabled
                                                    variant="outlined"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            background: 'rgba(255, 255, 255, 0.02)',
                                                        },
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                                    Email cannot be changed. Contact support if needed.
                                                </Typography>
                                            </Grid>

                                            {/* Username Field */}
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <PersonIcon sx={{ color: 'text.secondary', mr: 2 }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        Username
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    value={user?.username || ''}
                                                    disabled
                                                    variant="outlined"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            background: 'rgba(255, 255, 255, 0.02)',
                                                        },
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                                    Username cannot be changed.
                                                </Typography>
                                            </Grid>

                                            {/* Phone Number Field */}
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PhoneIcon sx={{ color: 'text.secondary', mr: 2 }} />
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            Phone Number
                                                        </Typography>
                                                    </Box>
                                                    {!isEditingPhone && (
                                                        <Button
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={handleEditPhone}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </Box>
                                                <TextField
                                                    fullWidth
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    disabled={!isEditingPhone}
                                                    placeholder="Enter your phone number"
                                                    variant="outlined"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            background: isEditingPhone ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                                        },
                                                    }}
                                                />
                                                {isEditingPhone && (
                                                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<SaveIcon />}
                                                            onClick={handleSavePhone}
                                                            disabled={isLoading}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                                },
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<CancelIcon />}
                                                            onClick={handleCancelPhoneEdit}
                                                            disabled={isLoading}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Security Settings Card */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: 'fit-content' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <LockIcon sx={{ color: 'text.secondary', mr: 2 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Security
                                            </Typography>
                                        </Box>

                                        <Paper 
                                            sx={{ 
                                                p: 3, 
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
                                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                                mb: 3,
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                                Password
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                                Last updated 30 days ago
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                onClick={() => setIsPasswordDialogOpen(true)}
                                                sx={{
                                                    borderColor: 'rgba(99, 102, 241, 0.5)',
                                                    color: '#6366f1',
                                                    '&:hover': {
                                                        borderColor: '#6366f1',
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                    },
                                                }}
                                            >
                                                Change Password
                                            </Button>
                                        </Paper>

                                        <Alert 
                                            severity="info"
                                            sx={{
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                                '& .MuiAlert-icon': {
                                                    color: '#3b82f6',
                                                },
                                            }}
                                        >
                                            Keep your account secure by using a strong password and updating it regularly.
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Password Change Dialog */}
                <Dialog
                    open={isPasswordDialogOpen}
                    onClose={() => setIsPasswordDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(16px)',
                        },
                    }}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LockIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Change Password
                            </Typography>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 2 }}>
                        {/* Current Password */}
                        <TextField
                            fullWidth
                            label="Current Password"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('current')}
                                            edge="end"
                                        >
                                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />

                        {/* New Password */}
                        <TextField
                            fullWidth
                            label="New Password"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('new')}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />

                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Password strength
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ color: getStrengthColor(), fontWeight: 600 }}
                                    >
                                        {getStrengthText()}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(148, 163, 184, 0.2)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: `${passwordStrength}%`,
                                            height: '100%',
                                            backgroundColor: getStrengthColor(),
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Confirm Password */}
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            margin="normal"
                            variant="outlined"
                            error={passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword}
                            helperText={
                                passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword
                                    ? 'Passwords do not match'
                                    : ''
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            edge="end"
                                        >
                                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button 
                            onClick={() => setIsPasswordDialogOpen(false)}
                            sx={{ color: 'text.secondary' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePasswordChange}
                            disabled={
                                isLoading ||
                                !passwordData.currentPassword ||
                                !passwordData.newPassword ||
                                passwordData.newPassword !== passwordData.confirmPassword ||
                                passwordData.newPassword.length < 8
                            }
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                },
                            }}
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Success/Error Messages */}
                <Snackbar 
                    open={!!message} 
                    autoHideDuration={6000} 
                    onClose={() => setMessage(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        severity={message?.severity || 'info'} 
                        onClose={() => setMessage(null)}
                        sx={{ width: '100%' }}
                    >
                        {message?.text}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default Profile;