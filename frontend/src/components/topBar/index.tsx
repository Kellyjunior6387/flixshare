import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Auth/tokenManager';
import { useAuth } from './getData';

interface AppHeaderProps {
  onCreateClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onCreateClick }) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const {user, loading} = useAuth()

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogOut = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/favicon.svg"
            alt="Flixshare Logo"
            style={{ height: 32, marginRight: 16 }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500, 
              color: 'primary.main',
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            Flixshare
          </Typography>
        </Box>

        {/* Right section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="primary"
            onClick={onCreateClick}
          >
            <AddIcon />
          </IconButton>

          {!loading && user && (
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  textTransform: 'uppercase'
                }}
              >
                {user.username[0]}
              </Avatar>
            </IconButton>
          )}
        </Box>
        

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Account Settings</MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => {
              handleLogOut();
              handleProfileMenuClose();
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;