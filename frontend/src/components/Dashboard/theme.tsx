import {createTheme } from '@mui/material/styles';
const theme = createTheme({
    palette: {
      primary: {
        main: '#1967d2', // Google Classroom primary blue
      },
      secondary: {
        main: '#e8f0fe', // Light blue background
      },
      background: {
        default: '#f5f5f5', // Light gray background
      },
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 10px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)',
            }
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            width: '240px'
          }
        }
      }
    }
  });
export default theme;  