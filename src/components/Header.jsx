import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  useTheme,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'

const navItems = [
  { label: 'Home', to: '/', href: null, isRoute: true, Icon: HomeRoundedIcon },
  { label: 'Courses', to: '/courses', href: null, isRoute: true, Icon: AutoStoriesRoundedIcon },
  { label: 'Other Services', to: '/other-services', href: null, isRoute: true, Icon: WidgetsRoundedIcon },
  { label: 'About Us', to: '/about-us', href: null, isRoute: true, Icon: GroupsRoundedIcon },
  { label: 'Contact Us', to: '/contact-us', href: null, isRoute: true, Icon: ContactPageRoundedIcon },
]

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const pathname = location.pathname

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const isActive = (item) => item.isRoute && item.to === pathname

  const iconSize = 22
  const getNavButtonSx = (item) => {
    const active = isActive(item)
    return {
      color: active ? 'primary.contrastText' : 'text.primary',
      minWidth: 'auto',
      px: { xs: 1.5, sm: 1.75, lg: 2 },
      py: 0.875,
      fontWeight: active ? 600 : 500,
      fontSize: { xs: '1rem', sm: '1.0625rem' },
      bgcolor: active ? 'primary.main' : 'transparent',
      borderRadius: 1,
      textTransform: 'none',
      '&:hover': {
        color: active ? 'primary.contrastText' : 'primary.main',
        bgcolor: active ? 'primary.dark' : 'rgba(45, 95, 76, 0.08)',
      },
      '& .MuiButton-startIcon': {
        mr: 0.875,
      },
      '& .MuiButton-startIcon .MuiSvgIcon-root': {
        fontSize: iconSize,
        color: active ? 'primary.contrastText' : 'inherit',
      },
    }
  }

  const drawer = (
    <Box sx={{ width: 300, height: '100%', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          onClick={mobileOpen ? handleDrawerToggle : undefined}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Typography component="span" sx={{ fontWeight: 900, color: 'text.primary', fontSize: '1.5rem', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              UKML
            </Typography>
            <Typography component="span" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.5rem', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              PLAB
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.35 }}>
            <Box sx={{ width: 14, height: 1.5, bgcolor: 'text.primary' }} />
            <Typography component="span" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              REASONING
            </Typography>
            <Box sx={{ width: 12, height: 1, bgcolor: 'text.primary' }} />
          </Box>
        </Box>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 1, '& .MuiListItemButton-root': { mb: 0.5 } }}>
        {navItems.map((item) => {
          const Icon = item.Icon
          const active = isActive(item)
          const activeSx = active
            ? { bgcolor: 'primary.main', color: 'primary.contrastText' }
            : {}
          return item.isRoute ? (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={handleDrawerToggle}
                sx={{ py: 1.5, borderRadius: 1, mx: 1, ...activeSx }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon sx={{ color: active ? 'primary.contrastText' : 'primary.main', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: '0.9375rem' }}
                />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{ py: 1.5, borderRadius: 1, mx: 1, ...activeSx }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon sx={{ color: active ? 'primary.contrastText' : 'primary.main', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9375rem' }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Box sx={{ p: 2, mt: 1, borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PersonOutlineRoundedIcon sx={{ fontSize: 20 }} />}
          sx={{ fontSize: '0.9375rem', py: 1.125, textTransform: 'none' }}
          onClick={handleDrawerToggle}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          width: '100vw',
          maxWidth: '100%',
          left: 0,
          right: 0,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          bgcolor: '#FAFBFB',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: '100%',
            minWidth: '100%',
            maxWidth: '100%',
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 0.75, sm: 1 },
            minHeight: { xs: 56, sm: 64 },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo — professional stacked style */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              '&:hover .logo-line': { opacity: 0.8 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.2, sm: 0.35 } }}>
              <Typography
                className="logo-main"
                component="span"
                sx={{
                  fontWeight: 900,
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '1.65rem', md: '1.85rem' },
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                }}
              >
                UKMLA
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontWeight: 900,
                  color: 'primary.main',
                  fontSize: { xs: '1.5rem', sm: '1.65rem', md: '1.85rem' },
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                }}
              >
                PLAB
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <Box className="logo-line" sx={{ width: 14, height: 1.5, bgcolor: 'text.primary', opacity: 0.8 }} />
              <Typography
                className="logo-sub"
                component="span"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                  letterSpacing: '0.2em',
                  lineHeight: 1.1,
                }}
              >
                REASONING
              </Typography>
              <Box className="logo-line" sx={{ width: 14, height: 1.5, bgcolor: 'text.primary', opacity: 0.8 }} />
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.25, sm: 1.5, md: 2 },
                flexWrap: 'wrap',
                justifyContent: 'center',
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

          {/* Auth - Sign In only (Desktop) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<PersonOutlineRoundedIcon sx={{ fontSize: iconSize }} />}
                sx={{ fontWeight: 600, fontSize: '1rem', py: 0.875, textTransform: 'none' }}
              >
                Sign In
              </Button>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: 'primary.main' }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { borderRadius: '16px 0 0 16px' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Header
