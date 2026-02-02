import { createTheme, alpha } from '@mui/material/styles'

// Modern 2024+ palette: teal primary, warm accent, slate neutrals
const primaryMain = '#0D9488'   // teal-600 – professional, trustworthy
const secondaryMain = '#F59E0B' // amber-500 – accent
const successMain = '#10B981'   // emerald-500
const footerMain = '#0F172A'   // slate-900 – deep modern dark

const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      light: '#14B8A6',
      dark: '#0F766E',
      contrastText: '#fff',
      lightBg: alpha(primaryMain, 0.04),
      hoverBg: alpha(primaryMain, 0.08),
    },
    secondary: {
      main: secondaryMain,
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#0F172A',
      lightBg: alpha(secondaryMain, 0.04),
    },
    success: {
      main: successMain,
      light: '#34D399',
      dark: '#059669',
      lightBg: alpha(successMain, 0.04),
      tint: alpha(successMain, 0.1),
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    footer: {
      main: footerMain,
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.9375rem' },
    h6: { fontSize: '1.125rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem' },
    subtitle2: { fontSize: '0.9375rem', fontWeight: 600 },
    button: { fontSize: '1rem', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})

export default theme
