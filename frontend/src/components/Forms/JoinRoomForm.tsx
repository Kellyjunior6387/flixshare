import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/room/join/',
        { room_id: roomId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response)
      setSuccess(true);
      onClose();
      onJoinSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to join room');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Join Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room ID"
            type="text"
            fullWidth
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          Successfully joined room!
        </Alert>
      </Snackbar>
    </>
  );
};

export default JoinRoomForm;