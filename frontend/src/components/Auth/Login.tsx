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
    CssBaseline
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authTheme from '../../theme/authTheme';

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
                                            mb: 3,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </Button>

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