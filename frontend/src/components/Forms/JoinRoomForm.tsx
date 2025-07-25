import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  MeetingRoom as MeetingRoomIcon,
  ContentCopy as ContentCopyIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface JoinRoomFormProps {
  open: boolean;
  onClose: () => void;
  onJoinSuccess: () => void;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ open, onClose, onJoinSuccess }) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError('Please enter a valid room ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/room/join/',
        { room_id: roomId.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response);
      setSuccess(true);
      setRoomId('');
      onClose();
      onJoinSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to join room');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRoomId(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClose = () => {
    setRoomId('');
    setError(null);
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(16px)',
          }
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          pb: 0,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            }}>
              <MeetingRoomIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
              }}>
                Join Room
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter a room ID to join an existing subscription room
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Room ID Input */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ 
                color: 'text.primary', 
                fontWeight: 600, 
                mb: 2,
              }}>
                Room ID
              </Typography>
              <TextField
                autoFocus
                placeholder="Enter room ID (e.g., ABC123XYZ)"
                type="text"
                fullWidth
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  if (error) setError(null);
                }}
                error={!!error}
                helperText={error}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePaste}
                        edge="end"
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                    fontSize: '1.1rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  },
                }}
              />
            </Box>

            {/* Info Box */}
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '16px',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <QrCodeIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    How to find a Room ID
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    • Ask the room owner to share the room ID with you<br/>
                    • Room IDs are typically 6-12 character codes<br/>
                    • Make sure you're invited to join the room
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              minWidth: 120,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!roomId.trim() || loading}
            sx={{ 
              minWidth: 140,
              fontWeight: 600,
            }}
          >
            {loading ? 'Joining...' : 'Join Room'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success"
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          Successfully joined room!
        </Alert>
      </Snackbar>
    </>
  );
};

export default JoinRoomForm;