import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded'
import { useState, useEffect } from 'react'

const SIDEBAR_WIDTH = 260

// Dummy avatar image for admin header (replace with real user image when needed)
const ADMIN_AVATAR_IMAGE = 'https://i.pravatar.cc/80'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { path: '/admin/users', label: 'Users', icon: <PeopleRoundedIcon /> },
]

const settingsSubItems = [
  { path: '/admin/users/add', label: 'Profile', icon: <PersonRoundedIcon /> },
  { path: '/admin/services', label: 'Services', icon: <DesignServicesRoundedIcon /> },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: <SubscriptionsRoundedIcon /> },
  { path: '/admin/contacts', label: 'Contacts', icon: <ContactMailRoundedIcon /> },
]

function AdminLayout() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileAnchor, setProfileAnchor] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // On mobile: remove body padding reserved for bottom nav so footer sits at absolute end
  useEffect(() => {
    const isMobileView = window.matchMedia('(max-width: 899px)').matches
    if (!isMobileView) return
    const prev = document.body.style.paddingBottom
    document.body.style.paddingBottom = '0'
    return () => {
      document.body.style.paddingBottom = prev
    }
  }, [])

  const handleDrawerToggle = () => setMobileOpen((v) => !v)
  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget)
  const handleProfileClose = () => setProfileAnchor(null)
  const handleLogout = () => {
    handleProfileClose()
    navigate('/admin')
  }
  const handleSettings = () => {
    handleProfileClose()
    navigate('/admin/users/add')
  }
  const handleNav = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  // Theme tint over grey: more prominent but still clean
  const sidebarBg = theme.palette.grey[100]
  const sidebarTint = `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
  const headerBg = theme.palette.grey[50]
  const headerTint = `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, transparent 100%)`
  const footerBg = theme.palette.grey[100]
  const footerTint = `linear-gradient(0deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, transparent 100%)`

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: sidebarBg,
        backgroundImage: sidebarTint,
        borderRight: '1px solid',
        borderColor: theme.palette.grey[300],
        boxShadow: `2px 0 12px ${alpha(theme.palette.common.black, 0.04)}`,
      }}
    >
      {/* Sidebar header — distinct strip */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderBottom: '1px solid',
          borderColor: theme.palette.grey[200],
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
          }}
        >
          <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            Admin
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            UKMLA PLAB Reasoning
          </Typography>
        </Box>
      </Box>

      {/* Nav list — active = primary pill; inactive = light tint + dark text */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mb: 0.75,
                bgcolor: !isActive ? alpha(theme.palette.primary.main, 0.08) : undefined,
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: `0 3px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                    color: theme.palette.primary.contrastText,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
                '&:hover': {
                  bgcolor: !isActive ? alpha(theme.palette.primary.main, 0.1) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? theme.palette.primary.contrastText : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isActive ? undefined : 'text.primary',
                }}
                sx={{ color: isActive ? theme.palette.primary.contrastText : undefined }}
              />
            </ListItemButton>
          )
        })}

        {/* Settings — dropdown with Profile & Services */}
        <ListItemButton
          onClick={() => setSettingsOpen((o) => !o)}
          sx={{
            borderRadius: 2,
            mb: 0.75,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9375rem',
              color: 'text.primary',
            }}
          />
          {settingsOpen ? <ExpandLess sx={{ color: 'text.secondary' }} /> : <ExpandMore sx={{ color: 'text.secondary' }} />}
        </ListItemButton>
        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2, pr: 1.5 }}>
            {settingsSubItems.map((sub) => {
              const isSubActive = location.pathname === sub.path
              return (
                <ListItemButton
                  key={sub.path}
                  onClick={() => handleNav(sub.path)}
                  selected={isSubActive}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    py: 0.75,
                    bgcolor: !isSubActive ? 'transparent' : undefined,
                    '&.Mui-selected': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.35)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        color: theme.palette.primary.contrastText,
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.contrastText,
                      },
                    },
                    '&:hover': {
                      bgcolor: !isSubActive ? alpha(theme.palette.primary.main, 0.08) : undefined,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isSubActive ? theme.palette.primary.contrastText : 'text.secondary' }}>
                    {sub.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontWeight: isSubActive ? 700 : 500,
                      fontSize: '0.875rem',
                      color: isSubActive ? undefined : 'text.primary',
                    }}
                    sx={{ color: isSubActive ? theme.palette.primary.contrastText : undefined }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: { xs: '100dvh', md: '100vh' },
        height: { xs: '100dvh', md: 'auto' },
        maxHeight: { xs: '100dvh', md: 'none' },
        bgcolor: 'background.default',
        overflow: 'hidden',
        position: { xs: 'fixed', md: 'relative' },
        top: { xs: 0, md: 'unset' },
        left: { xs: 0, md: 'unset' },
        right: { xs: 0, md: 'unset' },
        bottom: { xs: 0, md: 'unset' },
      }}
    >
      {/* App bar for mobile — light theme tint */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: 'block', md: 'none' },
          bgcolor: headerBg,
          backgroundImage: headerTint,
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: theme.palette.grey[300],
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56 }, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
              UKMLA PLAB · Admin
            </Typography>
          </Box>
          <IconButton
            onClick={handleProfileOpen}
            size="small"
            aria-controls={profileAnchor ? 'admin-profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={profileAnchor ? 'true' : undefined}
            sx={{ p: 0.5 }}
          >
            <Avatar
              src={ADMIN_AVATAR_IMAGE}
              alt="Admin"
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                color: 'primary.contrastText',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar: permanent on desktop, temporary on mobile */}
      <Box
        component="nav"
        sx={{
          width: { md: SIDEBAR_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              top: { xs: 56, md: 0 },
              height: { xs: 'calc(100% - 56px)', md: '100%' },
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              top: 0,
              height: '100%',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content — on mobile: only inner content scrolls, footer at bottom; on desktop: full height, scrolls as needed */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: { xs: 0, md: '100vh' },
          minWidth: 0,
          overflow: { xs: 'hidden', md: 'auto' },
        }}
      >
        {/* Header — light theme tint */}
        <Box
          component="header"
          sx={{
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            bgcolor: headerBg,
            backgroundImage: headerTint,
            borderBottom: '1px solid',
            borderColor: theme.palette.grey[300],
            boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.06)}`,
          }}
        >
          <Toolbar
            sx={{
              minHeight: 64,
              px: { md: 3 },
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                  UKMLA PLAB Reasoning
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Admin dashboard
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleProfileOpen}
              size="small"
              aria-controls={profileAnchor ? 'admin-profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={profileAnchor ? 'true' : undefined}
              sx={{ p: 0.5 }}
            >
              <Avatar
                src={ADMIN_AVATAR_IMAGE}
                alt="Admin"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Toolbar>
        </Box>

        {/* Page content — scrollable on mobile so footer stays at bottom of viewport */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: { xs: 'auto', md: 'visible' },
            WebkitOverflowScrolling: 'touch',
            p: { xs: 2, sm: 3 },
            pt: { xs: 8, md: 3 },
            pb: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.background.default,
          }}
        >
          <Outlet />
        </Box>

        {/* One-line Admin footer — at bottom of viewport on mobile, no white space below */}
        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            py: 1.5,
            px: { xs: 2, md: 3 },
            bgcolor: footerBg,
            backgroundImage: footerTint,
            borderTop: '1px solid',
            borderColor: theme.palette.grey[300],
            boxShadow: `0 -2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            UKMLA PLAB Reasoning Platform · Admin © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>

      {/* Profile menu — Settings & Logout */}
      <Menu
        id="admin-profile-menu"
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: 2,
              border: '1px solid',
              borderColor: theme.palette.grey[200],
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
              '& .MuiMenuItem-root': {
                py: 1.25,
                gap: 1.5,
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleSettings}>
          <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }} />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }} />
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default AdminLayout
