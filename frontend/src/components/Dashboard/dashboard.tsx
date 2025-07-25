import React, { useState } from 'react';
import { 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Divider, 
  Box,
  CssBaseline,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  ListItemIcon,
} from '@mui/material';
import { 
  Add as AddIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { useRooms } from './data';
import CreateRoomForm, { RoomFormData } from '../Forms/CreateRoomForm';
import JoinRoomForm from '../Forms/JoinRoomForm';
import axios from 'axios'
import {logout} from '../Auth/tokenManager'
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../utils/auth';


const FlixshareApp: React.FC = () => {
  //State management
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false)

  //Hooks
  const { rooms, loading, error, refetch } = useRooms();
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate()
  
  //Event handlers
  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setProfileAnchorEl(null);
  };
  
  const handleClose = () => {
    setAddAnchorEl(null);
  };
  
  const handleCreateRoom = () => {
    setOpenCreateDialog(true);
    handleClose();
  };
  
  const handleJoinRoom = () => {
    setOpenJoinDialog(true);
    handleClose();
  };
  
  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
  };
  
  const handleLogOut = () => {
    logout();
    navigate('/auth/login')
  }
  const handleCreateRoomSubmit = async (roomData: RoomFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8080/room/create/', 
        roomData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Room created successfully:', response.data);
      handleCloseDialog();
      await refetch();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating room:', error.response?.data);
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          // Token expired or invalid
          navigate('/auth/login');
        }
      } else {
        console.error('Error creating room:', error);
      }
    }
  };

  if (loading || userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Navigation Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            px: { xs: 2, sm: 3 },
            minHeight: '70px !important',
          }}>
            {/* Left section - Logo and Brand */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 1,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}>
                <img
                  src="/favicon.svg"
                  alt="Flixshare Logo"
                  style={{ height: 28, width: 28 }}
                />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                  letterSpacing: '-0.02em',
                }}
              >
                Flixshare
              </Typography>
            </Box>

            {/* Right section - Actions and Profile */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
            }}>
              {/* Create/Add Button */}
              <IconButton
                onClick={handleAddClick}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  width: 44,
                  height: 44,
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <AddIcon />
              </IconButton>

              {/* User Profile */}
              {!userLoading && user && (
                <IconButton 
                  onClick={handleProfileMenuOpen} 
                  sx={{ 
                    p: 0.5,
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.1)',
                    },
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    {user.username[0]}
                  </Avatar>
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      
        {/* Add Menu */}
        <Menu
          anchorEl={addAnchorEl}
          open={Boolean(addAnchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(16px)',
              mt: 1,
            },
          }}
        >
          <MenuItem 
            onClick={handleJoinRoom}
            sx={{ 
              py: 1.5, px: 3,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Join Room
          </MenuItem>
          <MenuItem 
            onClick={handleCreateRoom}
            sx={{ 
              py: 1.5, px: 3,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Create New Room
          </MenuItem>
        </Menu>
        
        {/* Enhanced Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          sx={{
            '& .MuiPaper-root': {
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(16px)',
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {user?.username}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              user@flixshare.com
            </Typography>
          </Box>
          
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{ 
              py: 1.5,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{ 
              py: 1.5,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <SettingsIcon sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <MenuItem 
            onClick={() => {
              handleLogOut();
              handleProfileMenuClose();
            }}
            sx={{ 
              py: 1.5,
              color: 'error.main',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: 'error.main' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        
        <JoinRoomForm 
          open={openJoinDialog}
          onClose={() => setOpenJoinDialog(false)}
          onJoinSuccess={refetch}
        />
        <CreateRoomForm
          open={openCreateDialog}
          onClose={handleCloseDialog}
          onSubmit={handleCreateRoomSubmit}
        />

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
            {/* Dashboard Header */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Your Rooms
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                Manage your subscription sharing rooms and collaborate with friends
              </Typography>
              
              {/* Quick Stats */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
                      {rooms.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Active Rooms
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Grid of Room Cards */}
            <Container maxWidth="xl" disableGutters>
              <Grid container spacing={3}>
                {rooms.map((room) => (
                  <Grid item key={room.id} xs={12} sm={6} md={4} lg={3}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'visible',
                      }}
                    >
                      {/* Service Badge */}
                      <Box sx={{
                        position: 'absolute',
                        top: -8,
                        right: 16,
                        zIndex: 1,
                      }}>
                        <Chip
                          label={room.service}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </Box>

                      {/* Card Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        p: 3,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
                      }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                        }}>
                          <img
                            src={`services/${room.service.toLowerCase()}.png`}
                            alt={room.service}
                            style={{ width: 24, height: 24 }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ 
                            lineHeight: 1.2,
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 0.5,
                          }}>
                            {room.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {room.role === 'owner' ? '👑 Your Room' : '🤝 Member'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Card Content */}
                      <CardContent sx={{ pt: 3, pb: 2, flexGrow: 1 }}>
                        {/* Owner Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28,
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              mr: 1,
                            }}
                          >
                            {room.role === 'owner' ? '👑' : room.owner_username[0].toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {room.role === 'owner' ? 'Owner: You' : `Owner: ${room.owner_username}`}
                          </Typography>
                        </Box>
                        
                        {/* Stats Row */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {room.member_count}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {room.cost} Ksh
                            </Typography>
                          </Box>
                        </Box>

                        {/* Due Date */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1.5,
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}>
                          <CalendarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Due: {new Date(room.due_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      
                      {/* Card Actions */}
                      <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                        <Button 
                          variant="contained" 
                          size="medium"
                          onClick={() => navigate(`/room/${room.id}`)}
                          sx={{
                            flexGrow: 1,
                            fontWeight: 600,
                          }}
                        >
                          View Details
                        </Button>
                        {room.role === 'owner' && (
                          <IconButton 
                            size="small"
                            sx={{ 
                              ml: 1,
                              color: 'warning.main',
                              '&:hover': {
                                background: 'rgba(245, 158, 11, 0.1)',
                              },
                            }}
                          >
                            <StarIcon fontSize="small" />
                          </IconButton>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Empty State */}
              {rooms.length === 0 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    No rooms yet
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                    Create your first room or join an existing one to get started
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      onClick={handleCreateRoom}
                      sx={{ fontWeight: 600 }}
                    >
                      Create Room
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={handleJoinRoom}
                      sx={{ fontWeight: 600 }}
                    >
                      Join Room
                    </Button>
                  </Box>
                </Box>
              )}
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };
  
  export default FlixshareApp;