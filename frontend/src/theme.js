import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#835DC2',
      light: '#A78BFA',
      dark: '#6D28D9',
    },
    secondary: {
      main: '#F4F2FF',
      light: '#F9F7FF',
      dark: '#E9E5FF',
    },
    accent: {
      main: '#DDD6FE',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9FAFB',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(131, 93, 194, 0.1)',
        },
      },
    },
  },
});

export default theme;

