import React, { useState, useEffect } from 'react';
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
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  Smartphone as MpesaIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../Dashboard/theme';
import TopBar from '../Dashboard/TopBar';
import { useRooms } from '../Dashboard/data';
import { useAuth } from '../../utils/auth';
import { paymentService, Transaction, MpesaPaymentRequest } from '../../services/paymentService';

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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get rooms and user data
  const { rooms, loading: roomsLoading } = useRooms();
  const { user, loading: userLoading } = useAuth();

  // Mock data for demo when API is not available
  const mockRooms = [
    {
      id: '1',
      name: 'Family Netflix',
      service: 'Netflix',
      description: 'Netflix premium family plan',
      cost: 1200,
      due_date: '2024-02-15',
      created_at: '2024-01-15',
      role: 'member',
      payment_status: 'pending',
      member_count: 4,
      owner_username: 'john_doe',
    },
    {
      id: '2', 
      name: 'Spotify Premium Group',
      service: 'Spotify',
      description: 'Spotify premium for friends',
      cost: 800,
      due_date: '2024-02-10',
      created_at: '2024-01-10',
      role: 'member',
      payment_status: 'active',
      member_count: 6,
      owner_username: 'jane_smith',
    },
    {
      id: '3',
      name: 'My YouTube Premium',
      service: 'YouTube',
      description: 'YouTube premium family',
      cost: 600,
      due_date: '2024-02-20',
      created_at: '2024-01-20',
      role: 'owner',
      payment_status: 'active',
      member_count: 3,
      owner_username: 'current_user', // This would be the current user
    },
  ];

  // Use mock data when API is not available, otherwise use real data
  const effectiveRooms = rooms.length > 0 ? rooms : mockRooms;
  const effectiveRoomsLoading = roomsLoading && rooms.length === 0 ? false : roomsLoading;
  const effectiveUserLoading = userLoading && !user ? false : userLoading;

  // Filter rooms where user is a member (not owner)
  const payableRooms = effectiveRooms.filter(room => 
    room.role === 'member'
  );

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const data = await paymentService.getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions');
      // Keep using mock data if API fails
      setTransactions(mockTransactions as Transaction[]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleAddClick = () => {
    // Add payment method functionality
    console.log('Add payment method clicked');
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handlePayWithMpesa = () => {
    setPaymentFormOpen(true);
  };

  const handleClosePaymentForm = () => {
    setPaymentFormOpen(false);
    setSelectedRoom('');
    setPaymentState('idle');
  };

  const handleProcessPayment = async () => {
    if (!selectedRoom || !phoneNumber.trim()) return;

    setPaymentState('processing');

    try {
      const roomDetails = getSelectedRoomDetails();
      if (!roomDetails) {
        throw new Error('Room details not found');
      }

      const paymentRequest: MpesaPaymentRequest = {
        phone_number: phoneNumber,
        amount: Math.round(roomDetails.cost / roomDetails.member_count),
        room: selectedRoom
      };

      const response = await paymentService.initiatePayment(paymentRequest);
      
      if (response.success) {
        setPaymentState('success');
        // Reload transactions to show the new pending payment
        loadTransactions();
        setTimeout(() => {
          handleClosePaymentForm();
        }, 3000); // Close after 3 seconds on success
      } else {
        setPaymentState('failed');
        setTimeout(() => {
          setPaymentState('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentState('failed');
      setTimeout(() => {
        setPaymentState('idle');
      }, 5000); // Reset to idle after 5 seconds on failure
    }
  };

  const getSelectedRoomDetails = () => {
    return effectiveRooms.find(room => room.id === selectedRoom);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
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
      case 'successful':
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
        <TopBar showAddButton={true} onAddClick={handleAddClick} />

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
            {/* Page Title */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  mb: 1,
                }}
              >
                Billing & Payments
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Manage your payment methods and view transaction history
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Credit Cards Section */}
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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

                    {/* Phone Number Input */}
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        placeholder="Enter your M-Pesa phone number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#00a651',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#00a651',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#00a651',
                          },
                        }}
                      />
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
                        disabled={!phoneNumber.trim()}
                        onClick={handlePayWithMpesa}
                        sx={{
                          background: phoneNumber.trim() 
                            ? 'linear-gradient(135deg, #00a651 0%, #007a3d 100%)'
                            : 'rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            background: phoneNumber.trim() 
                              ? 'linear-gradient(135deg, #007a3d 0%, #005a2d 100%)'
                              : 'rgba(255, 255, 255, 0.1)',
                          },
                          '&:disabled': {
                            color: 'rgba(255, 255, 255, 0.3)',
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
                        1. Enter your phone number above<br />
                        2. Click "Pay with M-Pesa"<br />
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
                        onClick={loadTransactions}
                      >
                        Refresh
                      </Button>
                    </Box>

                    {error && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {error}. Showing cached data.
                      </Alert>
                    )}

                    <List sx={{ width: '100%' }}>
                      {transactionsLoading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <CircularProgress />
                          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                            Loading transactions...
                          </Typography>
                        </Box>
                      ) : transactions.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No transactions found
                          </Typography>
                        </Box>
                      ) : (
                        transactions.map((transaction, index) => (
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
                                      {transaction.description || `Payment to ${transaction.phone_number}`}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      KSh {Number(transaction.amount).toLocaleString()}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {new Date(transaction.timestamp).toLocaleDateString()}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        • M-Pesa
                                      </Typography>
                                      {transaction.MpesaReceiptNumber && transaction.MpesaReceiptNumber !== 'N/A' && (
                                        <>
                                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            • {transaction.MpesaReceiptNumber}
                                          </Typography>
                                        </>
                                      )}
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
                            {index < transactions.length - 1 && (
                              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* M-Pesa Payment Form Dialog */}
        <Dialog
          open={paymentFormOpen}
          onClose={handleClosePaymentForm}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(16px)',
            },
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 1,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #00a651 0%, #007a3d 100%)',
                mr: 2,
                width: 32,
                height: 32,
              }}>
                <MpesaIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                M-Pesa Payment
              </Typography>
            </Box>
            <IconButton 
              onClick={handleClosePaymentForm}
              sx={{ color: 'text.secondary' }}
              disabled={paymentState === 'processing'}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            {paymentState === 'processing' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#00a651', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Processing Payment...
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Please complete the payment on your phone
                </Typography>
              </Box>
            )}

            {paymentState === 'success' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'success.main' }}>
                  Payment Successful!
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Your payment has been processed successfully
                </Typography>
              </Box>
            )}

            {paymentState === 'failed' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CancelIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'error.main' }}>
                  Payment Failed
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Payment timed out or was declined
                </Typography>
                <Alert severity="error" sx={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}>
                  Please try again or contact support if the problem persists
                </Alert>
              </Box>
            )}

            {paymentState === 'idle' && (
              <>
                {effectiveRoomsLoading || effectiveUserLoading ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#00a651' }} />
                  </Box>
                ) : payableRooms.length === 0 ? (
                  <Alert severity="info" sx={{ 
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}>
                    No rooms available for payment. You can only pay for rooms you're a member of, not rooms you own.
                  </Alert>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      Select the room you want to make a payment for:
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel sx={{ 
                        '&.Mui-focused': { color: '#00a651' },
                      }}>
                        Select Room
                      </InputLabel>
                      <Select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        label="Select Room"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: '12px',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00a651',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00a651',
                          },
                        }}
                      >
                        {payableRooms.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {room.name} ({room.service})
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                KSh {(room.cost / room.member_count).toLocaleString()} per person • {room.member_count} members
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {selectedRoom && (
                      <Card sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.05) 0%, rgba(0, 122, 61, 0.02) 100%)',
                        border: '1px solid rgba(0, 166, 81, 0.2)',
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Payment Details
                          </Typography>
                          {(() => {
                            const roomDetails = getSelectedRoomDetails();
                            return roomDetails ? (
                              <>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                  Room: {roomDetails.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                  Service: {roomDetails.service}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                  Amount: KSh {(roomDetails.cost / roomDetails.member_count).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Phone: {phoneNumber}
                                </Typography>
                              </>
                            ) : null;
                          })()}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </DialogContent>

          {paymentState === 'idle' && !effectiveRoomsLoading && !effectiveUserLoading && payableRooms.length > 0 && (
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={handleClosePaymentForm}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleProcessPayment}
                disabled={!selectedRoom || !phoneNumber.trim()}
                sx={{
                  background: selectedRoom && phoneNumber.trim()
                    ? 'linear-gradient(135deg, #00a651 0%, #007a3d 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: selectedRoom && phoneNumber.trim()
                      ? 'linear-gradient(135deg, #007a3d 0%, #005a2d 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:disabled': {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Pay KSh {selectedRoom ? (() => {
                  const roomDetails = getSelectedRoomDetails();
                  return roomDetails ? Math.round(roomDetails.cost / roomDetails.member_count).toLocaleString() : '0';
                })() : '0'}
              </Button>
            </DialogActions>
          )}
        </Dialog>

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