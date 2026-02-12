import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  useScrollTrigger,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MobileBottomNav from './MobileBottomNav'
import { IS_USER_LOGGED_IN } from '../constants/auth'

// Page primary color (replaces green/teal)
const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

// Placeholder user avatar (replace with real user image when auth is ready)
const USER_AVATAR = 'https://i.pravatar.cc/80?img=1'

const navItems = [
  { label: 'Home', to: '/', href: null, isRoute: true, Icon: HomeRoundedIcon },
  { label: 'Courses', to: '/courses', href: null, isRoute: true, Icon: AutoStoriesRoundedIcon },
  { label: 'AI Tutor', to: '/ai-tutor', href: null, isRoute: true, Icon: SmartToyRoundedIcon },
  { label: 'Other Services', to: '/other-services', href: null, isRoute: true, Icon: WidgetsRoundedIcon },
  { label: 'About Us', to: '/about-us', href: null, isRoute: true, Icon: GroupsRoundedIcon },
  { label: 'Contact Us', to: '/contact-us', href: null, isRoute: true, Icon: ContactPageRoundedIcon },
]

// Scroll threshold to trigger "scrolled" state (glassmorphism / shadow)
const SCROLL_THRESHOLD = 8


function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()

  const handleUserMenuOpen = (e) => setUserMenuAnchor(e.currentTarget)
  const handleUserMenuClose = () => setUserMenuAnchor(null)
  const handleUserDashboard = () => {
    handleUserMenuClose()
    setMobileOpen(false)
    navigate('/user-dashboard')
  }
  const handleSettings = () => {
    handleUserMenuClose()
    setMobileOpen(false)
    navigate('/settings')
  }
  const handleLogout = () => {
    handleUserMenuClose()
    setMobileOpen(false)
    // TODO: clear auth state when backend is ready
    navigate('/')
  }

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: SCROLL_THRESHOLD,
  })

  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const isActive = (item) => item.isRoute && item.to === pathname

  const iconSize = 22
  const getNavButtonSx = (item) => {
    const active = isActive(item)
    return {
      color: active ? '#fff' : 'text.primary',
      minWidth: 'auto',
      px: { xs: 1.5, sm: 1.75, lg: 2.25 },
      py: 1,
      fontWeight: active ? 700 : 500,
      fontSize: { xs: '0.9375rem', sm: '1rem' },
      bgcolor: active ? PAGE_PRIMARY : 'transparent',
      background: active
        ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`
        : undefined,
      borderRadius: '7px',
      textTransform: 'none',
      boxShadow: active ? `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}` : 'none',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        color: active ? '#fff' : PAGE_PRIMARY,
        bgcolor: active ? PAGE_PRIMARY_DARK : alpha(PAGE_PRIMARY, 0.08),
        background: active ? `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)` : undefined,
        boxShadow: active ? `0 6px 20px ${alpha(PAGE_PRIMARY, 0.4)}` : `0 2px 12px ${alpha(PAGE_PRIMARY, 0.15)}`,
        transform: 'translateY(-1px)',
      },
      '& .MuiButton-startIcon': {
        mr: 1,
      },
      '& .MuiButton-startIcon .MuiSvgIcon-root': {
        fontSize: iconSize,
        color: active ? '#fff' : 'inherit',
      },
    }
  }

  const drawer = (
    <Box
      sx={{
        width: 320,
        height: '100%',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.12)',
      }}
    >
      {/* Drawer header with gradient accent */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          borderBottom: '2px solid',
          borderColor: PAGE_PRIMARY,
          background: alpha(PAGE_PRIMARY, 0.04),
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.25,
            transition: 'all 0.3s ease',
              '&:hover': {
              transform: 'translateX(-2px)',
              '& .mobile-logo-badge': {
                transform: 'scale(1.05)',
                boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.3)}`,
              },
            },
          }}
          onClick={mobileOpen ? handleDrawerToggle : undefined}
        >
          {/* Mobile Badge */}
          <Box
            className="mobile-logo-badge"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '7px',
              background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 50%, ${PAGE_PRIMARY_DARK} 100%)`,
              boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.2)}`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: 900,
                color: '#FFFFFF',
                fontSize: '1.2rem',
                letterSpacing: '0.05em',
                lineHeight: 1,
                position: 'relative',
                zIndex: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              UP
            </Typography>
          </Box>

          {/* Mobile Text Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.35 }}>
              <Typography 
                component="span" 
                sx={{ 
                  fontWeight: 800, 
                  color: 'text.primary', 
                  fontSize: '1.5rem', 
                  letterSpacing: '0.02em', 
                  lineHeight: 1.1 
                }}
              >
                UKMLA
              </Typography>
              <Typography 
                component="span" 
                sx={{ 
                  fontWeight: 800, 
                  background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem', 
                  letterSpacing: '0.02em', 
                  lineHeight: 1.1 
                }}
              >
                PLAB
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.65, mt: 0.35 }}>
              <Box 
                sx={{ 
                  width: 14, 
                  height: 2, 
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, transparent 0%, ${PAGE_PRIMARY} 50%, transparent 100%)`,
                }} 
              />
              <Typography 
                component="span" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.secondary', 
                  fontSize: '0.8rem', 
                  letterSpacing: '0.2em' 
                }}
              >
                REASONING
              </Typography>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 2, 
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, transparent 0%, ${PAGE_PRIMARY} 50%, transparent 100%)`,
                }} 
              />
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          size="medium"
          sx={{
            borderRadius: '7px',
            bgcolor: alpha(PAGE_PRIMARY, 0.08),
            '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.15) },
            transition: 'background 0.2s',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2, px: 1.5, '& .MuiListItemButton-root': { mb: 0.75, borderRadius: '7px' } }}>
        {navItems.map((item) => {
          const Icon = item.Icon
          const active = isActive(item)
          const activeSx = active
            ? {
                background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                color: '#fff',
                boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
              }
            : {}
          return item.isRoute ? (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={handleDrawerToggle}
                sx={{ py: 1.75, px: 2, ...activeSx, transition: 'all 0.2s' }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Icon sx={{ color: active ? '#fff' : PAGE_PRIMARY, fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '1rem' }}
                />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{ py: 1.75, px: 2, ...activeSx, transition: 'all 0.2s' }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Icon sx={{ color: active ? '#fff' : PAGE_PRIMARY, fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      {/* On mobile, profile (Dashboard/Settings/Logout) is in MobileBottomNav — only show Sign In here when logged out */}
      {!IS_USER_LOGGED_IN && (
        <Box sx={{ p: 2.5, mt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
          <Button
            component={Link}
            to="/sign-in"
            variant="contained"
            fullWidth
            startIcon={<PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />}
            sx={{
              fontSize: '1rem',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '7px',
              bgcolor: PAGE_PRIMARY,
              background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
              color: '#fff',
              boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
              '&:hover': {
                bgcolor: PAGE_PRIMARY_DARK,
                background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`,
                boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.4)}`,
              },
            }}
            onClick={handleDrawerToggle}
          >
            Sign In
          </Button>
        </Box>
      )}
    </Box>
  )

  const toolbarHeight = { xs: 64, sm: 72 }

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: '100%',
          left: 0,
          right: 0,
          top: 0,
          zIndex: theme.zIndex.appBar,
          bgcolor: trigger
            ? alpha(theme.palette.background.paper, 0.85)
            : alpha(theme.palette.background.paper, 0.98),
          backdropFilter: trigger ? 'blur(16px) saturate(180%)' : 'blur(8px)',
          WebkitBackdropFilter: trigger ? 'blur(16px) saturate(180%)' : 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: trigger ? alpha(PAGE_PRIMARY, 0.12) : 'grey.200',
          boxShadow: trigger
            ? `0 4px 24px rgba(15, 23, 42, 0.08), 0 1px 0 ${alpha(PAGE_PRIMARY, 0.06)}`
            : '0 1px 0 rgba(15, 23, 42, 0.04)',
          transition: 'background 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: '100%',
            maxWidth: 1400,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: 0,
            minHeight: toolbarHeight,
            justifyContent: 'space-between',
          }}
        >
          {/* Logo — premium design with gradient badge and modern typography */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.25 },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                transform: 'translateY(-2px)',
                '& .logo-badge': {
                  transform: 'scale(1.05) rotate(2deg)',
                  boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.25)}`,
                },
                '& .logo-main': {
                  color: PAGE_PRIMARY_DARK,
                },
                '& .logo-accent': {
                  background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 50%, ${PAGE_PRIMARY_DARK} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                },
              },
            }}
          >
            {/* Badge/Icon Container */}
            <Box
              className="logo-badge"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 44, sm: 50, md: 56 },
                height: { xs: 44, sm: 50, md: 56 },
                borderRadius: '7px',
                background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 50%, ${PAGE_PRIMARY_DARK} 100%)`,
                boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.2)}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  pointerEvents: 'none',
                },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 900,
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                UP
              </Typography>
            </Box>

            {/* Text Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: { xs: 0.3, sm: 0.4 }, flexWrap: 'nowrap' }}>
                <Typography
                  className="logo-main"
                  component="span"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    fontSize: { xs: '1.4rem', sm: '1.65rem', md: '1.85rem' },
                    letterSpacing: { xs: '0.02em', sm: '0.03em' },
                    lineHeight: 1,
                    transition: 'color 0.3s ease',
                  }}
                >
                  UKMLA
                </Typography>
                <Typography
                  className="logo-accent"
                  component="span"
                  sx={{
                    fontWeight: 800,
                    color: PAGE_PRIMARY,
                    fontSize: { xs: '1.4rem', sm: '1.65rem', md: '1.85rem' },
                    letterSpacing: { xs: '0.02em', sm: '0.03em' },
                    lineHeight: 1,
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  PLAB
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 0.5, sm: 0.65 }, 
                  mt: { xs: 0.25, sm: 0.35 },
                  opacity: 0.85,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 12, sm: 16 },
                    height: 2,
                    borderRadius: '7px',
                    background: `linear-gradient(90deg, transparent 0%, ${PAGE_PRIMARY} 50%, transparent 100%)`,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
                    letterSpacing: { xs: '0.15em', sm: '0.2em' },
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  REASONING
                </Typography>
                <Box
                  sx={{
                    width: { xs: 10, sm: 14 },
                    height: 2,
                    borderRadius: '7px',
                    background: `linear-gradient(90deg, transparent 0%, ${PAGE_PRIMARY} 50%, transparent 100%)`,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Desktop Navigation — pill-style nav */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.75, sm: 1, md: 1.25 },
                flexWrap: 'wrap',
                justifyContent: 'center',
                px: 2,
                py: 1,
                borderRadius: '7px',
                bgcolor: alpha(theme.palette.grey[500], 0.04),
                border: '1px solid',
                borderColor: alpha(theme.palette.grey[500], 0.08),
              }}
            >
              {navItems.map((item) => {
                const Icon = item.Icon
                return item.isRoute ? (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.to}
                    startIcon={<Icon sx={{ fontSize: iconSize }} />}
                    sx={getNavButtonSx(item)}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.label}
                    component="a"
                    href={item.href}
                    startIcon={<Icon sx={{ fontSize: iconSize }} />}
                    sx={getNavButtonSx(item)}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Box>
          )}

          {/* Desktop: IS_USER_LOGGED_IN TRUE = avatar + dropdown, FALSE = Sign In */}
          {!isMobile && IS_USER_LOGGED_IN && (
            <>
              <IconButton
                onClick={handleUserMenuOpen}
                aria-label="User menu"
                aria-controls={userMenuAnchor ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuAnchor ? 'true' : undefined}
                sx={{
                  p: 0.5,
                  borderRadius: '7px',
                  '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                }}
              >
                <Avatar
                  src={USER_AVATAR}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: PAGE_PRIMARY,
                    border: `2px solid ${alpha(PAGE_PRIMARY, 0.2)}`,
                  }}
                />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.5,
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
                  <ListItemIcon><DashboardRoundedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="User Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                  <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 600 }} />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutRoundedIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} sx={{ color: 'error.main' }} />
                </MenuItem>
              </Menu>
            </>
          )}
          {!isMobile && !IS_USER_LOGGED_IN && (
            <Button
              component={Link}
              to="/sign-in"
              variant="outlined"
              size="medium"
              startIcon={<PersonOutlineRoundedIcon sx={{ fontSize: iconSize }} />}
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                py: 1.25,
                px: 2.5,
                textTransform: 'none',
                borderRadius: '7px',
                borderWidth: 2,
                borderColor: PAGE_PRIMARY,
                color: PAGE_PRIMARY,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: PAGE_PRIMARY_DARK,
                  bgcolor: alpha(PAGE_PRIMARY, 0.08),
                  color: PAGE_PRIMARY_DARK,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.2)}`,
                },
              }}
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu — premium icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              aria-label="Open menu"
              sx={{
                borderRadius: '7px',
                color: PAGE_PRIMARY,
                bgcolor: alpha(PAGE_PRIMARY, 0.08),
                width: 44,
                height: 44,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(PAGE_PRIMARY, 0.15),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Spacer so page content starts below fixed header */}
      <Box sx={{ minHeight: toolbarHeight }} />

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          slotProps: {
            backdrop: {
              sx: {
                backdropFilter: 'blur(6px)',
                bgcolor: alpha(theme.palette.common.black, 0.4),
              },
            },
          },
        }}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: '20px 0 0 20px',
            borderLeft: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.2),
            boxShadow: '-8px 0 40px rgba(15, 23, 42, 0.15)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile bottom nav: Home, Courses, and Sign In or Dashboard based on IS_USER_LOGGED_IN */}
      {isMobile && <MobileBottomNav isLoggedIn={IS_USER_LOGGED_IN} />}
    </>
  )
}

export default Header
