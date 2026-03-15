import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutSuccess } from '../store/authSlice'
import apiClient from '../server'
import { useToast } from './ToastProvider'
import { alpha } from '@mui/material/styles'
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

const BOTTOM_NAV_HEIGHT = 72
const PAGE_PRIMARY = '#384D84'

const IMAGE_BASE_URL =
  import.meta.env.VITE_API_IMAGE_UPLOAD_BASE_URL || 'http://127.0.0.1:8000/'

const bottomNavItemsSignedOut = [
  { label: 'Scenarios', to: '/scenarios', value: '/scenarios', Icon: AutoStoriesRoundedIcon },
  { label: 'Mocks', to: '/courses', value: '/courses', Icon: MenuBookRoundedIcon },
  { label: 'Notes', to: '/notes', value: '/notes', Icon: MenuBookRoundedIcon },
  { label: 'Login', to: '/sign-in', value: 'sign-in', Icon: PersonOutlineRoundedIcon },
]

const bottomNavItemsSignedInNavOnly = [
  { label: 'Scenarios', to: '/scenarios', value: '/scenarios', Icon: AutoStoriesRoundedIcon },
  { label: 'Mocks', to: '/courses', value: '/courses', Icon: MenuBookRoundedIcon },
  { label: 'Notes', to: '/notes', value: '/notes', Icon: MenuBookRoundedIcon },
]

function MobileBottomNav() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const authUser = useSelector((state) => state.auth.user)
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)

  const userInitials = authUser
    ? `${authUser.first_name?.[0] ?? ''}${authUser.last_name?.[0] ?? ''}`.toUpperCase()
    : ''

  const profileImageUrl =
    authUser?.profile_image && typeof authUser.profile_image === 'string'
      ? `${IMAGE_BASE_URL.replace(/\/+$/, '/')}${authUser.profile_image.replace(/^\/+/, '')}`
      : undefined

  const thirdValue = isLoggedIn ? '/user-dashboard' : 'sign-in'
  const currentValue =
    pathname === '/scenarios' || pathname.startsWith('/scenarios/')
      ? '/scenarios'
      : pathname === '/courses'
        ? '/courses'
        : pathname === '/notes' || pathname.startsWith('/notes/')
          ? '/notes'
          : (pathname === '/user-dashboard' || pathname === '/settings') && isLoggedIn
            ? '/user-dashboard'
            : pathname === '/sign-in'
              ? 'sign-in'
              : thirdValue

  const openProfileMenu = (e) => {
    e.preventDefault()
    setProfileMenuAnchor(e.currentTarget)
  }
  const closeProfileMenu = () => setProfileMenuAnchor(null)
  const handleUserDashboard = () => {
    closeProfileMenu()
    navigate('/user-dashboard')
  }
  const handleSettings = () => {
    closeProfileMenu()
    navigate('/settings')
  }
  const handleLogout = async () => {
    closeProfileMenu()
    try {
      await apiClient('/auth/logout', 'POST')
    } catch {
      // proceed with local logout even if request fails
    }
    dispatch(logoutSuccess())
    showToast('Logged out successfully.', 'success')
    navigate('/')
  }

  if (!isMobile) return null

  const navSx = {
    height: BOTTOM_NAV_HEIGHT,
    bgcolor: alpha(theme.palette.background.paper, 0.98),
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderTop: '1px solid',
    borderColor: alpha(PAGE_PRIMARY, 0.15),
    boxShadow: '0 -8px 32px rgba(15, 23, 42, 0.1), 0 -1px 0 rgba(0,0,0,0.04)',
    gap: 0.5,
    px: 0.5,
    '& .MuiBottomNavigationAction-root': {
      minWidth: 72,
      py: 1.5,
      px: 1,
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: '0.7rem',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '7px',
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.7rem',
        fontWeight: 500,
        mt: 0.5,
        transition: 'all 0.25s',
      },
      '& .MuiSvgIcon-root': {
        fontSize: 28,
        transition: 'transform 0.25s',
      },
      '&.Mui-selected': {
        color: PAGE_PRIMARY,
        bgcolor: alpha(PAGE_PRIMARY, 0.1),
        borderRadius: '7px',
        mx: 0.25,
        '& .MuiBottomNavigationAction-label': {
          fontWeight: 700,
          fontSize: '0.75rem',
          color: PAGE_PRIMARY,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: PAGE_PRIMARY,
          },
        },
        '& .MuiSvgIcon-root': {
          color: PAGE_PRIMARY,
        },
      },
    },
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar - 1,
        display: { xs: 'block', md: 'none' },
        pb: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      <BottomNavigation value={currentValue} showLabels sx={navSx}>
        {isLoggedIn
          ? [
              ...bottomNavItemsSignedInNavOnly.map((item) => {
                const Icon = item.Icon
                return (
                  <BottomNavigationAction
                    key={item.value}
                    component={Link}
                    to={item.to}
                    label={item.label}
                    value={item.value}
                    icon={<Icon sx={{ fontSize: 26 }} />}
                  />
                )
              }),
              <BottomNavigationAction
                key="/user-dashboard"
                value="/user-dashboard"
                label=" "
                aria-label="Profile menu"
                aria-controls={profileMenuAnchor ? 'profile-menu' : undefined}
                aria-haspopup="true"
                onClick={openProfileMenu}
                icon={
                  <Avatar
                    src={profileImageUrl}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: PAGE_PRIMARY,
                      border: `2px solid ${alpha(PAGE_PRIMARY, 0.3)}`,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {!authUser?.profile_image && userInitials}
                  </Avatar>
                }
                sx={{
                  minWidth: 72,
                  '& .MuiBottomNavigationAction-label': {
                    display: 'none !important',
                    visibility: 'hidden',
                  },
                }}
              />,
            ]
          : bottomNavItemsSignedOut.map((item) => {
              const Icon = item.Icon
              return (
                <BottomNavigationAction
                  key={item.value}
                  component={Link}
                  to={item.to}
                  label={item.label}
                  value={item.value}
                  icon={<Icon sx={{ fontSize: 26 }} />}
                />
              )
            })}
      </BottomNavigation>

      <Menu
        id="profile-menu"
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={closeProfileMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: -2,
              minWidth: 200,
              borderRadius: '7px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.12),
            },
          },
        }}
      >
        <MenuItem onClick={handleUserDashboard}>
          <ListItemIcon>
            <DashboardRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="User Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600 }} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} sx={{ color: 'error.main' }} />
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MobileBottomNav
export { BOTTOM_NAV_HEIGHT }
