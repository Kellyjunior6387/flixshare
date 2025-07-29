import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Avatar, 
  Button, 
  IconButton, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  ThemeProvider,
  CssBaseline,
  Container,
  TextField,
  Snackbar,
  //InputAdornment
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  RemoveCircle as RemoveCircleIcon,
  ExitToApp as ExitToAppIcon,
  ContentCopy as ContentCopyIcon,
  PersonAdd as PersonAddIcon,

  //Person as PersonIcon
} from '@mui/icons-material';
import { RoomDetailData } from './types';
import axios from 'axios';
import authTheme from '../../theme/authTheme';

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ user_id: string; username: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8080/room/${roomId}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || 'Failed to fetch room details');
          if (error.response?.status === 401) {
            navigate('/login');
          }
        }
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, navigate]);

  const handleLeaveRoom = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/room/${roomId}/leave/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSnackbarMessage('Successfully left the room');
      setSnackbarOpen(true);
      setLeaveDialogOpen(false);
      // Navigate back to dashboard
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to leave room');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8080/room/${roomId}/delete/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSnackbarMessage('Room deleted successfully');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      // Navigate back to dashboard
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to delete room');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/room/${roomId}/remove-member/`,
        { member_user_id: memberToRemove.user_id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSnackbarMessage(`${memberToRemove.username} removed successfully`);
      setSnackbarOpen(true);
      setRemoveMemberDialogOpen(false);
      setMemberToRemove(null);
      // Refresh room data
      fetchRoomDetails();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to remove member');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyRoomId = () => {
    if (room) {
      navigator.clipboard.writeText(room.id);
      setSnackbarMessage('Room ID copied to clipboard!');
      setSnackbarOpen(true);
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/room/${roomId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setRoom(response.data);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to fetch room details');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
      setLoading(false);
    }
  };

  // Payment status counts
  const paidCount = room?.members.filter(member => member.payment_status === 'paid').length || 0;
  const pendingCount = room?.members.filter(member => member.payment_status === 'pending').length || 0;
  const overdueCount = room?.members.filter(member => member.payment_status === 'overdue').length || 0;

  // Individual cost calculation
  const individualCost = room ? parseFloat(room.cost) / room.member_count : 0;

  if (loading) return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    </ThemeProvider>
  );
  
  if (error) return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            backdropFilter: 'blur(20px)',
            fontSize: '1rem'
          }}
        >
          {error}
        </Alert>
      </Container>
    </ThemeProvider>
  );
  
  if (!room) return null;

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ py: 3 }}>
      {/* Back button and room title */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: 3,
        p: 3,
        border: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }
      }}>
        <IconButton 
          sx={{ 
            mr: 2,
            background: 'rgba(99, 102, 241, 0.1)',
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.2)',
              transform: 'translateX(-2px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }} 
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon sx={{ color: '#6366f1' }} />
        </IconButton>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em'
          }}
        >
          Room Details
        </Typography>
      </Box>

      {/* Room Header */}
      <Paper sx={{ 
        mb: 4, 
        p: 4, 
        borderRadius: 4,
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: 3,
                p: 1.5,
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
              }}>
                <Avatar 
                  src={`/services/${room.service.toLowerCase()}.png`}
                  alt={room.service}
                  variant="rounded"
                  sx={{ 
                    width: 72, 
                    height: 72,
                    bgcolor: 'transparent',
                  }}
                />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.025em'
                  }}
                >
                  {room.name}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(203, 213, 225, 0.8)', 
                    mb: 2,
                    fontWeight: 500
                  }}
                >
                  {room.service}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip 
                    size="medium" 
                    label={`${room.member_count} members`} 
                    sx={{ 
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#6ee7b7',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  />
                  {room.user_role === 'owner' && (
                    <Chip 
                      size="medium" 
                      label="You are the owner" 
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, mb: 2 }}>
                <Typography 
                  variant="h4" 
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {room.cost} Ksh/month
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(203, 213, 225, 0.7)', 
                    mt: 0.5,
                    fontSize: '1rem'
                  }}
                >
                  Next billing: {new Date(room.due_date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {room.user_role === 'owner' ? (
                  <>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<PersonAddIcon />}
                      onClick={() => setInviteDialogOpen(true)}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 35px rgba(99, 102, 241, 0.5)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      Invite Member
                    </Button>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 35px rgba(239, 68, 68, 0.5)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      Delete Room
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<ExitToAppIcon />}
                    onClick={() => setLeaveDialogOpen(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 35px rgba(245, 158, 11, 0.5)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Leave Room
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Description */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          background: 'rgba(15, 23, 42, 0.5)', 
          borderRadius: 2,
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(203, 213, 225, 0.9)',
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            {room.description}
          </Typography>
        </Box>

        {/* Account Info Section */}
        {room.account_email && (
          <Box sx={{ 
            mt: 4, 
            p: 3, 
            background: 'rgba(15, 23, 42, 0.6)', 
            borderRadius: 3,
            border: '1px solid rgba(148, 163, 184, 0.1)',
            backdropFilter: 'blur(10px)',
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🔐 Account Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}>
                  <Typography variant="body1" sx={{ mr: 2, fontWeight: 500, color: '#cbd5e1' }}>
                    Email:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#f8fafc',
                      flex: 1,
                      fontFamily: 'monospace'
                    }}
                  >
                    {room.account_email}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => navigator.clipboard.writeText(room.account_email!)}
                    sx={{
                      ml: 1,
                      background: 'rgba(99, 102, 241, 0.2)',
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.3)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ContentCopyIcon fontSize="small" sx={{ color: '#6366f1' }} />
                  </IconButton>
                </Box>
              </Grid>
              {room.account_password && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 2,
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}>
                    <Typography variant="body1" sx={{ mr: 2, fontWeight: 500, color: '#cbd5e1' }}>
                      Password:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#f8fafc',
                        flex: 1,
                        fontFamily: 'monospace'
                      }}
                    >
                      {room.account_password}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => navigator.clipboard.writeText(room.account_password!)}
                      sx={{
                        ml: 1,
                        background: 'rgba(99, 102, 241, 0.2)',
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.3)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ContentCopyIcon fontSize="small" sx={{ color: '#6366f1' }} />
                    </IconButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Payment Summary */}
      <Paper sx={{ 
        mb: 4, 
        p: 4, 
        borderRadius: 4,
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          💳 Payment Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 3,
              border: 'none',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  Individual Cost
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 700, 
                    my: 1,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {individualCost.toFixed(2)} Ksh
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem'
                  }}
                >
                  Per member/month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(148, 163, 184, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                transform: 'translateY(-2px)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#f8fafc',
                    fontWeight: 600,
                    mb: 3
                  }}
                >
                  Payment Status Distribution
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2,
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    minWidth: '80px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(16, 185, 129, 0.15)',
                      transform: 'scale(1.05)',
                    }
                  }}>
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {paidCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6ee7b7', mt: 0.5 }}>
                      Paid
                    </Typography>
                  </Box>
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                      mx: 1 
                    }} 
                  />
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2,
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    minWidth: '80px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(245, 158, 11, 0.15)',
                      transform: 'scale(1.05)',
                    }
                  }}>
                    <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      {pendingCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fbbf24', mt: 0.5 }}>
                      Pending
                    </Typography>
                  </Box>
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ 
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                      mx: 1 
                    }} 
                  />
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 2,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    minWidth: '80px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.15)',
                      transform: 'scale(1.05)',
                    }
                  }}>
                    <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                      {overdueCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fca5a5', mt: 0.5 }}>
                      Overdue
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Members List */}
      <Paper sx={{ 
        p: 4, 
        borderRadius: 4,
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          👥 Members ({room.member_count})
        </Typography>
        <List disablePadding>
          {room.members.map((member, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{
                py: 2,
                px: 0,
                '&:hover': {
                  background: 'rgba(15, 23, 42, 0.3)',
                  borderRadius: 2,
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                }
              }}>
                <ListItemAvatar>
                  <Avatar sx={{
                    width: 48,
                    height: 48,
                    background: member.role === 'owner' 
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}>
                    {member.username[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#f8fafc',
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        {member.username}
                      </Typography>
                      {member.role === 'owner' && (
                        <Chip 
                          size="small" 
                          label="Owner" 
                          sx={{ 
                            height: 24, 
                            fontSize: '0.75rem',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: '#ffffff',
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(203, 213, 225, 0.7)',
                        mt: 0.5,
                        fontSize: '0.95rem'
                      }}
                    >
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </Typography>
                  }
                />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mr: 2,
                  p: 1.5,
                  borderRadius: 2,
                  ...(member.payment_status === 'paid' && {
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }),
                  ...(member.payment_status === 'pending' && {
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }),
                  ...(member.payment_status === 'overdue' && {
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }),
                }}>
                  {member.payment_status === 'paid' ? (
                    <>
                      <CheckCircleIcon sx={{ color: '#10b981', mr: 1, fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#6ee7b7', fontWeight: 600 }}>
                        Paid
                      </Typography>
                    </>
                  ) : member.payment_status === 'pending' ? (
                    <>
                      <WarningIcon sx={{ color: '#f59e0b', mr: 1, fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                        Pending
                      </Typography>
                    </>
                  ) : (
                    <>
                      <WarningIcon sx={{ color: '#ef4444', mr: 1, fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#fca5a5', fontWeight: 600 }}>
                        Overdue
                      </Typography>
                    </>
                  )}
                </Box>
                {room.user_role === 'owner' && member.role !== 'owner' && (
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="remove member"
                      onClick={() => {
                        setMemberToRemove({ user_id: member.user_id, username: member.username });
                        setRemoveMemberDialogOpen(true);
                      }}
                      sx={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        '&:hover': {
                          background: 'rgba(239, 68, 68, 0.2)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <RemoveCircleIcon sx={{ color: '#ef4444' }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {index < room.members.length - 1 && (
                <Divider 
                  component="li" 
                  sx={{ 
                    borderColor: 'rgba(148, 163, 184, 0.1)',
                    my: 1
                  }} 
                />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Invite Dialog */}
      <Dialog 
        open={inviteDialogOpen} 
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#f8fafc', fontWeight: 600 }}>
          Invite Members to Room
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(203, 213, 225, 0.8)', mb: 3 }}>
            Share this Room ID with people you want to invite:
          </Typography>
          <TextField
            fullWidth
            value={room?.id || ''}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={handleCopyRoomId} sx={{ color: '#6366f1' }}>
                  <ContentCopyIcon />
                </IconButton>
              ),
              sx: {
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#f8fafc',
                fontFamily: 'monospace',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(148, 163, 184, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(148, 163, 184, 0.4)',
                },
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setInviteDialogOpen(false)}
            sx={{ color: 'rgba(203, 213, 225, 0.8)' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Room Dialog */}
      <Dialog 
        open={leaveDialogOpen} 
        onClose={() => setLeaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#f8fafc', fontWeight: 600 }}>
          Leave Room
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'rgba(203, 213, 225, 0.9)' }}>
            Are you sure you want to leave this room? You will no longer have access to the shared subscription.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLeaveDialogOpen(false)}
            sx={{ color: 'rgba(203, 213, 225, 0.8)' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLeaveRoom}
            disabled={actionLoading}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              },
            }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Leave Room'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Room Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#f8fafc', fontWeight: 600 }}>
          Delete Room
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'rgba(203, 213, 225, 0.9)' }}>
            Are you sure you want to delete this room? This action cannot be undone and will remove all members from the room.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'rgba(203, 213, 225, 0.8)' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteRoom}
            disabled={actionLoading}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
            }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Delete Room'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog 
        open={removeMemberDialogOpen} 
        onClose={() => setRemoveMemberDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#f8fafc', fontWeight: 600 }}>
          Remove Member
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'rgba(203, 213, 225, 0.9)' }}>
            Are you sure you want to remove <strong>{memberToRemove?.username}</strong> from this room?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setRemoveMemberDialogOpen(false);
              setMemberToRemove(null);
            }}
            sx={{ color: 'rgba(203, 213, 225, 0.8)' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRemoveMember}
            disabled={actionLoading}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
            }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Remove Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#ffffff',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RoomDetail;