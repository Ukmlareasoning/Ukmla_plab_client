import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  FormHelperText,
  Skeleton,
} from '@mui/material'
import UserDashboardLayout from './UserDashboardLayout'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import WcRoundedIcon from '@mui/icons-material/WcRounded'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import LockResetIcon from '@mui/icons-material/LockReset'
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'
import { updateUser } from '../store/authSlice'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

function Settings() {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Profile
  const [userId, setUserId] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [genderError, setGenderError] = useState('')
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileImageError, setProfileImageError] = useState('')

  // Change password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Change email
  const [newEmail, setNewEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [emailPendingVerification, setEmailPendingVerification] = useState('')
  const [newEmailError, setNewEmailError] = useState('')
  const [emailOtpError, setEmailOtpError] = useState('')
  const [changeEmailError, setChangeEmailError] = useState('')
  const [sendEmailOtpLoading, setSendEmailOtpLoading] = useState(false)
  const [verifyEmailOtpLoading, setVerifyEmailOtpLoading] = useState(false)
  const changeEmailRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async () => {
      setProfileLoading(true)
      setProfileError('')
      try {
        const { ok, data } = await apiClient('/auth/me', 'GET')
        if (!ok || !data?.success) {
          if (!cancelled) {
            setProfileError(data?.message || 'Unable to load profile.')
          }
          return
        }

        const user = data.data?.user || {}
        if (cancelled) return

        setUserId(user.id || null)
        setFirstName(user.first_name || '')
        setLastName(user.last_name || '')
        setEmail(user.email || '')
        const backendGender = (user.gender || '').toLowerCase()
        if (backendGender === 'male') setGender('Male')
        else if (backendGender === 'female') setGender('Female')
        else if (backendGender === 'other') setGender('Other')
        else setGender('')

        if (user.profile_image_url) {
          setProfilePreview(user.profile_image_url)
        }
      } catch {
        if (!cancelled) {
          setProfileError('Unable to load profile. Please try again.')
        }
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }

    fetchProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      if (profileImageError) setProfileImageError('')
      const reader = new FileReader()
      reader.onloadend = () => setProfilePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfile = () => {
    setProfileFile(null)
    setProfilePreview(null)
    if (profileImageError) setProfileImageError('')
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!userId || profileSaving) return

    setProfileSaving(true)
    setProfileError('')
    setFirstNameError('')
    setLastNameError('')
    setEmailError('')
    setGenderError('')
    setProfileImageError('')

    try {
      const formData = new FormData()
      formData.append('first_name', firstName.trim())
      formData.append('last_name', lastName.trim())
      const genderToSend = (gender || '').toLowerCase()
      formData.append('gender', genderToSend)

      if (profileFile) {
        formData.append('profile_image', profileFile)
      }

      const { ok, data } = await apiClient(`/users/${userId}`, 'POST', formData)

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.first_name) {
          const msg = Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name
          setFirstNameError(String(msg))
        }
        if (errors.last_name) {
          const msg = Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name
          setLastNameError(String(msg))
        }
        if (errors.email) {
          const msg = Array.isArray(errors.email) ? errors.email[0] : errors.email
          setEmailError(String(msg))
        }
        if (errors.gender) {
          const msg = Array.isArray(errors.gender) ? errors.gender[0] : errors.gender
          setGenderError(String(msg))
        }
        if (errors.profile_image) {
          const msg = Array.isArray(errors.profile_image) ? errors.profile_image[0] : errors.profile_image
          setProfileImageError(String(msg))
        }
        if (!errors.first_name && !errors.last_name && !errors.email && !errors.gender && !errors.profile_image) {
          const message = data?.message || 'Unable to update profile.'
          setProfileError(message)
        }
        return
      }

      const user = data.data?.user || {}

      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setEmail(user.email || '')
      const backendGender = (user.gender || '').toLowerCase()
      if (backendGender === 'male') setGender('Male')
      else if (backendGender === 'female') setGender('Female')
      else if (backendGender === 'other') setGender('Other')
      else setGender('')
      if (user.profile_image_url) {
        setProfilePreview(user.profile_image_url)
        setProfileFile(null)
      }

      dispatch(
        updateUser({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile_image: user.profile_image,
          gender: user.gender,
        }),
      )

      showToast('Profile updated successfully.', 'success')
    } catch {
      setProfileError('Unable to update profile. Please try again.')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordLoading) return

    setPasswordLoading(true)
    setCurrentPasswordError('')
    setNewPasswordError('')
    setConfirmPasswordError('')
    setPasswordError('')

    try {
      const { ok, data } = await apiClient('/auth/change-password', 'POST', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.current_password) {
          const msg = Array.isArray(errors.current_password) ? errors.current_password[0] : errors.current_password
          setCurrentPasswordError(String(msg))
        }
        if (errors.new_password) {
          const msg = Array.isArray(errors.new_password) ? errors.new_password[0] : errors.new_password
          setNewPasswordError(String(msg))
        }
        if (errors.confirm_password) {
          const msg = Array.isArray(errors.confirm_password) ? errors.confirm_password[0] : errors.confirm_password
          setConfirmPasswordError(String(msg))
        }
        if (!errors.current_password && !errors.new_password && !errors.confirm_password && data?.message) {
          setPasswordError(String(data.message))
        }
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showToast('Password updated successfully.', 'success')
    } catch {
      setPasswordError('Unable to update password. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleSendEmailOtp = async (e) => {
    e.preventDefault()
    if (sendEmailOtpLoading) return

    setSendEmailOtpLoading(true)
    setNewEmailError('')
    setEmailOtpError('')
    setChangeEmailError('')

    try {
      const { ok, data } = await apiClient('/auth/change-email/send-otp', 'POST', {
        new_email: newEmail.trim(),
      })

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.new_email) {
          const msg = Array.isArray(errors.new_email) ? errors.new_email[0] : errors.new_email
          setNewEmailError(String(msg))
        }
        if (!errors.new_email && data?.message) {
          setChangeEmailError(String(data.message))
        }
        return
      }

      setEmailPendingVerification(newEmail.trim())
      setOtpSent(true)
      setOtpValue('')
      showToast('We sent a 6-digit code to your new email.', 'success')
    } catch {
      setChangeEmailError('Unable to send OTP. Please try again.')
    } finally {
      setSendEmailOtpLoading(false)
    }
  }

  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault()
    if (verifyEmailOtpLoading || otpValue.length !== 6) return

    setVerifyEmailOtpLoading(true)
    setEmailOtpError('')
    setChangeEmailError('')

    try {
      const { ok, data } = await apiClient('/auth/change-email/verify-otp', 'POST', {
        otp: otpValue,
      })

      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.otp) {
          const msg = Array.isArray(errors.otp) ? errors.otp[0] : errors.otp
          setEmailOtpError(String(msg))
        }
        if (errors.new_email) {
          const msg = Array.isArray(errors.new_email) ? errors.new_email[0] : errors.new_email
          setNewEmailError(String(msg))
        }
        if (!errors.otp && !errors.new_email && data?.message) {
          // For generic errors like "Invalid OTP. Please try again." show under the OTP field
          setEmailOtpError(String(data.message))
        }
        return
      }

      const user = data.data?.user || {}
      setEmail(user.email || emailPendingVerification)
      setNewEmail('')
      setOtpValue('')
      setOtpSent(false)
      setEmailPendingVerification('')

      dispatch(
        updateUser({
          email: user.email,
        }),
      )

      showToast('Email updated successfully.', 'success')
    } catch {
      setChangeEmailError('Unable to verify OTP. Please try again.')
    } finally {
      setVerifyEmailOtpLoading(false)
    }
  }

  const handleEmailChangeBack = () => {
    setOtpSent(false)
    setOtpValue('')
    setEmailPendingVerification('')
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fff',
      borderRadius: '7px',
      minHeight: { xs: 52, sm: 56 },
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[300],
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(PAGE_PRIMARY, 0.4),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: PAGE_PRIMARY,
        borderWidth: 2,
        boxShadow: `0 0 0 4px ${alpha(PAGE_PRIMARY, 0.12)}`,
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
    },
  }

  const passwordMatchError = !!confirmPassword && newPassword !== confirmPassword

  return (
    <UserDashboardLayout>
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          maxWidth: 1000,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          overflowX: 'hidden',
        }}
      >
        {/* Header with Back + title */}
        <Box
          sx={{
            mb: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <IconButton
            onClick={() => navigate('/user-dashboard')}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              color: PAGE_PRIMARY,
              bgcolor: alpha(PAGE_PRIMARY, 0.08),
              '&:hover': {
                bgcolor: alpha(PAGE_PRIMARY, 0.15),
              },
            }}
            aria-label="Back to dashboard"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Manage your profile and security
            </Typography>
          </Box>
        </Box>

        {/* Form 1: Profile (Basic Information + Profile Photo) */}
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleProfileSubmit}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.12),
            bgcolor: theme.palette.background.paper,
            boxShadow: {
              xs: `0 2px 12px ${alpha(PAGE_PRIMARY, 0.06)}`,
              sm: `0 4px 20px ${alpha(PAGE_PRIMARY, 0.04)}`,
            },
            mb: { xs: 3, sm: 4 },
          }}
        >
          {/* Basic Information Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 1.5 },
                mb: { xs: 2.5, sm: 3 },
                pb: { xs: 1.5, sm: 2 },
                borderBottom: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  borderRadius: '7px',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(PAGE_PRIMARY, 0.2)}`,
                  flexShrink: 0,
                }}
              >
                <InfoRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: { xs: 22, sm: 24 } }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                {profileLoading ? (
                  <>
                    <Skeleton
                      variant="text"
                      sx={{ width: { xs: 160, sm: 200 }, height: 24, mb: 0.5, borderRadius: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ width: { xs: 200, sm: 260 }, height: 18, borderRadius: 1 }}
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1.0625rem', sm: '1.125rem' },
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Basic Information
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 0.25, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                    >
                      Your personal details
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            {profileLoading ? (
              <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} alignItems="flex-start">
                {[0, 1, 2, 3].map((key) => (
                  <Grid
                    key={key}
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    sx={{
                      minWidth: 0,
                      [theme.breakpoints.down('md')]: { flexBasis: '100%', maxWidth: '100%' },
                      [theme.breakpoints.up('md')]: { flex: '1 1 0%' },
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: '100%',
                        height: 56,
                        borderRadius: '7px',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
            <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} alignItems="flex-start">
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                sx={{
                  minWidth: 0,
                  [theme.breakpoints.down('md')]: { flexBasis: '100%', maxWidth: '100%' },
                  [theme.breakpoints.up('md')]: { flex: '1 1 0%' },
                }}
              >
                <TextField
                  fullWidth
                  label="First name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    if (firstNameError) setFirstNameError('')
                  }}
                  error={!!firstNameError}
                  helperText={firstNameError}
                  placeholder="e.g. John"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                sx={{
                  minWidth: 0,
                  [theme.breakpoints.down('md')]: { flexBasis: '100%', maxWidth: '100%' },
                  [theme.breakpoints.up('md')]: { flex: '1 1 0%' },
                }}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    if (lastNameError) setLastNameError('')
                  }}
                  error={!!lastNameError}
                  helperText={lastNameError}
                  placeholder="e.g. Smith"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                sx={{
                  minWidth: 0,
                  [theme.breakpoints.down('md')]: { flexBasis: '100%', maxWidth: '100%' },
                  [theme.breakpoints.up('md')]: { flex: '1 1 0%' },
                }}
              >
                <TextField
                  fullWidth
                  type="email"
                  label="Email address"
                  value={email}
                  placeholder="e.g. john.smith@email.com"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                  sx={{
                    ...inputSx,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha(theme.palette.grey[200], 0.6),
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.grey[400], 0.9),
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: alpha(theme.palette.text.secondary, 0.7),
                    },
                    '& .MuiOutlinedInput-input': {
                      cursor: 'pointer',
                      color: alpha(theme.palette.text.primary, 0.8),
                    },
                  }}
                  onClick={() => {
                    if (changeEmailRef.current) {
                      changeEmailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                sx={{
                  minWidth: 0,
                  [theme.breakpoints.down('md')]: { flexBasis: '100%', maxWidth: '100%' },
                  [theme.breakpoints.up('md')]: { flex: '1 1 0%' },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    minWidth: 0,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <WcRoundedIcon
                    sx={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      color: PAGE_PRIMARY,
                      fontSize: 22,
                      pointerEvents: 'none',
                    }}
                  />
                  <FormControl
                    fullWidth
                    size="medium"
                    sx={{
                      width: '100% !important',
                      minWidth: 0,
                      maxWidth: '100%',
                      '& .MuiOutlinedInput-root': {
                        width: '100% !important',
                        minWidth: 0,
                        maxWidth: '100%',
                        bgcolor: '#fff',
                        borderRadius: '7px',
                        pl: 4.5,
                        minHeight: { xs: 52, sm: 56 },
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.grey[300],
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(PAGE_PRIMARY, 0.4),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: PAGE_PRIMARY,
                          borderWidth: 2,
                          boxShadow: `0 0 0 4px ${alpha(PAGE_PRIMARY, 0.12)}`,
                        },
                      },
                      '& .MuiSelect-select': {
                        width: '100% !important',
                        minWidth: 0,
                        boxSizing: 'border-box',
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <InputLabel id="settings-gender-label" shrink>
                      Gender
                    </InputLabel>
                    <Select
                      labelId="settings-gender-label"
                      value={gender}
                      label="Gender"
                      onChange={(e) => setGender(e.target.value)}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: '7px',
                            mt: 1.5,
                            boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.12)}`,
                          },
                        },
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {genderError && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {genderError}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            )}
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Profile Photo Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 1.5 },
                mb: { xs: 2.5, sm: 3 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  borderRadius: '7px',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AccountCircleRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: { xs: 22, sm: 24 } }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.0625rem', sm: '1.125rem' },
                  }}
                >
                  Profile Photo
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.25, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                >
                  Upload your profile picture
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: { xs: 2.5, sm: 3 },
                p: { xs: 2.5, sm: 4 },
                borderRadius: '7px',
                bgcolor: alpha(PAGE_PRIMARY, 0.02),
                border: `1px dashed ${
                  profileImageError ? theme.palette.error.main : alpha(PAGE_PRIMARY, 0.2)
                }`,
              }}
            >
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                  sx={{
                    width: { xs: 140, sm: 120 },
                    height: { xs: 140, sm: 120 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `3px solid ${
                      profileImageError
                        ? theme.palette.error.main
                        : profilePreview
                          ? PAGE_PRIMARY
                          : alpha(PAGE_PRIMARY, 0.3)
                    }`,
                    bgcolor: theme.palette.grey[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: profilePreview ? `0 4px 16px ${alpha(PAGE_PRIMARY, 0.2)}` : 'none',
                  }}
                >
                  {profilePreview ? (
                    <Box
                      component="img"
                      src={profilePreview}
                      alt="Profile preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <AddPhotoAlternateRoundedIcon sx={{ color: theme.palette.grey[400], fontSize: 48 }} />
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  width: { xs: '100%', sm: 'auto' },
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                  {profilePreview ? 'Photo uploaded successfully!' : 'Choose a profile photo'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Recommended: Square image, at least 400x400px, max 5MB
                </Typography>
                <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center' }}>
                  <Button
                    component="label"
                    variant={profilePreview ? 'outlined' : 'contained'}
                    size="small"
                    startIcon={<AddPhotoAlternateRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    sx={{
                      borderRadius: '7px',
                      fontWeight: 600,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.25 },
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      minWidth: 0,
                      ...(profilePreview
                        ? {
                            borderColor: PAGE_PRIMARY,
                            color: PAGE_PRIMARY,
                            '&:hover': {
                              borderColor: PAGE_PRIMARY_DARK,
                              bgcolor: alpha(PAGE_PRIMARY, 0.08),
                            },
                          }
                        : {
                            bgcolor: PAGE_PRIMARY,
                            color: '#fff',
                            '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                          }),
                    }}
                  >
                    {profileFile ? 'Change photo' : 'Upload photo'}
                    <input type="file" hidden accept="image/*" onChange={handleProfileChange} />
                  </Button>
                  {profilePreview && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleRemoveProfile}
                      sx={{
                        color: theme.palette.error.main,
                        borderColor: theme.palette.error.main,
                        borderRadius: '7px',
                        fontWeight: 600,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.25 },
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                        minWidth: 0,
                        '&:hover': {
                          borderColor: theme.palette.error.dark,
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                        },
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                {profileImageError && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
                    {profileImageError}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {profileError && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'error.main' }}>
                {profileError}
              </Typography>
            </Box>
          )}

          {/* Update profile button (form 1) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: { xs: 1.5, sm: 2 } }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={
                profileSaving ? (
                  <AutorenewIcon
                    sx={{
                      animation: 'spin 0.8s linear infinite',
                      color: '#fff',
                    }}
                  />
                ) : (
                  <SaveRoundedIcon />
                )
              }
              disabled={profileSaving || profileLoading}
              sx={{
                bgcolor: PAGE_PRIMARY,
                borderRadius: '7px',
                fontWeight: 600,
                px: { xs: 2, sm: 4 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.3)}`,
                '&:hover': {
                  bgcolor: PAGE_PRIMARY_DARK,
                  boxShadow: `0 6px 16px ${alpha(PAGE_PRIMARY, 0.4)}`,
                },
                color: '#fff',
                '&.Mui-disabled': {
                  color: '#fff',
                  bgcolor: PAGE_PRIMARY,
                  boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.3)}`,
                },
              }}
            >
              {profileSaving ? 'Updating…' : 'Update profile'}
            </Button>
          </Box>
        </Paper>

        {/* Form 2: Change Password */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.12),
            bgcolor: theme.palette.background.paper,
            boxShadow: {
              xs: `0 2px 12px ${alpha(PAGE_PRIMARY, 0.06)}`,
              sm: `0 4px 20px ${alpha(PAGE_PRIMARY, 0.04)}`,
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Change Password Section */}
          <Box sx={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 1.5 },
                mb: { xs: 2.5, sm: 3 },
                pb: { xs: 1.5, sm: 2 },
                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  borderRadius: '7px',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(PAGE_PRIMARY, 0.2)}`,
                  flexShrink: 0,
                }}
              >
                <LockResetIcon sx={{ color: PAGE_PRIMARY, fontSize: { xs: 22, sm: 24 } }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.0625rem', sm: '1.125rem' },
                    letterSpacing: '-0.01em',
                  }}
                >
                  Change Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.25, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                >
                  Update your password to keep your account secure
                </Typography>
              </Box>
            </Box>

            <Box
              component="form"
              onSubmit={handlePasswordSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                type={showCurrentPassword ? 'text' : 'password'}
                label="Current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (currentPasswordError) setCurrentPasswordError('')
                }}
                placeholder="••••••••"
                size="medium"
                error={!!currentPasswordError}
                helperText={currentPasswordError}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowCurrentPassword((p) => !p)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showCurrentPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                label="New password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (newPasswordError) setNewPasswordError('')
                }}
                placeholder="••••••••"
                size="medium"
                error={!!newPasswordError}
                helperText={newPasswordError}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowNewPassword((p) => !p)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showNewPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (confirmPasswordError) setConfirmPasswordError('')
                }}
                placeholder="••••••••"
                size="medium"
                error={!!confirmPasswordError || passwordMatchError}
                helperText={confirmPasswordError || (passwordMatchError ? 'Passwords do not match' : '')}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
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
                        {showConfirmPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={passwordLoading}
                startIcon={
                  passwordLoading ? (
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
                  borderRadius: '7px',
                  fontWeight: 600,
                  px: 3,
                  py: 1.25,
                  bgcolor: PAGE_PRIMARY,
                  '&:hover': {
                    bgcolor: PAGE_PRIMARY_DARK,
                  },
                  color: '#fff',
                  '&.Mui-disabled': {
                    color: '#fff',
                    bgcolor: PAGE_PRIMARY,
                  },
                }}
              >
                {passwordLoading ? 'Updating password…' : 'Update Password'}
              </Button>
              {passwordError && (
                <Typography variant="body2" sx={{ mt: 1, color: 'error.main', textAlign: 'center' }}>
                  {passwordError}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Form 3: Change Email */}
        <Paper
          ref={changeEmailRef}
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.12),
            bgcolor: theme.palette.background.paper,
            boxShadow: {
              xs: `0 2px 12px ${alpha(PAGE_PRIMARY, 0.06)}`,
              sm: `0 4px 20px ${alpha(PAGE_PRIMARY, 0.04)}`,
            },
            mt: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Section header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 1.5 },
                mb: { xs: 2.5, sm: 3 },
                pb: { xs: 1.5, sm: 2 },
                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  borderRadius: '7px',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(PAGE_PRIMARY, 0.2)}`,
                  flexShrink: 0,
                }}
              >
                <MarkEmailReadRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: { xs: 22, sm: 24 } }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.0625rem', sm: '1.125rem' },
                    letterSpacing: '-0.01em',
                  }}
                >
                  Change Email
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.25, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                >
                  {otpSent ? 'Enter the 6-digit code sent to your new email' : 'Update your email address'}
                </Typography>
              </Box>
            </Box>

            {!otpSent ? (
              <Box
                component="form"
                onSubmit={handleSendEmailOtp}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignItems: 'center' }}
              >
                <TextField
                  fullWidth
                  type="email"
                  label="New email address"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value)
                    if (newEmailError) setNewEmailError('')
                  }}
                  placeholder="e.g. new.email@example.com"
                  size="medium"
                  error={!!newEmailError}
                  helperText={newEmailError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={sendEmailOtpLoading}
                  startIcon={
                    sendEmailOtpLoading ? (
                      <AutorenewIcon
                        sx={{
                          animation: 'spin 0.8s linear infinite',
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <MarkEmailReadRoundedIcon />
                    )
                  }
                  sx={{
                    borderRadius: '7px',
                    fontWeight: 600,
                    px: 3,
                    py: 1.25,
                    bgcolor: PAGE_PRIMARY,
                    '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                    color: '#fff',
                    '&.Mui-disabled': {
                      color: '#fff',
                      bgcolor: PAGE_PRIMARY,
                    },
                  }}
                >
                  {sendEmailOtpLoading ? 'Sending OTP…' : 'Send OTP to new email'}
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={handleVerifyEmailOtp}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignItems: 'center' }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', width: '100%' }}>
                  We've sent a 6-digit code to <strong>{emailPendingVerification}</strong>. Enter it below.
                </Typography>
                <TextField
                  fullWidth
                  label="6-digit code"
                  value={otpValue}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtpValue(v)
                    if (emailOtpError) setEmailOtpError('')
                  }}
                  placeholder="000000"
                  size="medium"
                  inputProps={{
                    maxLength: 6,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' },
                  }}
                  error={!!emailOtpError}
                  helperText={emailOtpError}
                  sx={{
                    ...inputSx,
                    maxWidth: 220,
                    '& .MuiOutlinedInput-input': { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    disabled={verifyEmailOtpLoading || otpValue.length !== 6}
                    startIcon={
                      verifyEmailOtpLoading ? (
                        <AutorenewIcon
                          sx={{
                            animation: 'spin 0.8s linear infinite',
                            color: '#fff',
                          }}
                        />
                      ) : undefined
                    }
                    sx={{
                      borderRadius: '7px',
                      fontWeight: 600,
                      px: 3,
                      py: 1.25,
                      bgcolor: PAGE_PRIMARY,
                      '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                      color: '#fff',
                      '&.Mui-disabled': {
                        color: '#fff',
                        bgcolor: PAGE_PRIMARY,
                      },
                    }}
                  >
                    {verifyEmailOtpLoading ? 'Verifying…' : 'Verify & update email'}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    size="medium"
                    onClick={handleEmailChangeBack}
                    sx={{
                      borderRadius: '7px',
                      fontWeight: 600,
                      px: 2,
                      py: 1.25,
                      borderColor: theme.palette.grey[400],
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: theme.palette.grey[500],
                        bgcolor: theme.palette.grey[50],
                      },
                    }}
                  >
                    Use different email
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </UserDashboardLayout>
  )
}

export default Settings
