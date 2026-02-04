import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import { useState } from 'react'

const SIDEBAR_WIDTH = 260

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { path: '/admin/users', label: 'Users', icon: <PeopleRoundedIcon /> },
  { path: '/admin/contacts', label: 'Contacts', icon: <ContactMailRoundedIcon /> },
]

function AdminLayout() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => setMobileOpen((v) => !v)
  const handleNav = (path) => {
    navigate(path)
    if (isMobile) setMobileOpen(false)
  }

  // Same gradient as Sign In button
  const signInButtonGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: signInButtonGradient,
      }}
    >
      {/* Sidebar header — white text on teal */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
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
            bgcolor: alpha(theme.palette.common.white, 0.2),
            color: 'primary.contrastText',
          }}
        >
          <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.contrastText', lineHeight: 1.2 }}>
            Admin
          </Typography>
          <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.85) }}>
            UKMLA PLAB Reasoning
          </Typography>
        </Box>
      </Box>

      {/* Nav list — active = white pill; inactive = light background + white text */}
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
                bgcolor: !isActive ? alpha(theme.palette.common.white, 0.1) : undefined,
                '&.Mui-selected': {
                  bgcolor: theme.palette.common.white,
                  color: theme.palette.primary.dark,
                  boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.15)}`,
                  '&:hover': {
                    bgcolor: theme.palette.grey[50],
                    color: theme.palette.primary.dark,
                    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.18)}`,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.dark,
                  },
                },
                '&:hover': {
                  bgcolor: !isActive ? alpha(theme.palette.common.white, 0.18) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? theme.palette.primary.dark : alpha(theme.palette.common.white, 0.9),
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isActive ? theme.palette.primary.dark : 'inherit',
                }}
                sx={{ color: isActive ? theme.palette.primary.dark : alpha(theme.palette.common.white, 0.95) }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App bar for mobile — same as Sign In button color */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: 'block', md: 'none' },
          background: signInButtonGradient,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56 } }}>
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'inherit' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24, color: 'inherit' }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'inherit' }}>
              UKMLA PLAB · Admin
            </Typography>
          </Box>
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

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        {/* Header — same as Sign In button color */}
        <Box
          component="header"
          sx={{
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            background: signInButtonGradient,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.dark, 0.25)}`,
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
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  color: 'primary.contrastText',
                }}
              >
                <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.contrastText', lineHeight: 1.2 }}>
                  UKMLA PLAB Reasoning
                </Typography>
                <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.85) }}>
                  Admin dashboard
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </Box>

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            pt: { xs: 8, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>

        {/* One-line Admin footer — same as Sign In button color */}
        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            py: 1.5,
            px: { xs: 2, md: 3 },
            background: signInButtonGradient,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'primary.contrastText', fontWeight: 500 }}>
            UKMLA PLAB Reasoning Platform · Admin © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
