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
    IconButton,
    InputAdornment,
    Slide,
    Fade,
    ThemeProvider,
    LinearProgress,
    CssBaseline,
    Divider,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Phone, Google, GitHub } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authTheme from '../../theme/authTheme';
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        phone_number: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/auth/register/',
                formData
            );
            console.log(response);
            setSuccess(true);
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Registration failed');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOAuthSignUp = async (providerId: string) => {
        try {
            const authUrl = await ThirdParty.getAuthorisationURLWithQueryParamsAndSetState({
                thirdPartyId: providerId,
                frontendRedirectURI: `${window.location.origin}/auth/callback`,
            });
            
            window.location.assign(authUrl);
        } catch (error) {
            console.error(`${providerId} sign up error:`, error);
            setError(`Failed to sign up with ${providerId}`);
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

    const passwordStrength = getPasswordStrength(formData.password);
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
                                Create your account to get started
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
                                            mb: 3, 
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            color: 'text.primary'
                                        }}
                                    >
                                        Create Account
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="phone_number"
                                        label="Phone Number"
                                        name="phone_number"
                                        autoComplete="tel"
                                        placeholder="254XXXXXXXXX"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={togglePasswordVisibility}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        edge="end"
                                                        sx={{ color: 'text.secondary' }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 1 }}
                                    />

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <Box sx={{ mb: 3 }}>
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

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isLoading}
                                        sx={{ 
                                            mb: 2,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Button>

                                    {/* OAuth Divider */}
                                    <Box sx={{ my: 3 }}>
                                        <Divider sx={{ 
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            '&::before, &::after': {
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    px: 2,
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                Or continue with
                                            </Typography>
                                        </Divider>
                                    </Box>

                                    {/* OAuth Buttons */}
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => handleOAuthSignUp('google')}
                                                disabled={isLoading}
                                                startIcon={<Google />}
                                                sx={{
                                                    py: 1.2,
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'text.primary',
                                                    '&:hover': {
                                                        borderColor: '#db4437',
                                                        background: 'rgba(219, 68, 55, 0.1)',
                                                        color: '#db4437',
                                                    },
                                                }}
                                            >
                                                Google
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => handleOAuthSignUp('github')}
                                                disabled={isLoading}
                                                startIcon={<GitHub />}
                                                sx={{
                                                    py: 1.2,
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'text.primary',
                                                    '&:hover': {
                                                        borderColor: '#333',
                                                        background: 'rgba(51, 51, 51, 0.1)',
                                                        color: '#333',
                                                    },
                                                }}
                                            >
                                                GitHub
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => handleOAuthSignUp('apple')}
                                                disabled={isLoading}
                                                startIcon={
                                                    <Box
                                                        component="svg"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                                    </Box>
                                                }
                                                sx={{
                                                    py: 1.2,
                                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'text.primary',
                                                    '&:hover': {
                                                        borderColor: '#000',
                                                        background: 'rgba(0, 0, 0, 0.1)',
                                                        color: '#000',
                                                    },
                                                }}
                                            >
                                                Continue with Apple
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={{ mb: 1 }}
                                        >
                                            Already have an account?
                                        </Typography>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate('/auth/login')}
                                            sx={{ 
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                }
                                            }}
                                        >
                                            Sign In
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
                        Registration successful! Redirecting to login...
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
};

export default Register;