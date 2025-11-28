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
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;

