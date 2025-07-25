import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Movie as MovieIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
} from '@mui/icons-material';

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

const serviceOptions = [
  { value: 'netflix', label: 'Netflix', icon: '🎬', color: '#E50914' },
  { value: 'disney+', label: 'Disney+', icon: '🏰', color: '#113CCF' },
  { value: 'spotify', label: 'Spotify', icon: '🎵', color: '#1DB954' },
  { value: 'hbomax', label: 'HBO Max', icon: '🎭', color: '#673AB7' },
  { value: 'appletv', label: 'Apple TV+', icon: '🍎', color: '#000000' },
  { value: 'youtube', label: 'YouTube Premium', icon: '📺', color: '#FF0000' },
];

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    service_type: '',
    due_date: '',
    cost: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      service_type: service
    }));
    if (errors.service_type) {
      setErrors(prev => ({ ...prev, service_type: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = 'Room name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.service_type) newErrors.service_type = 'Service type is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    if (!formData.cost || Number(formData.cost) <= 0) newErrors.cost = 'Valid cost is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: '',
        description: '',
        service_type: '',
        due_date: '',
        cost: '',
      });
      setErrors({});
    }
  };

  const selectedService = serviceOptions.find(service => service.value === formData.service_type);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
          maxHeight: '90vh',
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
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}>
            Create New Room
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Set up a new subscription sharing room for your friends
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Room Name */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              color: 'text.primary', 
              fontWeight: 600, 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <TitleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              Room Name
            </Typography>
            <TextField
              name="name"
              placeholder="e.g., Netflix Squad, Disney+ Family"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                },
              }}
            />
          </Box>

          {/* Service Selection */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              color: 'text.primary', 
              fontWeight: 600, 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <MovieIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              Streaming Service
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {serviceOptions.map((service) => (
                <Chip
                  key={service.value}
                  label={`${service.icon} ${service.label}`}
                  variant={formData.service_type === service.value ? 'filled' : 'outlined'}
                  onClick={() => handleServiceChange(service.value)}
                  sx={{
                    height: 40,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    ...(formData.service_type === service.value && {
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      border: 'none',
                    }),
                    '&:hover': {
                      background: formData.service_type === service.value 
                        ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                        : 'rgba(99, 102, 241, 0.1)',
                    },
                  }}
                />
              ))}
            </Box>
            {errors.service_type && (
              <Typography variant="caption" sx={{ color: 'error.main', ml: 1 }}>
                {errors.service_type}
              </Typography>
            )}
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              color: 'text.primary', 
              fontWeight: 600, 
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <DescriptionIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              Description
            </Typography>
            <TextField
              name="description"
              placeholder="Describe your room and any rules..."
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Date and Cost Row */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            {/* Due Date */}
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <Typography variant="subtitle1" sx={{ 
                color: 'text.primary', 
                fontWeight: 600, 
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <CalendarIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                Next Billing Date
              </Typography>
              <TextField
                name="due_date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.due_date}
                onChange={handleInputChange}
                error={!!errors.due_date}
                helperText={errors.due_date}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                  },
                }}
              />
            </Box>

            {/* Monthly Cost */}
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <Typography variant="subtitle1" sx={{ 
                color: 'text.primary', 
                fontWeight: 600, 
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <MoneyIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                Monthly Cost
              </Typography>
              <TextField
                name="cost"
                type="number"
                fullWidth
                placeholder="1500"
                value={formData.cost}
                onChange={handleInputChange}
                error={!!errors.cost}
                helperText={errors.cost}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Ksh
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Preview */}
          {selectedService && formData.name && (
            <Box sx={{
              p: 3,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>
                Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {selectedService.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formData.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {selectedService.label} • {formData.cost && `Ksh ${formData.cost}/month`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button 
          onClick={onClose} 
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
          disabled={!formData.name || !formData.service_type}
          sx={{ 
            minWidth: 160,
            fontWeight: 600,
          }}
        >
          Create Room
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomForm;