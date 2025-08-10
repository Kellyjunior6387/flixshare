import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Alert,
    Snackbar,
    Fade,
    Slide,
    ThemeProvider,
    CssBaseline,
    Grid,
} from '@mui/material';
import { Email as EmailIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import authTheme from '../../theme/authTheme';

interface OtpVerificationProps {
    email: string;
    purpose: 'signup' | 'reset';
    onVerificationSuccess?: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ 
    email, 
    purpose, 
    onVerificationSuccess 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Extract email from location state if not provided as prop
    const emailToUse = email || location.state?.email || '';

    useEffect(() => {
        if (!emailToUse) {
            navigate('/auth/register');
            return;
        }

        // Start countdown for resend button
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [emailToUse, navigate]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await axios.post(
                'http://localhost:8000/auth/verify-signup-otp/',
                {
                    email: emailToUse,
                    otp: otpCode
                }
            );

            setSuccess(true);
            
            if (onVerificationSuccess) {
                onVerificationSuccess();
            } else {
                // Default behavior: redirect to login after successful signup verification
                setTimeout(() => {
                    if (purpose === 'signup') {
                        navigate('/auth/login', { 
                            state: { 
                                message: 'Email verified successfully! You can now sign in.' 
                            } 
                        });
                    }
                }, 2000);
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Invalid verification code');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        setError(null);

        try {
            await axios.post(
                'http://localhost:8000/auth/send-signup-otp/',
                {
                    email: emailToUse
                }
            );

            // Reset countdown
            setCountdown(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            
            // Restart countdown
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Failed to resend verification code');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsResending(false);
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
                                Verify your email address
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
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    <Typography 
                                        component="h2" 
                                        variant="h5" 
                                        sx={{ 
                                            mb: 2, 
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            color: 'text.primary'
                                        }}
                                    >
                                        Email Verification
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                                        <EmailIcon sx={{ color: 'primary.main', mr: 1 }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                            We've sent a 6-digit code to<br />
                                            <strong>{emailToUse}</strong>
                                        </Typography>
                                    </Box>

                                    {/* OTP Input Grid */}
                                    <Grid container spacing={1} sx={{ mb: 3, justifyContent: 'center' }}>
                                        {otp.map((digit, index) => (
                                            <Grid item key={index} xs={2}>
                                                <TextField
                                                    inputRef={(el) => inputRefs.current[index] = el}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    variant="outlined"
                                                    inputProps={{
                                                        maxLength: 1,
                                                        style: { 
                                                            textAlign: 'center', 
                                                            fontSize: '1.5rem',
                                                            fontWeight: 600,
                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            '&.Mui-focused': {
                                                                '& fieldset': {
                                                                    borderColor: 'primary.main',
                                                                    borderWidth: '2px',
                                                                }
                                                            }
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isLoading || otp.join('').length !== 6}
                                        sx={{ 
                                            mb: 2,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify Email'}
                                    </Button>

                                    {/* Resend Code Section */}
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Didn't receive the code?
                                        </Typography>
                                        
                                        {canResend ? (
                                            <Button
                                                variant="text"
                                                onClick={handleResendOtp}
                                                disabled={isResending}
                                                startIcon={<RefreshIcon />}
                                                sx={{ 
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem',
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                    }
                                                }}
                                            >
                                                {isResending ? 'Sending...' : 'Resend Code'}
                                            </Button>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Resend code in {countdown}s
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate('/auth/register')}
                                            sx={{ 
                                                fontSize: '0.9rem',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    textDecoration: 'underline',
                                                }
                                            }}
                                        >
                                            ← Back to Registration
                                        </Button>
                                    </Box>
                                </Box>
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
                    open={success} 
                    autoHideDuration={6000} 
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        Email verified successfully! Redirecting...
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default OtpVerification;