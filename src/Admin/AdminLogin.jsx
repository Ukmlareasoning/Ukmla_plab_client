import { useState, useEffect } from 'react'
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
  useTheme,
} from '@mui/material'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import LoginIcon from '@mui/icons-material/Login'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'

// HD background: group of doctors studying / in discussion (replace with your own asset when ready)
const ADMIN_BG_IMAGE = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80'

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

function AdminLogin() {
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  // On mobile: lock body scroll and remove nav padding so no scrollbar or white area below
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 599px)').matches
    if (!isMobile) return
    const prevOverflow = document.body.style.overflow
    const prevPaddingBottom = document.body.style.paddingBottom
    document.body.style.overflow = 'hidden'
    document.body.style.paddingBottom = '0'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingBottom = prevPaddingBottom
    }
  }, [])

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    // Placeholder: wire to admin auth API
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: { xs: '100vh', sm: 'auto' },
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        overflowY: { xs: 'hidden', sm: 'visible' },
        position: { xs: 'fixed', sm: 'relative' },
        top: { xs: 0, sm: 'auto' },
        left: { xs: 0, sm: 'auto' },
        right: { xs: 0, sm: 'auto' },
        bottom: { xs: 0, sm: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, sm: 5, md: 6 },
        px: { xs: 1.5, sm: 2 },
        boxSizing: 'border-box',
        backgroundImage: `url(${ADMIN_BG_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.common.black, 0.5)} 0%, ${alpha(theme.palette.primary.dark, 0.4)} 100%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, px: { xs: 1.5, sm: 2 }, flex: { xs: 1, sm: 'none' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { xs: 0, sm: 'auto' } }}>
        {/* Platform branding above card */}
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            color: 'common.white',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            mb: { xs: 0.5, sm: 1 },
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            fontSize: { xs: '0.875rem', sm: '1.125rem' },
          }}
        >
          UKMLA · PLAB Reasoning Platform
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: alpha(theme.palette.common.white, 0.9),
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: '0.7rem', sm: '0.8125rem' },
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          Admin access
        </Typography>

        <Paper
          elevation={0}
          sx={{
            ...keyframes,
            p: { xs: 2, sm: 3.5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.6),
            bgcolor: 'background.paper',
            boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
            animation: 'scaleIn 0.5s ease-out forwards',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
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
          <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                mx: 'auto',
                mb: { xs: 1, sm: 1.5 },
              }}
            >
              <AdminPanelSettingsOutlinedIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Box>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              Admin login
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Sign in to the UKMLA PLAB Reasoning admin area
            </Typography>
          </Box>

          {/* Login form */}
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
              sx={{ ...inputSx(theme), mb: { xs: 1.5, sm: 2 } }}
              placeholder="admin@example.com"
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
              sx={{ ...inputSx(theme), mb: { xs: 2, sm: 3 } }}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              sx={{
                py: { xs: 1.25, sm: 1.5 },
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                },
              }}
            >
              Sign in
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default AdminLogin
