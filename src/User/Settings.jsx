import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@mui/material'
import Header from '../components/Header'
import Footer from '../components/Footer'
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

function Settings() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Profile
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)

  // Change password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setProfilePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfile = () => {
    setProfileFile(null)
    setProfilePreview(null)
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // TODO: submit profile to API
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return
    // TODO: submit password change to API
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fff',
      borderRadius: 2,
      minHeight: { xs: 52, sm: 56 },
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[300],
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.4),
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
    },
  }

  const passwordMatchError = !!confirmPassword && newPassword !== confirmPassword

  return (
    <>
      <Header />
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
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
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
            borderRadius: { xs: 2.5, sm: 3 },
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.12),
            bgcolor: theme.palette.background.paper,
            boxShadow: {
              xs: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
              sm: `0 4px 20px ${alpha(theme.palette.primary.main, 0.04)}`,
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
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  flexShrink: 0,
                }}
              >
                <InfoRoundedIcon sx={{ color: 'primary.main', fontSize: { xs: 22, sm: 24 } }} />
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
                  Basic Information
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.25, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                >
                  Your personal details
                </Typography>
              </Box>
            </Box>

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
                  required
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                  required
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                  required
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.smith@email.com"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                      color: 'primary.main',
                      fontSize: 22,
                      pointerEvents: 'none',
                    }}
                  />
                  <FormControl
                    fullWidth
                    required
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
                        borderRadius: 2,
                        pl: 4.5,
                        minHeight: { xs: 52, sm: 56 },
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.grey[300],
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                          boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
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
                            borderRadius: 2,
                            mt: 1.5,
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                          },
                        },
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
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
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AccountCircleRoundedIcon sx={{ color: 'primary.main', fontSize: { xs: 22, sm: 24 } }} />
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
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box
                  sx={{
                    width: { xs: 140, sm: 120 },
                    height: { xs: 140, sm: 120 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `3px solid ${profilePreview ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)}`,
                    bgcolor: theme.palette.grey[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: profilePreview ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
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
                      borderRadius: 2,
                      fontWeight: 600,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.25 },
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      minWidth: 0,
                      ...(profilePreview
                        ? {
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            '&:hover': {
                              borderColor: theme.palette.primary.dark,
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                            },
                          }
                        : {
                            bgcolor: theme.palette.primary.main,
                            color: '#fff',
                            '&:hover': { bgcolor: theme.palette.primary.dark },
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
                        borderRadius: 2,
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
              </Box>
            </Box>
          </Box>

          {/* Update profile button (form 1) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: { xs: 1.5, sm: 2 } }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveRoundedIcon />}
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: 2,
                fontWeight: 600,
                px: { xs: 2, sm: 4 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              Update profile
            </Button>
          </Box>
        </Paper>

        {/* Form 2: Change Password */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: { xs: 2.5, sm: 3 },
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.12),
            bgcolor: theme.palette.background.paper,
            boxShadow: {
              xs: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
              sm: `0 4px 20px ${alpha(theme.palette.primary.main, 0.04)}`,
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
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  flexShrink: 0,
                }}
              >
                <LockResetIcon sx={{ color: 'primary.main', fontSize: { xs: 22, sm: 24 } }} />
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
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                size="medium"
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                size="medium"
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                size="medium"
                error={passwordMatchError}
                helperText={passwordMatchError ? 'Passwords do not match' : ''}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                variant="outlined"
                color="primary"
                size="medium"
                disabled={!currentPassword || !newPassword || !confirmPassword || passwordMatchError}
                startIcon={<LockResetIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 3,
                  py: 1.25,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Update Password
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  )
}

export default Settings
