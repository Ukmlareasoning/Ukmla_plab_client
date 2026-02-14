import { useState, useEffect, useRef } from 'react'
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
  Collapse,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ContactPageRoundedIcon from '@mui/icons-material/ContactPageRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import MobileBottomNav from './MobileBottomNav'
import { IS_USER_LOGGED_IN } from '../constants/auth'

// Header color scheme (matches image: deep royal blue, gold accents)
const HEADER_BG = '#1e3a5f'
const PAGE_PRIMARY = HEADER_BG
const PAGE_PRIMARY_DARK = '#182d47'
const PAGE_PRIMARY_LIGHT = '#243b55'
const HEADER_BG_GRADIENT = 'linear-gradient(180deg, #243b55 0%, #1e3a5f 50%, #182d47 100%)'
const LOGO_RING = '#D4AF37'
const NAV_LINK_COLOR = '#ffffff'
const NAV_LINK_HOVER = 'rgba(255,255,255,0.9)'
const LOGIN_BTN_BG = '#FFD700'
const LOGIN_BTN_BG_HOVER = '#F5C400'
const LOGIN_BTN_TEXT = '#1a1a1a'
const SUBTITLE_COLOR = 'rgba(255,255,255,0.75)'

// Placeholder user avatar (replace with real user image when auth is ready)
const USER_AVATAR = 'https://i.pravatar.cc/80?img=1'

// Scenarios dropdown specialties (links to /scenarios?type=…)
const scenarioSpecialties = [
  'Cardiology', 'Respiratory', 'Neurology', 'Gastroenterology', 'Dermatology',
  'Endocrine', 'Musculoskeletal', 'Renal', 'Hematology', 'Immunology',
  'Infectious Disease', 'Psychiatry', 'Gynecology', 'Pediatrics',
  'Ophthalmology', 'ENT', 'Oncology',
]

// Nav items matching image: Scenarios, AI Examiner, Notes, Webinars, Pricing
const navItems = [
  { label: 'Scenarios', to: '/scenarios', isRoute: true, hasDropdown: true, Icon: AutoStoriesRoundedIcon },
  { label: 'AI Examiner', to: '/ai-tutor', isRoute: true, Icon: SmartToyRoundedIcon },
  { label: 'Notes', to: '/notes', isRoute: true, Icon: AutoStoriesRoundedIcon },
  { label: 'Webinars', to: '/webinars', isRoute: true, Icon: GroupsRoundedIcon },
  { label: 'Pricing', to: '/pricing', isRoute: true, Icon: ContactPageRoundedIcon },
]

// Explore More dropdown links (shown after Pricing)
const exploreMoreItems = [
  { label: 'Other Services', to: '/other-services', Icon: ExploreOutlinedIcon },
  { label: 'Mocks Exams', to: '/courses', Icon: SchoolRoundedIcon },
  { label: 'About Us', to: '/about-us', Icon: InfoOutlinedIcon },
  { label: 'Contact Us', to: '/contact-us', Icon: ContactMailRoundedIcon },
]

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [exploreMoreAnchor, setExploreMoreAnchor] = useState(null)
  const [scenariosAnchor, setScenariosAnchor] = useState(null)
  const [scenariosExpanded, setScenariosExpanded] = useState(false)
  const [exploreMoreExpanded, setExploreMoreExpanded] = useState(false)
  const exploreMoreCloseTimerRef = useRef(null)
  const scenariosCloseTimerRef = useRef(null)
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

  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const EXPLORE_MORE_CLOSE_DELAY = 350

  const handleExploreMoreOpen = (e) => {
    if (exploreMoreCloseTimerRef.current) {
      clearTimeout(exploreMoreCloseTimerRef.current)
      exploreMoreCloseTimerRef.current = null
    }
    setExploreMoreAnchor(e.currentTarget)
  }
  const handleExploreMoreClose = () => {
    if (exploreMoreCloseTimerRef.current) {
      clearTimeout(exploreMoreCloseTimerRef.current)
      exploreMoreCloseTimerRef.current = null
    }
    exploreMoreCloseTimerRef.current = setTimeout(() => {
      exploreMoreCloseTimerRef.current = null
      setExploreMoreAnchor(null)
    }, EXPLORE_MORE_CLOSE_DELAY)
  }
  const handleExploreMoreKeepOpen = () => {
    if (exploreMoreCloseTimerRef.current) {
      clearTimeout(exploreMoreCloseTimerRef.current)
      exploreMoreCloseTimerRef.current = null
    }
  }
  const handleExploreMoreItemClick = (to) => {
    setExploreMoreAnchor(null)
    setMobileOpen(false)
    navigate(to)
  }

  const SCENARIOS_CLOSE_DELAY = 400
  const handleScenariosOpen = (e) => {
    if (scenariosCloseTimerRef.current) {
      clearTimeout(scenariosCloseTimerRef.current)
      scenariosCloseTimerRef.current = null
    }
    setScenariosAnchor(e.currentTarget)
  }
  const handleScenariosClose = () => {
    if (scenariosCloseTimerRef.current) {
      clearTimeout(scenariosCloseTimerRef.current)
      scenariosCloseTimerRef.current = null
    }
    scenariosCloseTimerRef.current = setTimeout(() => {
      scenariosCloseTimerRef.current = null
      setScenariosAnchor(null)
    }, SCENARIOS_CLOSE_DELAY)
  }
  const handleScenariosKeepOpen = () => {
    if (scenariosCloseTimerRef.current) {
      clearTimeout(scenariosCloseTimerRef.current)
      scenariosCloseTimerRef.current = null
    }
  }
  const handleScenariosItemClick = (specialty) => {
    setScenariosAnchor(null)
    setMobileOpen(false)
    navigate(`/scenarios?type=${encodeURIComponent(specialty)}`)
  }
  const handleScenariosMainClick = () => {
    setScenariosAnchor(null)
    setMobileOpen(false)
    navigate('/scenarios')
  }

  const isActive = (item) => item.isRoute && item.to === pathname
  const isScenariosActive = pathname === '/scenarios' || pathname.startsWith('/scenarios/')
  const isExploreMoreActive = exploreMoreItems.some((item) => pathname === item.to)

  const drawer = (
    <Box
      sx={{
        width: 320,
        height: '100%',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.12)',
      }}
    >
      {/* Drawer header — dark blue bar, gold circular logo, white text, close X (matches image) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,0.1)',
          background: HEADER_BG_GRADIENT,
          bgcolor: HEADER_BG,
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
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 0.9 },
            minWidth: 0,
            flex: 1,
          }}
          onClick={mobileOpen ? handleDrawerToggle : undefined}
        >
          {/* Circular logo — yellow border, dark fill, white UP (same as main header) */}
          <Box
            className="mobile-logo-badge"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: HEADER_BG,
              border: `2px solid ${LOGO_RING}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              flexShrink: 0,
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
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              UP
            </Typography>
          </Box>

          {/* UKMLA Reasoning Examiner / UKMLA & PLAB Reasoning */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
            <Typography 
              component="span" 
              sx={{ 
                fontWeight: 700, 
                color: NAV_LINK_COLOR, 
                fontSize: '1.1rem', 
                letterSpacing: '0.02em', 
                lineHeight: 1.2,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              UKMLA Reasoning Examiner
            </Typography>
            <Typography 
              component="span" 
              sx={{ 
                fontWeight: 500, 
                color: SUBTITLE_COLOR, 
                fontSize: '0.75rem', 
                letterSpacing: '0.06em',
                mt: 0.25,
                display: 'block',
              }}
            >
              UKMLA & PLAB Reasoning
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="Close menu"
          size="large"
          sx={{
            flexShrink: 0,
            borderRadius: '50%',
            color: NAV_LINK_COLOR,
            bgcolor: 'rgba(255,255,255,0.12)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
            transition: 'background 0.2s',
            '& .MuiSvgIcon-root': { fontSize: '1.5rem' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2, px: 1.5, '& .MuiListItemButton-root': { mb: 0.75, borderRadius: '7px' } }}>
        {navItems.map((item) => {
          if (item.hasDropdown && item.label === 'Scenarios') {
            const ScenarioIcon = item.Icon
            const active = isScenariosActive
            const activeSx = active
              ? {
                  background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                  color: '#fff',
                  boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
                }
              : {}
            return (
              <ListItem key={item.label} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
                  <ListItemButton
                    component={Link}
                    to="/scenarios"
                    onClick={handleDrawerToggle}
                    sx={{ py: 1.75, px: 2, flex: 1, ...activeSx, transition: 'all 0.2s' }}
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <ScenarioIcon sx={{ color: active ? '#fff' : PAGE_PRIMARY, fontSize: 22 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Scenarios"
                      primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '1rem' }}
                    />
                  </ListItemButton>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setScenariosExpanded(!scenariosExpanded) }}
                    sx={{ color: active ? 'inherit' : PAGE_PRIMARY, alignSelf: 'center', mr: 0.5 }}
                  >
                    {scenariosExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                  </IconButton>
                </Box>
                <Collapse in={scenariosExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                {scenarioSpecialties.map((specialty) => {
                  const typeFromUrl = location.search ? new URLSearchParams(location.search).get('type') : null
                  const specActive = pathname === '/scenarios' && typeFromUrl === specialty
                  const specSx = specActive
                    ? {
                        background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                        color: '#fff',
                        boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
                      }
                    : {}
                  return (
                    <ListItem key={specialty} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={`/scenarios?type=${encodeURIComponent(specialty)}`}
                        onClick={handleDrawerToggle}
                        sx={{ py: 1.25, px: 2, pl: 3.5, ...specSx, transition: 'all 0.2s' }}
                      >
                        <ListItemText
                          primary={specialty}
                          primaryTypographyProps={{ fontWeight: specActive ? 600 : 500, fontSize: '0.95rem' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
                  </List>
                </Collapse>
              </ListItem>
            )
          }
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
        {/* Explore More — collapsible sub-links */}
        <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <Box
            component="div"
            role="button"
            tabIndex={0}
            onClick={() => setExploreMoreExpanded(!exploreMoreExpanded)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setExploreMoreExpanded((v) => !v)
              }
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              py: 1.25,
              px: 2,
              border: 'none',
              borderRadius: '7px',
              bgcolor: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06) },
            }}
          >
            <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: 'grey.600', letterSpacing: '0.06em' }}>
              Explore More
            </Typography>
            <Box component="span" sx={{ display: 'inline-flex', color: PAGE_PRIMARY, p: 0.5 }}>
              {exploreMoreExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
            </Box>
          </Box>
          <Collapse in={exploreMoreExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {exploreMoreItems.map((item) => {
                const Icon = item.Icon
                const active = pathname === item.to
                const activeSx = active
                  ? {
                      background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
                      color: '#fff',
                      boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
                    }
                  : {}
                return (
                  <ListItem key={item.label} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      onClick={handleDrawerToggle}
                      sx={{ py: 1.25, px: 2, pl: 3.5, ...activeSx, transition: 'all 0.2s' }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Icon sx={{ color: active ? '#fff' : PAGE_PRIMARY, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: '0.95rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
        </ListItem>
      </List>
      {/* On mobile, profile (Dashboard/Settings/Logout) is in MobileBottomNav — only show Log In here when logged out */}
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
              bgcolor: LOGIN_BTN_BG,
              color: LOGIN_BTN_TEXT,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: LOGIN_BTN_BG_HOVER,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              },
            }}
            onClick={handleDrawerToggle}
          >
            Log In
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
        elevation={0}
        sx={{
          width: '100%',
          left: 0,
          right: 0,
          top: 0,
          zIndex: theme.zIndex.appBar,
          background: HEADER_BG_GRADIENT,
          bgcolor: HEADER_BG,
          borderTop: '1px solid',
          borderColor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
          {/* Logo — circular with gold ring, matches image */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.25 },
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {/* Circular logo with gold ring */}
            <Box
              sx={{
                width: { xs: 40, sm: 46 },
                height: { xs: 40, sm: 46 },
                borderRadius: '50%',
                border: `2px solid ${LOGO_RING}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: HEADER_BG,
                flexShrink: 0,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 900,
                  color: '#FFFFFF',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                UP
              </Typography>
            </Box>

            {/* Title: UKMLA Reasoning Examiner */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  color: NAV_LINK_COLOR,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
                  letterSpacing: '0.02em',
                  lineHeight: 1.2,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                UKMLA Reasoning Examiner
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontWeight: 500,
                  color: SUBTITLE_COLOR,
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  letterSpacing: '0.1em',
                  lineHeight: 1.2,
                  mt: 0.25,
                }}
              >
                UKMLA & PLAB Reasoning
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation — simple white text links, matches image */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 2.5, md: 3 },
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {navItems.map((item) => {
                if (item.hasDropdown && item.label === 'Scenarios') {
                  const active = isScenariosActive
                  return (
                    <Button
                      key={item.label}
                      onMouseEnter={handleScenariosOpen}
                      onMouseLeave={handleScenariosClose}
                      aria-haspopup="true"
                      aria-expanded={Boolean(scenariosAnchor)}
                      aria-controls={scenariosAnchor ? 'scenarios-menu' : undefined}
                      sx={{
                        color: active ? NAV_LINK_HOVER : NAV_LINK_COLOR,
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        px: 1.5,
                        py: 0.75,
                        minWidth: 'auto',
                        borderRadius: '7px',
                        ...(active && {
                          bgcolor: 'rgba(255,255,255,0.15)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        }),
                        '&:hover': {
                          color: NAV_LINK_HOVER,
                          bgcolor: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                        },
                      }}
                      endIcon={
                        <ExpandMoreRoundedIcon
                          sx={{
                            fontSize: '1.2rem',
                            opacity: 0.9,
                            transform: scenariosAnchor ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                          }}
                        />
                      }
                    >
                      {item.label}
                    </Button>
                  )
                }
                const active = isActive(item)
                return (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.to}
                    sx={{
                      color: active ? NAV_LINK_HOVER : NAV_LINK_COLOR,
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      textDecoration: 'none',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      px: 1.5,
                      py: 0.75,
                      minWidth: 'auto',
                      borderRadius: '7px',
                      ...(active && {
                        bgcolor: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }),
                      '&:hover': {
                        color: NAV_LINK_HOVER,
                        bgcolor: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
              {/* Explore More — dropdown with chevron; close only when pointer leaves button+menu */}
              <Button
                onMouseEnter={handleExploreMoreOpen}
                onMouseLeave={handleExploreMoreClose}
                aria-haspopup="true"
                aria-expanded={Boolean(exploreMoreAnchor)}
                aria-controls={exploreMoreAnchor ? 'explore-more-menu' : undefined}
                sx={{
                  color: isExploreMoreActive ? NAV_LINK_HOVER : NAV_LINK_COLOR,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  px: 1.5,
                  py: 0.75,
                  minWidth: 'auto',
                  borderRadius: '7px',
                  ...(isExploreMoreActive && {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }),
                  '&:hover': {
                    color: NAV_LINK_HOVER,
                    bgcolor: isExploreMoreActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                  },
                }}
                endIcon={
                  <ExpandMoreRoundedIcon
                    sx={{
                      fontSize: '1.2rem',
                      opacity: 0.9,
                      transform: exploreMoreAnchor ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                }
              >
                Explore More
              </Button>
            </Box>
          )}
          {/* Scenarios dropdown: wide multi-column specialties; hideBackdrop keeps hover stable */}
          <Menu
            id="scenarios-menu"
            anchorEl={scenariosAnchor}
            open={Boolean(scenariosAnchor)}
            onClose={() => setScenariosAnchor(null)}
            disableScrollLock
            hideBackdrop
            autoFocus={false}
            MenuListProps={{
              onMouseEnter: handleScenariosKeepOpen,
              onMouseLeave: handleScenariosClose,
              'aria-labelledby': 'scenarios-button',
              sx: {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))',
                gap: '4px 0',
                py: 1.5,
                px: 1,
                minWidth: 560,
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
              backdrop: { sx: { opacity: 0, pointerEvents: 'none' } },
              paper: {
                sx: {
                  mt: 0.25,
                  minWidth: 580,
                  maxWidth: 620,
                  borderRadius: '12px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.15),
                  py: 2,
                  px: 2,
                },
              },
            }}
          >
            {/* Scenarios — title link to main page */}
            <MenuItem
              onClick={handleScenariosMainClick}
              sx={{
                gridColumn: '1 / -1',
                py: 1.25,
                px: 2,
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '8px',
                borderBottom: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.12),
                mb: 0.5,
                '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) },
              }}
            >
              Scenarios
            </MenuItem>
            {scenarioSpecialties.map((specialty) => (
              <MenuItem
                key={specialty}
                onClick={() => handleScenariosItemClick(specialty)}
                sx={{
                  py: 1.25,
                  px: 2,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  minWidth: 0,
                  '&:hover': {
                    bgcolor: alpha(PAGE_PRIMARY, 0.08),
                  },
                }}
              >
                {specialty}
              </MenuItem>
            ))}
          </Menu>
          {/* Explore More dropdown: no backdrop so button keeps hover and menu stays open */}
          <Menu
            id="explore-more-menu"
            anchorEl={exploreMoreAnchor}
            open={Boolean(exploreMoreAnchor)}
            onClose={() => setExploreMoreAnchor(null)}
            disableScrollLock
            hideBackdrop
            MenuListProps={{
              onMouseEnter: handleExploreMoreKeepOpen,
              onMouseLeave: handleExploreMoreClose,
              'aria-labelledby': 'explore-more-button',
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              backdrop: {
                sx: { opacity: 0, pointerEvents: 'none' },
              },
              paper: {
                sx: {
                  mt: 0.5,
                  minWidth: 200,
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.12),
                  py: 0.5,
                },
              },
            }}
          >
            {exploreMoreItems.map((item) => {
              const Icon = item.Icon
              return (
                <MenuItem
                  key={item.label}
                  onClick={() => handleExploreMoreItemClick(item.to)}
                  sx={{
                    py: 1.25,
                    px: 2,
                    gap: 1.5,
                    fontSize: '0.95rem',
                    '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                  }}
                >
                  <Icon sx={{ fontSize: 20, color: PAGE_PRIMARY }} />
                  {item.label}
                </MenuItem>
              )
            })}
          </Menu>

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
                    bgcolor: LOGIN_BTN_BG,
                    border: `2px solid ${LOGO_RING}`,
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
              variant="contained"
              size="medium"
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                py: 1.25,
                px: 2.5,
                textTransform: 'none',
                borderRadius: '7px',
                bgcolor: LOGIN_BTN_BG,
                color: LOGIN_BTN_TEXT,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: LOGIN_BTN_BG_HOVER,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Log In
            </Button>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              aria-label="Open menu"
              sx={{
                borderRadius: '7px',
                color: NAV_LINK_COLOR,
                width: 44,
                height: 44,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
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
