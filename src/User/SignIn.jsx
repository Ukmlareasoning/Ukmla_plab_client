import { useState, useEffect } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
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
import LockResetIcon from '@mui/icons-material/LockReset'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import PinOutlinedIcon from '@mui/icons-material/PinOutlined'
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'
// Logo (matches Header.jsx)
const LOGO_RING = '#D4AF37'
const LOGO_BG = '#1e3a5f'

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

const inputSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(PAGE_PRIMARY, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: PAGE_PRIMARY,
      },
    },
  },
})

// Links: no underline, subtle hover (color + scale)
const linkSx = () => ({
  textDecoration: 'none',
  fontWeight: 600,
  color: PAGE_PRIMARY,
  transition: 'color 0.2s ease, transform 0.2s ease',
  '&:hover': {
    textDecoration: 'none',
    color: PAGE_PRIMARY_DARK,
    transform: 'translateY(-1px)',
  },
})

// Dialog inputs: visible label, consistent with theme
const dialogInputSx = (theme) => ({
  ...inputSx(),
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    '&.Mui-focused': { color: PAGE_PRIMARY },
  },
})

function SignIn() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Register 3-step flow: details → otp → password
  const [registerStep, setRegisterStep] = useState('details') // 'details' | 'otp' | 'password'
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerOtp, setRegisterOtp] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)

  // Forgot password dialog
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState('email') // 'email' | 'otp' | 'password'
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotNewPass, setForgotNewPass] = useState('')
  const [forgotConfirmPass, setForgotConfirmPass] = useState('')
  const [showForgotNewPass, setShowForgotNewPass] = useState(false)
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false)

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (newMode === 'register') {
      setRegisterStep('details')
      setRegisterFirstName('')
      setRegisterLastName('')
      setRegisterEmail('')
      setRegisterOtp('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
    }
  }

  const handleForgotOpen = () => setForgotOpen(true)
  const handleForgotClose = () => {
    setForgotOpen(false)
    setForgotStep('email')
    setForgotEmail('')
    setForgotOtp('')
    setForgotNewPass('')
    setForgotConfirmPass('')
  }

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    // Placeholder: call API to send OTP to forgotEmail
    setForgotStep('otp')
  }

  const handleOtpNext = (e) => {
    e.preventDefault()
    if (forgotOtp.length !== 6) return
    // Placeholder: verify OTP with backend
    setForgotStep('password')
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (forgotNewPass !== forgotConfirmPass || !forgotNewPass) return
    // Placeholder: call API to set new password
    handleForgotClose()
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    // Placeholder: wire to auth API
  }

  const handleRegisterDetailsSubmit = (e) => {
    e.preventDefault()
    if (!registerFirstName.trim() || !registerLastName.trim() || !registerEmail.trim()) return
    // Placeholder: call API to send OTP to registerEmail
    setRegisterStep('otp')
  }

  const handleRegisterOtpSubmit = (e) => {
    e.preventDefault()
    if (registerOtp.length !== 6) return
    // Placeholder: verify OTP with backend
    setRegisterStep('password')
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (registerPassword !== registerConfirmPassword || !registerPassword) return
    // Placeholder: wire to auth API with registerFirstName, registerLastName, registerEmail, registerPassword
    setMode('login')
    setRegisterStep('details')
    setRegisterFirstName('')
    setRegisterLastName('')
    setRegisterEmail('')
    setRegisterOtp('')
    setRegisterPassword('')
    setRegisterConfirmPassword('')
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
              borderRadius: '7px',
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
                background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                opacity: 0.8,
              },
            }}
          >
            {/* Complete logo (badge + title + subtitle) — same as Header, click goes to home */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: `2px solid ${LOGO_RING}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: LOGO_BG,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 900,
                      color: '#FFFFFF',
                      fontSize: '1.1rem',
                      letterSpacing: '0.05em',
                      lineHeight: 1,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                  >
                    UP
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: { xs: '0.875rem', sm: '1.15rem' },
                      letterSpacing: '0.02em',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    UKMLA Reasoning Examiner
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 500,
                      color: 'text.secondary',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      letterSpacing: '0.1em',
                      lineHeight: 1.2,
                      mt: 0.25,
                    }}
                  >
                    UKMLA & PLAB Reasoning
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Section title */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  color: PAGE_PRIMARY,
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
                borderRadius: '7px',
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
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: mode === 'login' ? '#fff' : theme.palette.text.secondary,
                  background: mode === 'login'
                    ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`
                    : 'transparent',
                  boxShadow: mode === 'login' ? `0 2px 8px ${alpha(PAGE_PRIMARY, 0.35)}` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: mode === 'login' ? '#fff' : PAGE_PRIMARY,
                    background: mode === 'login'
                      ? `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`
                      : alpha(PAGE_PRIMARY, 0.08),
                    boxShadow: mode === 'login' ? `0 3px 12px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
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
                  borderRadius: '7px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: mode === 'register' ? '#fff' : theme.palette.text.secondary,
                  background: mode === 'register'
                    ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`
                    : 'transparent',
                  boxShadow: mode === 'register' ? `0 2px 8px ${alpha(PAGE_PRIMARY, 0.35)}` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: mode === 'register' ? '#fff' : PAGE_PRIMARY,
                    background: mode === 'register'
                      ? `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`
                      : alpha(PAGE_PRIMARY, 0.08),
                    boxShadow: mode === 'register' ? `0 3px 12px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
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
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
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
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
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
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        '&.Mui-checked': { color: PAGE_PRIMARY },
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
                          <Link component={RouterLink} to="/terms-of-service" sx={linkSx()}>Terms</Link>
                          {' & '}
                          <Link component={RouterLink} to="/privacy-policy" sx={linkSx()}>Privacy</Link>
                        </>
                      ) : (
                        <>
                          I agree to the{' '}
                          <Link component={RouterLink} to="/terms-of-service" sx={linkSx()}>
                            Terms of Service
                          </Link>
                          {' '}and{' '}
                          <Link component={RouterLink} to="/privacy-policy" sx={linkSx()}>
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
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={handleForgotOpen}
                    sx={{ color: PAGE_PRIMARY, ...linkSx(), cursor: 'pointer', bgcolor: 'transparent', border: 'none' }}
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
                    borderRadius: '7px',
                    background: termsAccepted
                      ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`
                      : undefined,
                    boxShadow: termsAccepted ? `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
                    '&:hover': termsAccepted ? {
                      background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`,
                      boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                    } : {},
                  }}
                >
                  Sign in
                </Button>
              </Box>
            )}

            {/* Register form — 3 steps: details → otp → password */}
            {mode === 'register' && registerStep === 'details' && (
              <Box component="form" onSubmit={handleRegisterDetailsSubmit} sx={{ animation: 'fadeInUp 0.35s ease-out' }}>
                <TextField
                  fullWidth
                  required
                  label="First name"
                  value={registerFirstName}
                  onChange={(e) => setRegisterFirstName(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="Jane"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Last name"
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="Smith"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="you@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SendOutlinedIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '7px',
                    bgcolor: PAGE_PRIMARY,
                    boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}`,
                    '&:hover': {
                      bgcolor: PAGE_PRIMARY_DARK,
                      boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                    },
                  }}
                >
                  Continue
                </Button>
              </Box>
            )}

            {mode === 'register' && registerStep === 'otp' && (
              <Box component="form" onSubmit={handleRegisterOtpSubmit} sx={{ animation: 'fadeInUp 0.35s ease-out' }}>
                <TextField
                  fullWidth
                  required
                  label="Verification code"
                  value={registerOtp}
                  onChange={(e) => setRegisterOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  variant="outlined"
                  size="medium"
                  placeholder="000000"
                  inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                  sx={{
                    ...inputSx(),
                    mb: 2,
                    '& .MuiOutlinedInput-input': { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, textAlign: 'center' }}>
                  We sent a 6-digit code to {registerEmail}
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={registerOtp.length !== 6}
                  startIcon={<CheckCircleOutlinedIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '7px',
                    bgcolor: registerOtp.length === 6 ? PAGE_PRIMARY : undefined,
                    boxShadow: registerOtp.length === 6 ? `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
                    '&:hover': registerOtp.length === 6 ? {
                      bgcolor: PAGE_PRIMARY_DARK,
                      boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                    } : {},
                  }}
                >
                  Verify & continue
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="text"
                  size="medium"
                  onClick={() => setRegisterStep('details')}
                  sx={{ mt: 1.5, color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
                >
                  Change email
                </Button>
              </Box>
            )}

            {mode === 'register' && registerStep === 'password' && (
              <Box component="form" onSubmit={handleRegisterSubmit} sx={{ animation: 'fadeInUp 0.35s ease-out' }}>
                <TextField
                  fullWidth
                  required
                  type={showRegisterPassword ? 'text' : 'password'}
                  label="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowRegisterPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showRegisterPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  required
                  type={showRegisterConfirmPassword ? 'text' : 'password'}
                  label="Confirm password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="••••••••"
                  error={!!registerConfirmPassword && registerPassword !== registerConfirmPassword}
                  helperText={!!registerConfirmPassword && registerPassword !== registerConfirmPassword ? 'Passwords do not match' : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showRegisterConfirmPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowRegisterConfirmPassword((p) => !p)}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showRegisterConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
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
                  disabled={!registerPassword || registerPassword !== registerConfirmPassword}
                  startIcon={<PersonAddOutlinedIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '7px',
                    bgcolor: registerPassword && registerPassword === registerConfirmPassword ? PAGE_PRIMARY : undefined,
                    boxShadow: registerPassword && registerPassword === registerConfirmPassword ? `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
                    '&:hover': registerPassword && registerPassword === registerConfirmPassword ? {
                      bgcolor: PAGE_PRIMARY_DARK,
                      boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                    } : {},
                  }}
                >
                  Create account
                </Button>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                  By registering you agree to our{' '}
                  <Link component={RouterLink} to="/terms-of-service" sx={linkSx()}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link component={RouterLink} to="/privacy-policy" sx={linkSx()}>Privacy Policy</Link>.
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Forgot password dialog — bottom sheet on mobile, centered modal on desktop */}
      <Dialog
        open={forgotOpen}
        onClose={handleForgotClose}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': {
              alignItems: 'flex-end',
              justifyContent: 'center',
            },
          }),
        }}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '7px 7px 0 0' : '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
              : `0 24px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.06)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
            },
          },
        }}
      >
        {isMobile && (
          <Box
            sx={{
              pt: 1.5,
              pb: 0.5,
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(PAGE_PRIMARY, 0.02),
              borderBottom: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.1),
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: '7px',
                bgcolor: theme.palette.grey[400],
              }}
            />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 4 },
            pb: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.1),
            bgcolor: alpha(PAGE_PRIMARY, 0.02),
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(PAGE_PRIMARY, 0.12),
              color: PAGE_PRIMARY,
              border: '2px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.2),
              boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.2)}`,
            }}
          >
            <LockResetIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              Reset password
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>
              {forgotStep === 'email' && 'Enter your email to receive a verification code'}
              {forgotStep === 'otp' && 'Enter the 6-digit code we sent to your email'}
              {forgotStep === 'password' && 'Choose a strong new password'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 6.5, pb: 2.5, px: { xs: 2.5, sm: 3.5 }, minHeight: 220 }}>
          {forgotStep === 'email' && (
            <Box component="form" onSubmit={handleSendOtp} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                variant="outlined"
                size="medium"
                sx={dialogInputSx(theme)}
                placeholder="you@example.com"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SendOutlinedIcon />}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: '7px',
                  background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                  boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                  },
                }}
              >
                Send OTP
              </Button>
            </Box>
          )}

          {forgotStep === 'otp' && (
            <Box component="form" onSubmit={handleOtpNext} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                label="Verification code"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                variant="outlined"
                size="medium"
                placeholder="000000"
                inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  ...dialogInputSx(theme),
                  '& .MuiOutlinedInput-input': { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={forgotOtp.length !== 6}
                startIcon={<CheckCircleOutlinedIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '7px',
                  background: forgotOtp.length === 6
                    ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`
                    : undefined,
                  boxShadow: forgotOtp.length === 6 ? `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
                  '&:hover': forgotOtp.length === 6 ? {
                    background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                  } : {},
                }}
              >
                Verify & continue
              </Button>
            </Box>
          )}

          {forgotStep === 'password' && (
            <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                type={showForgotNewPass ? 'text' : 'password'}
                label="New password"
                value={forgotNewPass}
                onChange={(e) => setForgotNewPass(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{ ...dialogInputSx(theme), mb: 2 }}
                placeholder="••••••••"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showForgotNewPass ? 'Hide password' : 'Show password'}
                        onClick={() => setShowForgotNewPass((p) => !p)}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showForgotNewPass ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                type={showForgotConfirmPass ? 'text' : 'password'}
                label="Confirm new password"
                value={forgotConfirmPass}
                onChange={(e) => setForgotConfirmPass(e.target.value)}
                variant="outlined"
                size="medium"
                sx={dialogInputSx(theme)}
                InputLabelProps={{ shrink: true }}
                placeholder="••••••••"
                error={!!forgotConfirmPass && forgotNewPass !== forgotConfirmPass}
                helperText={!!forgotConfirmPass && forgotNewPass !== forgotConfirmPass ? 'Passwords do not match' : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showForgotConfirmPass ? 'Hide password' : 'Show password'}
                        onClick={() => setShowForgotConfirmPass((p) => !p)}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showForgotConfirmPass ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
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
                disabled={!forgotNewPass || forgotNewPass !== forgotConfirmPass}
                startIcon={<LockResetIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '7px',
                  background: forgotNewPass && forgotNewPass === forgotConfirmPass
                    ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`
                    : undefined,
                  boxShadow: forgotNewPass && forgotNewPass === forgotConfirmPass ? `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none',
                  '&:hover': forgotNewPass && forgotNewPass === forgotConfirmPass ? {
                    background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                  } : {},
                }}
              >
                Set new password
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 },
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.5),
            bgcolor: theme.palette.grey[50],
          }}
        >
          <Button
            onClick={handleForgotClose}
            startIcon={forgotStep === 'email' ? <CloseOutlinedIcon sx={{ fontSize: 20 }} /> : <LoginIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '7px',
              px: 2,
              '&:hover': {
                bgcolor: alpha(PAGE_PRIMARY, 0.06),
                color: PAGE_PRIMARY,
              },
            }}
          >
            {forgotStep === 'email' ? 'Cancel' : 'Back to login'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  )
}

export default SignIn
