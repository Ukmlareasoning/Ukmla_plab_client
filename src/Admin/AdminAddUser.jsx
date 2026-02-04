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
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import WcRoundedIcon from '@mui/icons-material/WcRounded'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'

function AdminAddUser() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: submit to API
    navigate('/admin/users')
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: theme.palette.grey[50],
      borderRadius: 2,
      minHeight: 56,
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

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 1000,
        mx: 'auto',
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
          onClick={() => navigate('/admin/users')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            },
          }}
          aria-label="Back to users"
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
            Add User
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Create a new platform user
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
          bgcolor: theme.palette.background.paper,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.04)}`,
        }}
      >
        {/* Basic Information Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <InfoRoundedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
                Basic Information
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25, fontSize: '0.875rem' }}>
                Enter user's personal details
              </Typography>
            </Box>
          </Box>

          {/* Single row: 4 fields, equal width (3 cols each on md+) */}
          <Grid container spacing={{ xs: 2.5, sm: 2, md: 2 }} alignItems="flex-start">
            <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0, [theme.breakpoints.up('md')]: { flex: '1 1 0%' } }}>
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
            <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0, [theme.breakpoints.up('md')]: { flex: '1 1 0%' } }}>
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
            <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0, [theme.breakpoints.up('md')]: { flex: '1 1 0%' } }}>
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
            <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0, [theme.breakpoints.up('md')]: { flex: '1 1 0%' } }}>
              <Box sx={{ position: 'relative', width: '100%', minWidth: 0, maxWidth: '100%' }}>
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
                      bgcolor: theme.palette.grey[50],
                      borderRadius: 2,
                      pl: 4.5,
                      minHeight: 56,
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
                  <InputLabel id="add-user-gender-label" shrink>
                    Gender
                  </InputLabel>
                  <Select
                    labelId="add-user-gender-label"
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

        <Divider sx={{ my: 4 }} />

        {/* Profile Photo Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccountCircleRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.125rem' }}>
                Profile Photo
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Upload user profile picture
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3,
              p: { xs: 3, sm: 4 },
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {/* Preview area */}
            <Box
              sx={{
                position: 'relative',
                flexShrink: 0,
              }}
            >
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
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AddPhotoAlternateRoundedIcon sx={{ color: theme.palette.grey[400], fontSize: 48 }} />
                )}
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                {profilePreview ? 'Photo uploaded successfully!' : 'Choose a profile photo'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Recommended: Square image, at least 400x400px, max 5MB
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Button
                  component="label"
                  variant={profilePreview ? 'outlined' : 'contained'}
                  size="medium"
                  startIcon={<AddPhotoAlternateRoundedIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    px: 3,
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
                    size="medium"
                    variant="outlined"
                    onClick={handleRemoveProfile}
                    sx={{
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 3,
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

        <Divider sx={{ my: 4 }} />

        {/* Submit Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            gap: 2,
            pt: 2,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={() => navigate('/admin/users')}
            sx={{
              borderColor: theme.palette.grey[300],
              color: 'text.secondary',
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              minWidth: { xs: '48%', sm: 140 },
              '&:hover': {
                borderColor: theme.palette.grey[400],
                bgcolor: theme.palette.grey[50],
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SaveRoundedIcon />}
            sx={{
              bgcolor: theme.palette.primary.main,
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              minWidth: { xs: '48%', sm: 160 },
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            Save User
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddUser
