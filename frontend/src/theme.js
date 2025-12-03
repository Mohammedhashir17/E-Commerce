import { createTheme } from '@mui/material/styles';

// Shared dark theme tokens
export const colors = {
  bgMain: '#050509', // --bg-main
  bgSurface: '#0D0D16', // --bg-surface
  accentPurple: '#6C2BD9', // --accent-purple
  accentPurpleSoft: '#8B5CF6', // --accent-purple-soft
  chipPurple: '#24103A', // --chip-purple
  textPrimary: '#FFFFFF', // --text-primary
  textMuted: '#B3B3C2', // --text-muted
  borderSubtle: '#262638', // --border-subtle
};

// Global dark premium theme using the shared tokens
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.accentPurple,
      light: colors.accentPurpleSoft,
      dark: '#4A148C',
      contrastText: colors.textPrimary,
    },
    secondary: {
      main: colors.bgSurface,
      light: '#151525',
      dark: colors.bgMain,
      contrastText: colors.textPrimary,
    },
    background: {
      default: colors.bgMain,
      paper: colors.bgSurface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textMuted,
    },
    divider: colors.borderSubtle,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: colors.textPrimary },
    h2: { fontWeight: 700, color: colors.textPrimary },
    h3: { fontWeight: 600, color: colors.textPrimary },
    h4: { fontWeight: 600, color: colors.textPrimary },
    h5: { fontWeight: 600, color: colors.textPrimary },
    h6: { fontWeight: 600, color: colors.textPrimary },
    body1: { color: colors.textPrimary },
    body2: { color: colors.textMuted },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--bg-main': colors.bgMain,
          '--bg-surface': colors.bgSurface,
          '--layout-chrome-bg': colors.bgSurface,
          '--accent-purple': colors.accentPurple,
          '--accent-purple-soft': colors.accentPurpleSoft,
          '--chip-purple': colors.chipPurple,
          '--text-primary': colors.textPrimary,
          '--text-muted': colors.textMuted,
          '--border-subtle': colors.borderSubtle,
        },
        body: {
          backgroundColor: colors.bgMain,
          color: colors.textPrimary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: colors.accentPurple,
          color: colors.textPrimary,
          '&:hover': {
            backgroundColor: colors.accentPurpleSoft,
          },
        },
        outlinedPrimary: {
          borderColor: colors.accentPurple,
          color: colors.textPrimary,
          '&:hover': {
            borderColor: colors.accentPurpleSoft,
            backgroundColor: 'rgba(108, 43, 217, 0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: colors.bgSurface,
          border: `1px solid ${colors.borderSubtle}`,
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.75)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: colors.bgSurface,
          borderBottom: `1px solid ${colors.borderSubtle}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.bgSurface,
          borderColor: colors.borderSubtle,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: colors.bgSurface,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.borderSubtle,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.accentPurple,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.accentPurpleSoft,
          },
        },
      },
    },
  },
});

export default theme;

