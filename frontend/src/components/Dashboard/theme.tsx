import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6', // Purple accent
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#0f0f23', // Deep dark blue
      paper: '#1a1a2e', // Slightly lighter dark
    },
    surface: {
      main: '#16213e', // Card surface color
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: '#334155',
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          minHeight: '100vh',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1a2e',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#334155',
            borderRadius: '4px',
            '&:hover': {
              background: '#475569',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(99, 102, 241, 0.5)',
          color: '#6366f1',
          '&:hover': {
            borderColor: '#6366f1',
            background: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 15, 35, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: '260px',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 12px',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
            },
          },
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: '12px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.1)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

// Add custom color to theme
declare module '@mui/material/styles' {
  interface Palette {
    surface: Palette['primary'];
  }

  interface PaletteOptions {
    surface?: PaletteOptions['primary'];
  }
}

export default theme;  