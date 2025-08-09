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
    CssBaseline,
    Divider,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Google, GitHub } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authTheme from '../../theme/authTheme';
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
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
                'http://localhost:8000/auth/login/',
                formData
            );

            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);

            // Redirect to dashboard
            navigate('/dashboard');

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Login failed');
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

    const handleOAuthSignIn = async (providerId: string) => {
        try {
            const authUrl = await ThirdParty.getAuthorisationURLWithQueryParamsAndSetState({
                thirdPartyId: providerId,
                frontendRedirectURI: `${window.location.origin}/auth/callback`,
            });
            
            window.location.assign(authUrl);
        } catch (error) {
            console.error(`${providerId} sign in error:`, error);
            setError(`Failed to sign in with ${providerId}`);
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
                                Welcome back! Sign in to continue
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
                                        Sign In
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
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
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
                                        sx={{ mb: 3 }}
                                    />

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
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </Button>

                                    {/* Forgot Password Link */}
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate('/auth/reset-password')}
                                            sx={{ 
                                                fontSize: '0.9rem',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    textDecoration: 'underline',
                                                }
                                            }}
                                        >
                                            Forgot your password?
                                        </Button>
                                    </Box>

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
                                                onClick={() => handleOAuthSignIn('google')}
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
                                                onClick={() => handleOAuthSignIn('github')}
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
                                                onClick={() => handleOAuthSignIn('apple')}
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
                                            Don't have an account?
                                        </Typography>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate('/auth/register')}
                                            sx={{ 
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                }
                                            }}
                                        >
                                            Create Account
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
            </Container>
        </ThemeProvider>
    );
};

export default Login;