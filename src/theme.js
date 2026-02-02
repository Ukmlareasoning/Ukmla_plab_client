import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D5F4C',
      light: '#3d7a64',
      dark: '#1e4035',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E8B849',
      light: '#edc96b',
      dark: '#c2992e',
      contrastText: '#1a1a1a',
    },
    success: {
      main: '#5FB878',
      light: '#8bc99d',
      dark: '#408755',
    },
    background: {
      default: '#F5F7F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#5a5a5a',
    },
    footer: {
      main: '#1A1A1A',
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
  shape: { borderRadius: 8 },
})

export default theme
