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
  CircularProgress,
  Alert,
  //InputAdornment
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  PersonAdd as PersonAddIcon,

  //Person as PersonIcon
} from '@mui/icons-material';
import { RoomDetailData } from './types';
import axios from 'axios';

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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

  // Payment status counts
  const paidCount = room?.members.filter(member => member.payment_status === 'paid').length || 0;
  const pendingCount = room?.members.filter(member => member.payment_status === 'pending').length || 0;
  const overdueCount = room?.members.filter(member => member.payment_status === 'overdue').length || 0;

  // Individual cost calculation
  const individualCost = room ? parseFloat(room.cost) / room.member_count : 0;

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!room) return null;

  return (
    <Box sx={{ py: 3 }}>
      {/* Back button and room title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton sx={{ mr: 1 }} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Room Details
        </Typography>
      </Box>

      {/* Room Header */}
      <Paper sx={{ mb: 3, p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={`/services/${room.service.toLowerCase()}.png`}
                alt={room.service}
                variant="rounded"
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>{room.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{room.service}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    size="small" 
                    label={`${room.member_count} members`} 
                    sx={{ mr: 1 }}
                  />
                  {room.user_role === 'owner' && (
                    <Chip size="small" color="primary" label="You are the owner" />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Typography variant="h6">{room.cost} Ksh/month</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Next billing: {new Date(room.due_date).toLocaleDateString()}
              </Typography>
              {room.user_role === 'owner' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setInviteDialogOpen(true)}
                >
                  Invite Member
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Description */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          {room.description}
        </Typography>

        {/* Account Info Section */}
        {room.account_email && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Account Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Email:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {room.account_email}
                  </Typography>
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(room.account_email!)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
              {room.account_password && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Password:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {room.account_password}
                    </Typography>
                    <IconButton size="small" onClick={() => navigator.clipboard.writeText(room.account_password!)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Payment Summary */}
      <Paper sx={{ mb: 3, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Payment Summary</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="primary" variant="subtitle2">Individual Cost</Typography>
                <Typography variant="h5" sx={{ my: 1 }}>{individualCost.toFixed(2)} Ksh/mo</Typography>
                <Typography variant="body2" color="text.secondary">
                  Per member cost
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="primary" variant="subtitle2">Payment Status</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h5" color="success.main">{paidCount}</Typography>
                    <Typography variant="body2">Paid</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h5" color="warning.main">{pendingCount}</Typography>
                    <Typography variant="body2">Pending</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h5" color="error.main">{overdueCount}</Typography>
                    <Typography variant="body2">Overdue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Members List */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <List disablePadding>
          {room.members.map((member, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{member.username[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {member.username}
                      {member.role === 'owner' && (
                        <Chip 
                          size="small" 
                          label="Owner" 
                          sx={{ ml: 1, height: 20, fontSize: '0.625rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={new Date(member.joined_at).toLocaleDateString()}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  {member.payment_status === 'paid' ? (
                    <>
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="success.main">Paid</Typography>
                    </>
                  ) : member.payment_status === 'pending' ? (
                    <>
                      <WarningIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="warning.main">Pending</Typography>
                    </>
                  ) : (
                    <>
                      <WarningIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="error.main">Overdue</Typography>
                    </>
                  )}
                </Box>
                {room.user_role === 'owner' && member.role !== 'owner' && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="more options">
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} />
    </Box>
  );
};

export default RoomDetail;