import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import Header from '../components/Header'
import Footer from '../components/Footer'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes scaleIn': {
    '0%': { opacity: 0, transform: 'scale(0.98)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
}

const inputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
  },
})

// Links: no underline, subtle hover (color + scale)
const linkSx = (theme) => ({
  textDecoration: 'none',
  fontWeight: 600,
  transition: 'color 0.2s ease, transform 0.2s ease',
  '&:hover': {
    textDecoration: 'none',
    color: theme.palette.primary.dark,
    transform: 'translateY(-1px)',
  },
})

function SignIn() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleModeChange = (newMode) => setMode(newMode)

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    // Placeholder: wire to auth API
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    // Placeholder: wire to auth API
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 4, sm: 5, md: 6 },
          px: 2,
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2 } }}>
          <Paper
            elevation={0}
            sx={{
              ...keyframes,
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.grey[300], 0.6),
              bgcolor: 'background.paper',
              boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
              animation: 'scaleIn 0.5s ease-out forwards',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                opacity: 0.8,
              },
            }}
          >
            {/* Section title */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <PersonOutlineRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome back
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Sign in or create an account to continue
              </Typography>
            </Box>

            {/* Toggle: Login | Register — pill-style segmented control */}
            <Box
              role="tablist"
              aria-label="Login or Register"
              sx={{
                display: 'flex',
                gap: 0,
                p: 0.75,
                mb: 3,
                borderRadius: 3,
                bgcolor: theme.palette.grey[100],
                border: '1px solid',
                borderColor: alpha(theme.palette.grey[400], 0.4),
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <Box
                component="button"
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                aria-label="Login"
                onClick={() => handleModeChange('login')}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  py: 1.25,
                  px: 2,
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: mode === 'login' ? '#fff' : theme.palette.text.secondary,
                  background: mode === 'login'
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    : 'transparent',
                  boxShadow: mode === 'login' ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: mode === 'login' ? '#fff' : theme.palette.primary.main,
                    background: mode === 'login'
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                      : alpha(theme.palette.primary.main, 0.08),
                    boxShadow: mode === 'login' ? `0 3px 12px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
                  },
                  '& svg': { color: 'inherit' },
                }}
              >
                <LoginIcon sx={{ fontSize: 20 }} />
                Login
              </Box>
              <Box
                component="button"
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                aria-label="Register"
                onClick={() => handleModeChange('register')}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  py: 1.25,
                  px: 2,
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: mode === 'register' ? '#fff' : theme.palette.text.secondary,
                  background: mode === 'register'
                    ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                    : 'transparent',
                  boxShadow: mode === 'register' ? `0 2px 8px ${alpha(theme.palette.success.main, 0.35)}` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: mode === 'register' ? '#fff' : theme.palette.success.main,
                    background: mode === 'register'
                      ? `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
                      : alpha(theme.palette.success.main, 0.08),
                    boxShadow: mode === 'register' ? `0 3px 12px ${alpha(theme.palette.success.main, 0.4)}` : 'none',
                  },
                  '& svg': { color: 'inherit' },
                }}
              >
                <PersonAddOutlinedIcon sx={{ fontSize: 20 }} />
                Register
              </Box>
            </Box>

            {/* Login form */}
            {mode === 'login' && (
              <Box
                component="form"
                onSubmit={handleLoginSubmit}
                sx={{ animation: 'fadeInUp 0.35s ease-out' }}
              >
                <TextField
                  fullWidth
                  required
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ ...inputSx(theme), mb: 2 }}
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ ...inputSx(theme), mb: 2 }}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      color="primary"
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        '&.Mui-checked': { color: theme.palette.primary.main },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      }}
                    >
                      {isMobile ? (
                        <>
                          I agree to{' '}
                          <Link component={RouterLink} to="/terms-of-service" color="primary" sx={linkSx(theme)}>Terms</Link>
                          {' & '}
                          <Link component={RouterLink} to="/privacy-policy" color="primary" sx={linkSx(theme)}>Privacy</Link>
                        </>
                      ) : (
                        <>
                          I agree to the{' '}
                          <Link component={RouterLink} to="/terms-of-service" color="primary" sx={linkSx(theme)}>
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link component={RouterLink} to="/privacy-policy" color="primary" sx={linkSx(theme)}>
                            Privacy Policy
                          </Link>
                        </>
                      )}
                    </Typography>
                  }
                  sx={{ mb: 2, alignItems: 'center', mr: 0, '& .MuiFormControlLabel-label': { mt: 0 } }}
                />
                <Box sx={{ textAlign: 'right', mb: 2 }}>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ color: 'primary.main', ...linkSx(theme) }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!termsAccepted}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    background: termsAccepted
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                      : undefined,
                    boxShadow: termsAccepted ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
                    '&:hover': termsAccepted ? {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                    } : {},
                  }}
                >
                  Sign in
                </Button>
              </Box>
            )}

            {/* Register form */}
            {mode === 'register' && (
              <Box
                component="form"
                onSubmit={handleRegisterSubmit}
                sx={{ animation: 'fadeInUp 0.35s ease-out' }}
              >
                <TextField
                  fullWidth
                  required
                  name="fullName"
                  label="Full name"
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ ...inputSx(theme), mb: 2 }}
                  placeholder="Dr Jane Smith"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ ...inputSx(theme), mb: 2 }}
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ ...inputSx(theme), mb: 2 }}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm password"
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ ...inputSx(theme), mb: 2 }}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: 'success.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddOutlinedIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    bgcolor: 'success.main',
                    boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.4)}`,
                    '&:hover': {
                      bgcolor: 'success.dark',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.45)}`,
                    },
                  }}
                >
                  Create account
                </Button>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                  By registering you agree to our{' '}
                  <Link component={RouterLink} to="/terms-of-service" color="primary" sx={linkSx(theme)}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link component={RouterLink} to="/privacy-policy" color="primary" sx={linkSx(theme)}>Privacy Policy</Link>.
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default SignIn
