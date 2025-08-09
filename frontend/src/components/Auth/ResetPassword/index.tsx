import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Alert,
    Snackbar,
    Slide,
    Fade,
    ThemeProvider,
    CssBaseline,
    InputAdornment,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    LinearProgress,
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    ArrowBack as ArrowBackIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authTheme from '../../../theme/authTheme';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const steps = ['Enter Email', 'Verify OTP', 'Set New Password'];

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:8000/auth/send-reset-otp/', {
                email: email,
            });
            
            setSuccess('OTP sent to your email address');
            setCurrentStep(1);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Failed to send OTP');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:8000/auth/verify-reset-otp/', {
                email: email,
                otp: otp,
            });
            
            setSuccess('OTP verified successfully');
            setCurrentStep(2);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Invalid OTP');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('http://localhost:8000/auth/reset-password/', {
                email: email,
                otp: otp,
                new_password: newPassword,
            });
            
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Failed to reset password');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:8000/auth/send-reset-otp/', {
                email: email,
            });
            
            setSuccess('OTP resent to your email address');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Failed to resend OTP');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;
        return strength;
    };

    const passwordStrength = getPasswordStrength(newPassword);
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Box component="form" onSubmit={handleSendOTP} noValidate>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                            Enter your email address and we'll send you an OTP to reset your password.
                        </Typography>
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading || !email.trim()}
                            sx={{ 
                                mb: 3,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="text"
                                onClick={() => navigate('/auth/login')}
                                startIcon={<ArrowBackIcon />}
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </Box>
                );

            case 1:
                return (
                    <Box component="form" onSubmit={handleVerifyOTP} noValidate>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                            We've sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below.
                        </Typography>
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="otp"
                            label="Enter OTP"
                            name="otp"
                            autoComplete="off"
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            inputProps={{ 
                                maxLength: 6,
                                style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading || otp.length !== 6}
                            sx={{ 
                                mb: 2,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                Didn't receive the OTP?
                            </Typography>
                            <Button
                                variant="text"
                                onClick={handleResendOTP}
                                disabled={isLoading}
                                sx={{ 
                                    fontSize: '0.9rem',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                Resend OTP
                            </Button>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="text"
                                onClick={() => setCurrentStep(0)}
                                startIcon={<ArrowBackIcon />}
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                }}
                            >
                                Change Email
                            </Button>
                        </Box>
                    </Box>
                );

            case 2:
                return (
                    <Box component="form" onSubmit={handleResetPassword} noValidate>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                            Create a new password for your account.
                        </Typography>
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 1 }}
                        />

                        {/* Password Strength Indicator */}
                        {newPassword && (
                            <Box sx={{ mb: 2 }}>
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
                                <LinearProgress
                                    variant="determinate"
                                    value={passwordStrength}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(148, 163, 184, 0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getStrengthColor(),
                                            borderRadius: 3,
                                            transition: 'all 0.3s ease',
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={confirmPassword !== '' && newPassword !== confirmPassword}
                            helperText={
                                confirmPassword !== '' && newPassword !== confirmPassword
                                    ? 'Passwords do not match'
                                    : ''
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={
                                isLoading || 
                                !newPassword || 
                                !confirmPassword || 
                                newPassword !== confirmPassword ||
                                newPassword.length < 8
                            }
                            sx={{ 
                                mb: 2,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="text"
                                onClick={() => setCurrentStep(1)}
                                startIcon={<ArrowBackIcon />}
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                }}
                            >
                                Back to OTP
                            </Button>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={authTheme}>
            <CssBaseline />
            <Container 
                component="main" 
                maxWidth="sm" 
                className="auth-container"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 3,
                }}
            >
                <Fade in={true} timeout={800}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 450,
                        }}
                    >
                        {/* Logo/Brand Section */}
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ 
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 800,
                                    mb: 1,
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                FlixShare
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{ fontSize: '1.1rem' }}
                            >
                                Reset your password
                            </Typography>
                        </Box>

                        <Slide direction="up" in={true} timeout={600}>
                            <Paper 
                                elevation={5} 
                                sx={{ 
                                    p: { xs: 3, sm: 4 }, 
                                    width: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #f59e0b)',
                                        borderRadius: '12px 12px 0 0',
                                    }
                                }}
                            >
                                {/* Step Indicator */}
                                <Box sx={{ mb: 4 }}>
                                    <Stepper activeStep={currentStep} alternativeLabel>
                                        {steps.map((label, index) => (
                                            <Step key={label}>
                                                <StepLabel
                                                    StepIconComponent={({ active, completed }) => (
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                background: completed 
                                                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                                                    : active
                                                                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                                    : 'rgba(255, 255, 255, 0.1)',
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                fontSize: '0.9rem',
                                                            }}
                                                        >
                                                            {completed ? <CheckIcon fontSize="small" /> : index + 1}
                                                        </Box>
                                                    )}
                                                    sx={{
                                                        '& .MuiStepLabel-label': {
                                                            color: 'text.secondary',
                                                            fontSize: '0.8rem',
                                                            mt: 1,
                                                        },
                                                    }}
                                                >
                                                    {label}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>

                                <Typography 
                                    component="h2" 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 3, 
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: 'text.primary'
                                    }}
                                >
                                    {steps[currentStep]}
                                </Typography>

                                {renderStepContent()}
                            </Paper>
                        </Slide>
                    </Box>
                </Fade>

                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={() => setError(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        severity="error" 
                        onClose={() => setError(null)}
                        sx={{ width: '100%' }}
                    >
                        {error}
                    </Alert>
                </Snackbar>

                <Snackbar 
                    open={!!success} 
                    autoHideDuration={6000} 
                    onClose={() => setSuccess(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        {success}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default ResetPassword;