import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  Smartphone as MpesaIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import theme from '../Dashboard/theme';

// Mock data for demonstration
const mockCreditCards = [
  {
    id: 1,
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: 2,
    last4: '5555',
    brand: 'Mastercard',
    expiry: '09/26',
    isDefault: false,
  },
];

const mockTransactions = [
  {
    id: 1,
    amount: 1200,
    description: 'Netflix Subscription',
    date: '2024-01-15',
    status: 'completed',
    method: 'M-Pesa',
  },
  {
    id: 2,
    amount: 800,
    description: 'Spotify Premium',
    date: '2024-01-10',
    status: 'completed',
    method: 'Credit Card',
  },
  {
    id: 3,
    amount: 1500,
    description: 'Disney+ Subscription',
    date: '2024-01-08',
    status: 'pending',
    method: 'M-Pesa',
  },
  {
    id: 4,
    amount: 600,
    description: 'YouTube Premium',
    date: '2024-01-05',
    status: 'failed',
    method: 'Credit Card',
  },
];

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />;
      case 'pending':
        return <PendingIcon sx={{ color: 'warning.main', fontSize: 20 }} />;
      case 'failed':
        return <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />;
      default:
        return <PendingIcon sx={{ color: 'warning.main', fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

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
            {/* Left section - Back button and title */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
            }}>
              <IconButton
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                Billing & Payments
              </Typography>
            </Box>

            {/* Right section - Actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
            }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Add Payment Method
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

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
          <Container maxWidth="xl" disableGutters>
            <Grid container spacing={4}>
              {/* Credit Cards Section */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        mr: 2,
                      }}>
                        <CreditCardIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Credit Cards
                      </Typography>
                    </Box>
                    
                    {mockCreditCards.map((card) => (
                      <Box
                        key={card.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          position: 'relative',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40,
                              background: card.brand === 'Visa' 
                                ? 'linear-gradient(135deg, #1a1f71 0%, #0f4c75 100%)'
                                : 'linear-gradient(135deg, #eb001b 0%, #ff5f00 100%)',
                            }}>
                              <CreditCardIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {card.brand} **** {card.last4}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Expires {card.expiry}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {card.isDefault && (
                              <Chip
                                label="Default"
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                }}
                              />
                            )}
                            <IconButton
                              size="small"
                              onClick={handleMenuOpen}
                              sx={{ color: 'text.secondary' }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      fullWidth
                      sx={{
                        mt: 2,
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        color: '#6366f1',
                        '&:hover': {
                          borderColor: '#6366f1',
                          background: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    >
                      Add New Card
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* M-Pesa Section */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: 'fit-content' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        background: 'linear-gradient(135deg, #00a651 0%, #007a3d 100%)',
                        mr: 2,
                      }}>
                        <MpesaIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        M-Pesa
                      </Typography>
                    </Box>
                    
                    <Box sx={{
                      p: 3,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.05) 0%, rgba(0, 122, 61, 0.02) 100%)',
                      border: '1px solid rgba(0, 166, 81, 0.2)',
                      textAlign: 'center',
                      mb: 3,
                    }}>
                      <MpesaIcon sx={{ fontSize: 48, color: '#00a651', mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Quick M-Pesa Payment
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Pay instantly using your M-Pesa mobile money
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #00a651 0%, #007a3d 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #007a3d 0%, #005a2d 100%)',
                          },
                        }}
                      >
                        Pay with M-Pesa
                      </Button>
                    </Box>

                    <Box sx={{
                      p: 2,
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        How M-Pesa payment works:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        1. Click "Pay with M-Pesa"<br />
                        2. Enter your phone number<br />
                        3. Confirm payment on your phone<br />
                        4. Payment processed instantly
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Transaction History Section */}
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          mr: 2,
                        }}>
                          <HistoryIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Transaction History
                        </Typography>
                      </Box>
                      <Button
                        variant="text"
                        endIcon={<ReceiptIcon />}
                        sx={{ color: 'text.secondary' }}
                      >
                        Export
                      </Button>
                    </Box>

                    <List sx={{ width: '100%' }}>
                      {mockTransactions.map((transaction, index) => (
                        <React.Fragment key={transaction.id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 2,
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '8px',
                              },
                            }}
                          >
                            <ListItemIcon>
                              {getStatusIcon(transaction.status)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {transaction.description}
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    KSh {transaction.amount.toLocaleString()}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      • {transaction.method}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={transaction.status}
                                    size="small"
                                    color={getStatusColor(transaction.status) as 'success' | 'warning' | 'error'}
                                    sx={{ textTransform: 'capitalize' }}
                                  />
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < mockTransactions.length - 1 && (
                            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Card Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          sx={{
            '& .MuiPaper-root': {
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(16px)',
            },
          }}
        >
          <MenuItem 
            onClick={handleMenuClose}
            sx={{ 
              py: 1.5,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Set as Default
          </MenuItem>
          <MenuItem 
            onClick={handleMenuClose}
            sx={{ 
              py: 1.5,
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            Edit Card
          </MenuItem>
          <MenuItem 
            onClick={handleMenuClose}
            sx={{ 
              py: 1.5,
              color: 'error.main',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Remove Card
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default BillingPage;