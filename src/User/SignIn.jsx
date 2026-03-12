import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
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
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Header from '../components/Header'
import Footer from '../components/Footer'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

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
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
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
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginEmailError, setLoginEmailError] = useState('')
  const [loginPasswordError, setLoginPasswordError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

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
  const [registerAgreed, setRegisterAgreed] = useState(false)
  const [registerFirstNameError, setRegisterFirstNameError] = useState('')
  const [registerLastNameError, setRegisterLastNameError] = useState('')
  const [registerEmailError, setRegisterEmailError] = useState('')
  const [registerAgreedError, setRegisterAgreedError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerOtpError, setRegisterOtpError] = useState('')
  const [registerPasswordError, setRegisterPasswordError] = useState('')
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] = useState('')
  const [registerDetailsLoading, setRegisterDetailsLoading] = useState(false)
  const [registerOtpLoading, setRegisterOtpLoading] = useState(false)
  const [registerPasswordLoading, setRegisterPasswordLoading] = useState(false)

  // Forgot password dialog
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotStep, setForgotStep] = useState('email') // 'email' | 'otp' | 'password'
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotNewPass, setForgotNewPass] = useState('')
  const [forgotConfirmPass, setForgotConfirmPass] = useState('')
  const [showForgotNewPass, setShowForgotNewPass] = useState(false)
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false)
  const [forgotEmailError, setForgotEmailError] = useState('')
  const [forgotOtpError, setForgotOtpError] = useState('')
  const [forgotPasswordError, setForgotPasswordError] = useState('')
  const [forgotConfirmPasswordError, setForgotConfirmPasswordError] = useState('')
  const [forgotEmailLoading, setForgotEmailLoading] = useState(false)
  const [forgotOtpLoading, setForgotOtpLoading] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (newMode === 'register') {
      setLoginError('')
      setLoginEmailError('')
      setLoginPasswordError('')
      setRegisterStep('details')
      setRegisterFirstName('')
      setRegisterLastName('')
      setRegisterEmail('')
      setRegisterOtp('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
      setRegisterAgreed(false)
      setRegisterFirstNameError('')
      setRegisterLastNameError('')
      setRegisterEmailError('')
      setRegisterAgreedError('')
      setRegisterError('')
      setRegisterOtpError('')
      setRegisterPasswordError('')
      setRegisterConfirmPasswordError('')
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
    setForgotEmailError('')
    setForgotOtpError('')
    setForgotPasswordError('')
    setForgotConfirmPasswordError('')
  }

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (forgotEmailLoading) return
    setForgotEmailLoading(true)
    setForgotEmailError('')

    apiClient('/auth/forgot-password/send-otp', 'POST', {
      email: forgotEmail.trim(),
    })
      .then(({ ok, data }) => {
        if (!ok || !data?.success) {
          const errors = data?.errors || {}
          if (errors.email) {
            const msg = Array.isArray(errors.email) ? errors.email[0] : errors.email
            if (msg) setForgotEmailError(String(msg))
          } else {
            const serverMessage =
              data?.errors && typeof data.errors === 'object'
                ? Object.values(data.errors).flat().join(' ')
                : data?.message
            setForgotEmailError(serverMessage || 'Unable to send OTP. Please try again.')
          }
          return
        }

        setForgotStep('otp')
        showToast('We sent a 6-digit code to your email.', 'success')
      })
      .catch(() => {
        setForgotEmailError('Unable to reach server. Please try again.')
      })
      .finally(() => {
        setForgotEmailLoading(false)
      })
  }

  const handleOtpNext = (e) => {
    e.preventDefault()
    if (forgotOtpLoading) return
    setForgotOtpLoading(true)
    setForgotOtpError('')

    apiClient('/auth/forgot-password/verify-otp', 'POST', {
      email: forgotEmail.trim(),
      otp: forgotOtp,
    })
      .then(({ ok, data }) => {
        if (!ok || !data?.success) {
          const errors = data?.errors || {}
          if (errors.otp) {
            const msg = Array.isArray(errors.otp) ? errors.otp[0] : errors.otp
            if (msg) setForgotOtpError(String(msg))
          } else {
            const serverMessage =
              data?.errors && typeof data.errors === 'object'
                ? Object.values(data.errors).flat().join(' ')
                : data?.message
            setForgotOtpError(serverMessage || 'Invalid code. Please try again.')
          }
          return
        }

        setForgotStep('password')
        showToast('OTP verified successfully. You can now set a new password.', 'success')
      })
      .catch(() => {
        setForgotOtpError('Unable to reach server. Please try again.')
      })
      .finally(() => {
        setForgotOtpLoading(false)
      })
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (forgotPasswordLoading) return
    setForgotPasswordLoading(true)
    setForgotPasswordError('')
    setForgotConfirmPasswordError('')

    apiClient('/auth/forgot-password/reset', 'POST', {
      email: forgotEmail.trim(),
      password: forgotNewPass,
      confirm_password: forgotConfirmPass,
    })
      .then(({ ok, data }) => {
        if (!ok || !data?.success) {
          const errors = data?.errors || {}
          if (errors.password) {
            const msg = Array.isArray(errors.password) ? errors.password[0] : errors.password
            if (msg) setForgotPasswordError(String(msg))
          }
          if (errors.confirm_password) {
            const msg = Array.isArray(errors.confirm_password)
              ? errors.confirm_password[0]
              : errors.confirm_password
            if (msg) setForgotConfirmPasswordError(String(msg))
          }
          if (!errors.password && !errors.confirm_password) {
            const serverMessage =
              data?.errors && typeof data.errors === 'object'
                ? Object.values(data.errors).flat().join(' ')
                : data?.message
            setForgotPasswordError(serverMessage || 'Unable to reset password. Please try again.')
          }
          return
        }

        showToast('Password reset successfully. You can now log in.', 'success')
        handleForgotClose()
      })
      .catch(() => {
        setForgotPasswordError('Unable to reach server. Please try again.')
      })
      .finally(() => {
        setForgotPasswordLoading(false)
      })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (loginLoading) return
    setLoginLoading(true)
    setLoginError('')
    setLoginEmailError('')
    setLoginPasswordError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString()

    try {
      const { ok, data } = await apiClient('/auth/login', 'POST', { email, password })

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.email) {
          setLoginEmailError(Array.isArray(errors.email) ? errors.email[0] : String(errors.email))
        }
        if (errors.password) {
          setLoginPasswordError(Array.isArray(errors.password) ? errors.password[0] : String(errors.password))
        }
        if (!errors.email && !errors.password && data?.message) {
          // Show non-field errors like "Invalid email or password." in the toaster
          showToast(data.message, 'error')
        }
        return
      }

      dispatch(loginSuccess({
        user: data.data.user,
        token: data.data.token,
      }))

      showToast('Login successful.', 'success')
      navigate('/')
    } catch {
      setLoginError('Unable to reach server. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegisterDetailsSubmit = async (e) => {
    e.preventDefault()
    if (registerDetailsLoading) return
    setRegisterDetailsLoading(true)
    setRegisterError('')
    setRegisterOtpError('')

    setRegisterFirstNameError('')
    setRegisterLastNameError('')
    setRegisterEmailError('')
    setRegisterAgreedError('')

    try {
      const { ok, data } = await apiClient('/auth/register', 'POST', {
        first_name: registerFirstName.trim(),
        last_name: registerLastName.trim(),
        email: registerEmail.trim(),
        is_agreed: registerAgreed ? 1 : 0,
      })

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.first_name) {
          setRegisterFirstNameError(
            Array.isArray(errors.first_name) ? errors.first_name[0] : String(errors.first_name),
          )
        }
        if (errors.last_name) {
          setRegisterLastNameError(
            Array.isArray(errors.last_name) ? errors.last_name[0] : String(errors.last_name),
          )
        }
        if (errors.email) {
          setRegisterEmailError(
            Array.isArray(errors.email) ? errors.email[0] : String(errors.email),
          )
        }
        if (errors.is_agreed) {
          setRegisterAgreedError(
            Array.isArray(errors.is_agreed) ? errors.is_agreed[0] : String(errors.is_agreed),
          )
        }
        if (!errors.first_name && !errors.last_name && !errors.email && !errors.is_agreed) {
          const serverMessage =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setRegisterError(serverMessage || 'Registration failed. Please try again.')
        }
        return
      }

      setRegisterStep('otp')
      showToast('Registration successful. We sent you a 6-digit OTP.', 'success')
    } catch {
      setRegisterError('Unable to reach server. Please try again.')
    } finally {
      setRegisterDetailsLoading(false)
    }
  }

  const handleRegisterOtpSubmit = async (e) => {
    e.preventDefault()
    if (registerOtpLoading) return
    setRegisterOtpError('')
    setRegisterOtpLoading(true)

    try {
      const { ok, data } = await apiClient('/auth/verify-otp', 'POST', {
        email: registerEmail.trim(),
        otp: registerOtp,
      })

      if (!ok || !data?.success) {
        const serverMessage =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setRegisterOtpError(serverMessage || 'Invalid code. Please try again.')
        return
      }

      setRegisterStep('password')
      showToast('Email verified successfully. Please create your password.', 'success')
    } catch {
      setRegisterOtpError('Unable to reach server. Please try again.')
    } finally {
      setRegisterOtpLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (registerPasswordLoading) return
    setRegisterPasswordError('')
    setRegisterConfirmPasswordError('')

    setRegisterPasswordLoading(true)

    try {
      const { ok, data } = await apiClient('/auth/create-password', 'POST', {
        email: registerEmail.trim(),
        password: registerPassword,
        confirm_password: registerConfirmPassword,
      })

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.password) {
          const passwordMsg = Array.isArray(errors.password) ? errors.password[0] : errors.password
          if (passwordMsg) setRegisterPasswordError(String(passwordMsg))
        }
        if (errors.confirm_password) {
          const confirmMsg = Array.isArray(errors.confirm_password)
            ? errors.confirm_password[0]
            : errors.confirm_password
          if (confirmMsg) setRegisterConfirmPasswordError(String(confirmMsg))
        }
        if (!errors.password && !errors.confirm_password) {
          const serverMessage =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setRegisterPasswordError(serverMessage || 'Unable to set password. Please try again.')
        }
        return
      }

      // On successful registration, return to login mode
      setMode('login')
      setRegisterStep('details')
      setRegisterFirstName('')
      setRegisterLastName('')
      setRegisterEmail('')
      setRegisterOtp('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
      setRegisterAgreed(false)
      showToast('Account created successfully. You can now log in.', 'success')
    } catch {
      setRegisterPasswordError('Unable to reach server. Please try again.')
    } finally {
      setRegisterPasswordLoading(false)
    }
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
                  name="email"
                  type="email"
                  label="Email"
                  error={!!loginEmailError}
                  helperText={loginEmailError}
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
                  onChange={(e) => {
                    if (loginEmailError) setLoginEmailError('')
                  }}
                />
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  error={!!loginPasswordError}
                  helperText={loginPasswordError}
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
                  onChange={(e) => {
                    if (loginPasswordError) setLoginPasswordError('')
                  }}
                />
                {loginError && (
                  <Typography variant="body2" sx={{ color: 'error.main', mb: 1 }}>
                    {loginError}
                  </Typography>
                )}
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
                  disabled={loginLoading}
                  startIcon={
                    loginLoading ? (
                      <AutorenewIcon
                        sx={{
                          animation: 'spin 0.8s linear infinite',
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <LoginIcon />
                    )
                  }
                  sx={{
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
                  Sign in
                </Button>
              </Box>
            )}

            {/* Register form — 3 steps: details → otp → password */}
            {mode === 'register' && registerStep === 'details' && (
              <Box component="form" onSubmit={handleRegisterDetailsSubmit} sx={{ animation: 'fadeInUp 0.35s ease-out' }}>
                <TextField
                  fullWidth
                  label="First name"
                  value={registerFirstName}
                  onChange={(e) => {
                    setRegisterFirstName(e.target.value)
                    if (registerFirstNameError) setRegisterFirstNameError('')
                  }}
                  error={!!registerFirstNameError}
                  helperText={registerFirstNameError}
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
                  label="Last name"
                  value={registerLastName}
                  onChange={(e) => {
                    setRegisterLastName(e.target.value)
                    if (registerLastNameError) setRegisterLastNameError('')
                  }}
                  error={!!registerLastNameError}
                  helperText={registerLastNameError}
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
                  type="email"
                  label="Email"
                  value={registerEmail}
                  onChange={(e) => {
                    setRegisterEmail(e.target.value)
                    if (registerEmailError) setRegisterEmailError('')
                  }}
                  error={!!registerEmailError}
                  helperText={registerEmailError}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={registerAgreed}
                      onChange={(e) => {
                        setRegisterAgreed(e.target.checked)
                        if (registerAgreedError) setRegisterAgreedError('')
                      }}
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
                      I agree to the{' '}
                      <Link component={RouterLink} to="/terms-of-service" sx={linkSx()}>
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link component={RouterLink} to="/privacy-policy" sx={linkSx()}>
                        Privacy Policy
                      </Link>
                      .
                    </Typography>
                  }
                  sx={{ mb: 1.5, alignItems: 'center', mr: 0, '& .MuiFormControlLabel-label': { mt: 0 } }}
                />
                {(registerAgreedError || registerError) && (
                  <Typography variant="body2" sx={{ color: 'error.main', mb: 1 }}>
                    {registerAgreedError || registerError}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={registerDetailsLoading}
                  startIcon={
                    registerDetailsLoading ? (
                      <AutorenewIcon
                        sx={{
                          animation: 'spin 0.8s linear infinite',
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <SendOutlinedIcon />
                    )
                  }
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
                  label="Verification code"
                  value={registerOtp}
                  onChange={(e) => {
                    setRegisterOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    if (registerOtpError) setRegisterOtpError('')
                  }}
                  error={!!registerOtpError}
                  helperText={registerOtpError}
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
                  disabled={registerOtpLoading}
                  startIcon={
                    registerOtpLoading ? (
                      <AutorenewIcon
                        sx={{
                          animation: 'spin 0.8s linear infinite',
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <CheckCircleOutlinedIcon />
                    )
                  }
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
                  type={showRegisterPassword ? 'text' : 'password'}
                  label="Password"
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value)
                    if (registerPasswordError) setRegisterPasswordError('')
                  }}
                  error={!!registerPasswordError}
                  helperText={registerPasswordError}
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
                  type={showRegisterConfirmPassword ? 'text' : 'password'}
                  label="Confirm password"
                  value={registerConfirmPassword}
                  onChange={(e) => {
                    setRegisterConfirmPassword(e.target.value)
                    if (registerConfirmPasswordError) setRegisterConfirmPasswordError('')
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{ ...inputSx(), mb: 2 }}
                  placeholder="••••••••"
                  error={!!registerConfirmPasswordError}
                  helperText={registerConfirmPasswordError}
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
                  disabled={registerPasswordLoading}
                  startIcon={
                    registerPasswordLoading ? (
                      <AutorenewIcon
                        sx={{
                          animation: 'spin 0.8s linear infinite',
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <PersonAddOutlinedIcon />
                    )
                  }
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
                type="email"
                label="Email address"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value)
                  if (forgotEmailError) setForgotEmailError('')
                }}
                variant="outlined"
                size="medium"
                sx={dialogInputSx(theme)}
                placeholder="you@example.com"
                error={!!forgotEmailError}
                helperText={forgotEmailError}
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
                disabled={forgotEmailLoading}
                startIcon={
                  forgotEmailLoading ? (
                    <AutorenewIcon
                      sx={{
                        animation: 'spin 0.8s linear infinite',
                        color: '#fff',
                      }}
                    />
                  ) : (
                    <SendOutlinedIcon />
                  )
                }
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
                label="Verification code"
                value={forgotOtp}
                onChange={(e) => {
                  setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  if (forgotOtpError) setForgotOtpError('')
                }}
                variant="outlined"
                size="medium"
                placeholder="000000"
                inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                InputLabelProps={{ shrink: true }}
                error={!!forgotOtpError}
                helperText={forgotOtpError}
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
                disabled={forgotOtpLoading}
                startIcon={
                  forgotOtpLoading ? (
                    <AutorenewIcon
                      sx={{
                        animation: 'spin 0.8s linear infinite',
                        color: '#fff',
                      }}
                    />
                  ) : (
                    <CheckCircleOutlinedIcon />
                  )
                }
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 700,
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
                Verify & continue
              </Button>
            </Box>
          )}

          {forgotStep === 'password' && (
            <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type={showForgotNewPass ? 'text' : 'password'}
                label="New password"
                value={forgotNewPass}
                onChange={(e) => {
                  setForgotNewPass(e.target.value)
                  if (forgotPasswordError) setForgotPasswordError('')
                }}
                variant="outlined"
                size="medium"
                sx={{ ...dialogInputSx(theme), mb: 2 }}
                placeholder="••••••••"
                error={!!forgotPasswordError}
                helperText={forgotPasswordError}
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
                type={showForgotConfirmPass ? 'text' : 'password'}
                label="Confirm new password"
                value={forgotConfirmPass}
                onChange={(e) => {
                  setForgotConfirmPass(e.target.value)
                  if (forgotConfirmPasswordError) setForgotConfirmPasswordError('')
                }}
                variant="outlined"
                size="medium"
                sx={dialogInputSx(theme)}
                InputLabelProps={{ shrink: true }}
                placeholder="••••••••"
                error={!!forgotConfirmPasswordError}
                helperText={forgotConfirmPasswordError}
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
                disabled={forgotPasswordLoading}
                startIcon={
                  forgotPasswordLoading ? (
                    <AutorenewIcon
                      sx={{
                        animation: 'spin 0.8s linear infinite',
                        color: '#fff',
                      }}
                    />
                  ) : (
                    <LockResetIcon />
                  )
                }
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 700,
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
