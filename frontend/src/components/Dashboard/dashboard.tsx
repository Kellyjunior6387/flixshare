import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  //InputBase, 
  Badge, 
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
  Menu as MenuIcon, 
  //Search as SearchIcon, 
  Notifications as NotificationsIcon, 
  Dashboard as DashboardIcon, 
  Group as GroupIcon, 
  Payment as PaymentIcon, 
  Settings as SettingsIcon,
  //MoreVert as MoreVertIcon,
  ExitToApp as ExitToAppIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import roomsData from './data';
import CreateRoomForm, { RoomFormData } from '../Forms/CreateRoomForm';
import axios from 'axios'
import {logout} from '../Auth/tokenManager'
import { useNavigate } from 'react-router-dom';


interface NavItem {
    text: string;
    icon: React.ReactNode;
  }
const FlixshareApp: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
    const [addAnchorEl, setAddAnchorEl] = useState<null | HTMLElement>(null);
    const [currentPage, setCurrentPage] = useState<string>('Dashboard');
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const navigate = useNavigate()
    
    const handleDrawerToggle = (): void => {
      setDrawerOpen(!drawerOpen);
    };

    const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
        setAddAnchorEl(event.currentTarget);
      };
    
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
      setProfileAnchorEl(event.currentTarget);
    };
    
    const handleProfileMenuClose = (): void => {
      setProfileAnchorEl(null);
    };
    
    const handleClose = () => {
        setAddAnchorEl(null);
      };
    
    const handlePageChange = (page: string): void => {
      setCurrentPage(page);
      if (isMobile) {
        setDrawerOpen(false);
      }
    };
    const handleCreateRoom = () => {
      setOpenCreateDialog(true);
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
      console.log('New Room:', roomData);
      try {
        const response = await axios.post('http://127.0.0.1:8080/room/create/', roomData);
        console.log('Room created successfully:', response.data);
        handleCloseDialog();
        // Optionally, refresh the rooms list or show a success message
      } catch (error) {
        console.error('Error creating room:', error);
        // Optionally, show an error message to the user
      }
    };
  
    // Navigation items
    const navItems: NavItem[] = [
      { text: 'Dashboard', icon: <DashboardIcon /> },
      { text: 'My Rooms', icon: <GroupIcon /> },
      { text: 'Billing', icon: <PaymentIcon /> },
      { text: 'Settings', icon: <SettingsIcon /> }
    ];
  
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Top Navigation Bar */}
          <AppBar position="fixed" color="default" elevation={1}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500, color: 'primary.main' }}>
                Flixshare
              </Typography>
              
              <Box sx={{ flexGrow: 1 }} />

                {/* Add Room Button */}
            <IconButton
              color="primary"
              aria-label="add room"
              onClick={handleAddClick}
              sx={{ ml: 2 }}
            >
              <AddIcon />
            </IconButton>
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
              <MenuItem>Join Room</MenuItem>
              <MenuItem onClick={handleCreateRoom}>Create New Room</MenuItem>
            </Menu>
            <CreateRoomForm
                  open={openCreateDialog}
                  onClose={handleCloseDialog}
                  onSubmit={handleCreateRoomSubmit}
             />

              {/* Notification Icon */}
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              {/* Profile Avatar */}
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar alt="User Profile" src="/api/placeholder/40/40" sx={{ width: 32, height: 32 }} />
              </IconButton>
              
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
            </Toolbar>
          </AppBar>
          
          {/* Left Navigation Drawer */}
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={drawerOpen}
            onClose={handleDrawerToggle}
            sx={{
              '& .MuiDrawer-paper': {
                marginTop: '64px', // AppBar height
                height: 'calc(100% - 64px)',
                zIndex: theme.zIndex.appBar - 1,
                width: '240px'
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
              width: { sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
              ml: { sm: isMobile ? 0 : '240px' },
              mt: '64px' // AppBar height
            }}
          >
            {/* Dashboard Content */}
            <Container maxWidth="xl">
              <Typography variant="h5" sx={{ mb: 3, mt: 1, fontWeight: 500 }}>
                {currentPage}
              </Typography>
              
              {/* Grid of Room Cards */}
              <Grid container spacing={3}>
                {roomsData.map((room) => (
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
                          image={room.logoUrl}
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
                          <Avatar alt={room.owner} src={room.ownerAvatar} sx={{ width: 24, height: 24 }} />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {room.owner === 'You' ? 'You (Owner)' : `Owner: ${room.owner}`}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Next billing: {room.nextBilling}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          {room.memberCount} members · ${room.monthlyCost}/month
                        </Typography>
                      </CardContent>
                      
                      {/* Card Actions */}
                      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="primary"
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          color="primary"
                        >
                          {room.isOwner ? 'Manage' : 'Join'}
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