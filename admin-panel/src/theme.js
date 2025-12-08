import { createTheme } from '@mui/material/styles';

// Reuse the same design tokens as the storefront
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
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--bg-main': colors.bgMain,
          '--bg-surface': colors.bgSurface,
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
          backgroundImage: 'url(/images/website-background.jpg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.bgSurface,
          borderColor: colors.borderSubtle,
        },
      },
    },
  },
});

export default theme;

