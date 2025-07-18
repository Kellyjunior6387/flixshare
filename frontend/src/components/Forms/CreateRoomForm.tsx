import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';

interface CreateRoomFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData) => void;
}

export interface RoomFormData {
  name: string;
  description: string;
  service_type: string;
  due_date: string;
  cost: string;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    service_type: '',
    due_date: '',
    cost: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      service_type: e.target.value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      service_type: '',
      due_date: '',
      cost: '',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Room</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Please fill in the details for your new subscription sharing room.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Room Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Service Type</InputLabel>
          <Select
            value={formData.service_type}
            label="Service Type"
            onChange={handleServiceChange}
          >
            <MenuItem value="netflix">Netflix</MenuItem>
            <MenuItem value="disney+">Disney+</MenuItem>
            <MenuItem value="spotify">Spotify</MenuItem>
            <MenuItem value="hbomax">HBO Max</MenuItem>
            <MenuItem value="appletv">Apple TV+</MenuItem>
            <MenuItem value="youtube">YouTube Premium</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="due_date"
          label="Due Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.due_date}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="cost"
          label="Monthly Cost (Ksh)"
          type="number"
          fullWidth
          value={formData.cost}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">Ksh</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create Room
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomForm;