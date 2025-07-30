import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Auth/tokenManager';
import { useAuth } from '../../utils/auth';

interface TopBarProps {
  showAddButton?: boolean;
  onAddClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const TopBar: React.FC<TopBarProps> = ({ showAddButton = true, onAddClick }) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setProfileAnchorEl(null);
  };

  const handleLogOut = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <>
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
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
          >
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
            {showAddButton && (
              <IconButton
                onClick={onAddClick}
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
            )}

            {/* User Profile */}
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
                {userLoading ? '...' : (user?.username?.[0] || 'U')}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
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
          onClick={() => {
            navigate('/billing');
            handleProfileMenuClose();
          }}
          sx={{ 
            py: 1.5,
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          <ListItemIcon>
            <PaymentIcon sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          Billing & Payments
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
    </>
  );
};

export default TopBar;