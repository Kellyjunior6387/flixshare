import React, { useState } from 'react';
import { 
  //AppBar, 
  //Toolbar, 
  //IconButton, 
  Typography, 
  //InputBase, 
  //Badge, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Menu, 
  MenuItem, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Divider, 
  useMediaQuery,
  Box
} from '@mui/material';
import { 
  //Menu as MenuIcon, 
  //Search as SearchIcon, 
  //Notifications as NotificationsIcon, 
  Dashboard as DashboardIcon, 
  Payment as PaymentIcon, 
  Settings as SettingsIcon,
  //MoreVert as MoreVertIcon,
  ExitToApp as ExitToAppIcon,
  //Add as AddIcon,
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
import AppHeader from '../topBar';


interface NavItem {
    text: string;
    icon: React.ReactNode;
  }
const FlixshareApp: React.FC = () => {
    //State management
    const [mobileOpen, setMobileOpen] = useState(false)
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
    const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
    const [currentPage, setCurrentPage] = useState<string>('Dashboard');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openJoinDialog, setOpenJoinDialog] = useState(false)

    //Hooks
    const { rooms, loading, error, refetch } = useRooms();
    const navigate = useNavigate()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    //Event handlers
    const handleDrawerToggle = (): void => {
      setMobileOpen(!mobileOpen)
    };
    const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
        setAddAnchorEl(event.currentTarget);
      };
    /*
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
      setProfileAnchorEl(event.currentTarget);
    };
    */
    const handleProfileMenuClose = (): void => {
      setProfileAnchorEl(null);
    };
    
    const handleClose = () => {
        setAddAnchorEl(null);
      };
    
    const handlePageChange = (page: string): void => {
      setCurrentPage(page);
      if (isMobile) {
        setMobileOpen(false);
      }
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

  
    // Navigation items
    const navItems: NavItem[] = [
      { text: 'Dashboard', icon: <DashboardIcon /> },
      { text: 'Billing', icon: <PaymentIcon /> },
      { text: 'Settings', icon: <SettingsIcon /> }
    ];
    if (loading) {
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
        <Box sx={{ display: 'flex'}}>
          {/* Top Navigation Bar */}
           <AppHeader  // Add username from your auth context/state
          onCreateClick={handleAddClick}
        />
        

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
            >
              <MenuItem onClick={handleJoinRoom}>Join Room</MenuItem>
              <MenuItem onClick={handleCreateRoom}>Create New Room</MenuItem>
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

              {/* Profile Dropdown Menu */}
              <Menu
                id="profile-menu"
                anchorEl={profileAnchorEl}
                keepMounted
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>Account Settings</MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                  handleLogOut();
                  handleProfileMenuClose();
                }}>
                  <ListItemIcon>
                    <ExitToAppIcon 
                    fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
          
          {/* Left Navigation Drawer */}
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 240,
                marginTop: '64px', // AppBar height
                height: 'calc(100% - 64px)',
                zIndex: (theme) => theme.zIndex.appBar - 1,
                border: 'none',
                bgcolor: 'background.paper',
                boxShadow: 1
              }
            }}
          >
            <List>
              {navItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text} 
                  selected={currentPage === item.text}
                  onClick={() => handlePageChange(item.text)}
                  sx={{
                    my: 0.5,
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'secondary.main',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          
          {/* Main Content Area */}
          <Box
           component="main"
           sx={{
             flexGrow: 1,
             p: 3,
             width: {
               xs: '100%',
               sm: `calc(100% - ${240}px)`
             },
             ml: {
               xs: 0,
               sm: '240px'
             },
             transition: theme.transitions.create(['width', 'margin'], {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.leavingScreen,
             }),
             mt: '64px'
           }}
          >
            {/* Dashboard Content */}
            <Container maxWidth="xl">
              
              {/* Grid of Room Cards */}
              <Grid container spacing={3}>
                {rooms.map((room) => (
                  <Grid item key={room.id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Card Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        p: 2,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                      }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 40, height: 40 }}
                          image={`services/${room.service.toLowerCase()}.png`}
                          alt={room.service}
                        />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                            {room.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {room.service}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Card Content */}
                      <CardContent sx={{ pt: 2, pb: 1, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    
                          <Avatar alt={room.role}  sx={{ width: 24, height: 24 }} />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {room.role === 'owner' ? 'Owner: You' : `Owner: ${room.owner_username}`}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Next billing: {room.due_date}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          {room.member_count} members · {room.cost} Ksh/month
                        </Typography>
                      </CardContent>
                      
                      {/* Card Actions */}
                      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                        <Button 
                          variant="contained" 
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/room/${room.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };
  
  export default FlixshareApp;