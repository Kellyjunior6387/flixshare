import React, { useState } from 'react';
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
    TextField,
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
import roomDetail from './data';

interface InviteDialogProps {
    open: boolean;
    onClose: () => void;
  }
  
  // Invite Dialog Component
  const InviteDialog: React.FC<InviteDialogProps> = ({ open, onClose }) => {
    const [email, setEmail] = useState<string>("");
    
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setEmail(event.target.value);
    };
    
    const handleInvite = (): void => {
      // Handle invite logic
      console.log("Inviting:", email);
      setEmail("");
      onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Send an invitation to join the Netflix Family Plan room. Cost per member: $4.99/month
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleInvite} color="primary" variant="contained" disabled={!email}>
              Send Invitation
            </Button>
          </DialogActions>
        </Dialog>
      );
    };
    
    // Room Detail Page Component
    const RoomDetailPage: React.FC = () => {
      const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);
      
      const handleInviteOpen = (): void => {
        setInviteDialogOpen(true);
      };
      
      const handleInviteClose = (): void => {
        setInviteDialogOpen(false);
      };
      
      const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
        // Could add a snackbar notification here
      };
      
      // Calculate the individual cost per member
      const individualCost = roomDetail.monthlyCost / roomDetail.members.length;
      
      // Get payment status counts
      const paidCount = roomDetail.members.filter(member => member.paymentStatus === 'paid').length;
      const pendingCount = roomDetail.members.filter(member => member.paymentStatus === 'pending').length;
      const overdueCount = roomDetail.members.filter(member => member.paymentStatus === 'overdue').length;
      
      return (
        <Box sx={{ py: 3 }}>
          {/* Back button and room title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton sx={{ mr: 1 }}>
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
                    src={roomDetail.logoUrl} 
                    alt={roomDetail.service}
                    variant="rounded"
                    sx={{ width: 64, height: 64, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>{roomDetail.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{roomDetail.service}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        size="small" 
                        label={`${roomDetail.members.length}/${roomDetail.maxMembers} members`} 
                        sx={{ mr: 1 }}
                      />
                      {roomDetail.isOwner && (
                        <Chip size="small" color="primary" label="You are the owner" />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Typography variant="h6">${roomDetail.monthlyCost.toFixed(2)}/month</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Next billing: {roomDetail.nextBilling}
                  </Typography>
                  {roomDetail.isOwner && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={handleInviteOpen}
                    >
                      Invite Member
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            {/* Description */}
            <Typography variant="body2" sx={{ mt: 2 }}>
              {roomDetail.description}
            </Typography>
            
            {/* Account Info Section (visible only to members) */}
            {roomDetail.accountEmail && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Account Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>Email:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {roomDetail.accountEmail}
                      </Typography>
                      <IconButton size="small" onClick={() => copyToClipboard(roomDetail.accountEmail!)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>Password:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {roomDetail.accountPassword}
                      </Typography>
                      <IconButton size="small" onClick={() => copyToClipboard(roomDetail.accountPassword!)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
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
                    <Typography variant="h5" sx={{ my: 1 }}>${individualCost.toFixed(2)}/mo</Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Members</Typography>
              {roomDetail.isOwner && roomDetail.members.length < roomDetail.maxMembers && (
                <Button 
                  size="small" 
                  startIcon={<PersonAddIcon />}
                  onClick={handleInviteOpen}
                >
                  Add Member
                </Button>
              )}
            </Box>
            
            <List disablePadding>
              {roomDetail.members.map((member) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={member.avatar} alt={member.name} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {member.name}
                          {member.id === roomDetail.owner.id && (
                            <Chip 
                              size="small" 
                              label="Owner" 
                              sx={{ ml: 1, height: 20, fontSize: '0.625rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={member.email}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      {member.paymentStatus === 'paid' ? (
                        <>
                          <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="success.main">Paid</Typography>
                        </>
                      ) : member.paymentStatus === 'pending' ? (
                        <>
                          <WarningIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="warning.main">${member.amountDue.toFixed(2)} Pending</Typography>
                        </>
                      ) : (
                        <>
                          <WarningIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="error.main">${member.amountDue.toFixed(2)} Overdue</Typography>
                        </>
                      )}
                    </Box>
                    {roomDetail.isOwner && member.id !== roomDetail.owner.id && (
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
          <InviteDialog open={inviteDialogOpen} onClose={handleInviteClose} />
        </Box>
      );
    };
    
    export default RoomDetailPage;