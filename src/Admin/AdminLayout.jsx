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
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded'
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded'
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import PlayLessonRoundedIcon from '@mui/icons-material/PlayLessonRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import NoteRoundedIcon from '@mui/icons-material/NoteRounded'
import PsychologyIcon from '@mui/icons-material/Psychology'
import { useState, useEffect } from 'react'

const SIDEBAR_WIDTH = 260

// Dummy avatar image for admin header (replace with real user image when needed)
const ADMIN_AVATAR_IMAGE = 'https://i.pravatar.cc/80'

// Admin layout primary (replaces green/teal)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
  { path: '/admin/users', label: 'Users', icon: <PeopleRoundedIcon /> },
]

const coursesSubItems = [
  { path: '/admin/courses/exam-type', label: 'Exam type', icon: <FactCheckRoundedIcon /> },
  { path: '/admin/courses/topic-focus', label: 'Topic / focus', icon: <CategoryRoundedIcon /> },
  { path: '/admin/courses/courses', label: 'Mocks', icon: <PlayLessonRoundedIcon /> },
  { path: '/admin/courses/question-bank', label: 'Question Bank', icon: <QuizRoundedIcon /> },
]

const scenariosSubItems = [
  { path: '/admin/scenarios/topic-focus', label: 'Scenario topic/focus', icon: <CategoryRoundedIcon /> },
  { path: '/admin/scenarios/scenarios', label: 'Scenarios', icon: <PlayLessonRoundedIcon /> },
  { path: '/admin/scenarios/question-bank', label: 'Scenario Question Bank', icon: <QuizRoundedIcon /> },
]

const settingsSubItems = [
  { path: '/admin/users/add', label: 'Profile', icon: <PersonRoundedIcon /> },
  { path: '/admin/services', label: 'Services', icon: <DesignServicesRoundedIcon /> },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: <SubscriptionsRoundedIcon /> },
  { path: '/admin/contacts', label: 'Contacts', icon: <ContactMailRoundedIcon /> },
  { path: '/admin/notes/type', label: 'Type', icon: <CategoryRoundedIcon /> },
  { path: '/admin/courses/difficulty-level', label: 'Difficulty level', icon: <SpeedRoundedIcon /> },
  { path: '/admin/static-pages', label: 'Static Pages', icon: <ArticleRoundedIcon /> },
]

function AdminLayout() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileAnchor, setProfileAnchor] = useState(null)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [scenariosOpen, setScenariosOpen] = useState(false)
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

  // Keep Scenarios dropdown open when on a scenarios sub-route
  useEffect(() => {
    if (location.pathname.startsWith('/admin/scenarios/')) setScenariosOpen(true)
  }, [location.pathname])

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

  // Header and sidebar same color (#384D84)
  const headerBg = ADMIN_PRIMARY
  const sidebarBg = headerBg
  const footerBg = ADMIN_PRIMARY
  const darkBorder = alpha(theme.palette.common.white, 0.12)

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: sidebarBg,
        borderRight: '1px solid',
        borderColor: darkBorder,
        boxShadow: `2px 0 12px ${alpha(theme.palette.common.black, 0.15)}`,
        overflow: 'hidden',
      }}
    >
      {/* Sidebar header — same color as header */}
      <Box
        sx={{
          flexShrink: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: sidebarBg,
          borderBottom: '1px solid',
          borderColor: darkBorder,
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
            bgcolor: alpha(theme.palette.common.white, 0.15),
            color: theme.palette.common.white,
          }}
        >
          <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'common.white', lineHeight: 1.2 }}>
            Admin
          </Typography>
          <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.85) }}>
            UKMLA PLAB Reasoning
          </Typography>
        </Box>
      </Box>

      {/* Scrollable nav list — same background so it covers to last record when scrolling */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          bgcolor: sidebarBg,
        }}
      >
        <List sx={{ px: 1.5, py: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={isActive}
              sx={{
                borderRadius: '7px',
                mb: 0.75,
                bgcolor: !isActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                '&.Mui-selected': {
                  borderLeft: '3px solid #fff',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  color: '#fff',
                  boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                    boxShadow: `0 3px 12px ${alpha(theme.palette.common.black, 0.25)}`,
                    color: '#fff',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  bgcolor: !isActive ? alpha(theme.palette.common.white, 0.12) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? '#fff' : alpha(theme.palette.common.white, 0.85),
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isActive ? undefined : alpha(theme.palette.common.white, 0.9),
                }}
                sx={{ color: isActive ? '#fff' : undefined }}
              />
            </ListItemButton>
          )
        })}

        {/* Courses — dropdown with Exam type, Topic / focus, Mocks, Question Bank */}
        <ListItemButton
          onClick={() => setCoursesOpen((o) => !o)}
          sx={{
            borderRadius: '7px',
            mb: 0.75,
            bgcolor: alpha(theme.palette.common.white, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.12),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: alpha(theme.palette.common.white, 0.85) }}>
            <MenuBookRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Mocks"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9375rem',
              color: alpha(theme.palette.common.white, 0.9),
            }}
          />
          {coursesOpen ? <ExpandLess sx={{ color: alpha(theme.palette.common.white, 0.85) }} /> : <ExpandMore sx={{ color: alpha(theme.palette.common.white, 0.85) }} />}
        </ListItemButton>
        <Collapse in={coursesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2, pr: 1.5 }}>
            {coursesSubItems.map((sub) => {
              const isSubActive = location.pathname === sub.path
              return (
                <ListItemButton
                  key={sub.path}
                  onClick={() => handleNav(sub.path)}
                  selected={isSubActive}
                  sx={{
                    borderRadius: '7px',
                    mb: 0.5,
                    py: 0.75,
                    bgcolor: !isSubActive ? 'transparent' : undefined,
                    '&.Mui-selected': {
                      borderLeft: '3px solid #fff',
                      background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                      color: '#fff',
                      boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                        color: '#fff',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&:hover': {
                      bgcolor: !isSubActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isSubActive ? '#fff' : alpha(theme.palette.common.white, 0.85) }}>
                    {sub.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontWeight: isSubActive ? 700 : 500,
                      fontSize: '0.875rem',
                      color: isSubActive ? undefined : alpha(theme.palette.common.white, 0.9),
                    }}
                    sx={{ color: isSubActive ? '#fff' : undefined }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>

        {/* Accounting — after Courses, before Settings */}
        {(() => {
          const accountingPath = '/admin/accounting'
          const isAccountingActive = location.pathname === accountingPath
          return (
            <ListItemButton
              onClick={() => handleNav(accountingPath)}
              selected={isAccountingActive}
              sx={{
                borderRadius: '7px',
                mb: 0.75,
                bgcolor: !isAccountingActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                '&.Mui-selected': {
                  borderLeft: '3px solid #fff',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  color: '#fff',
                  boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                    boxShadow: `0 3px 12px ${alpha(theme.palette.common.black, 0.25)}`,
                    color: '#fff',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  bgcolor: !isAccountingActive ? alpha(theme.palette.common.white, 0.12) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isAccountingActive ? '#fff' : alpha(theme.palette.common.white, 0.85),
                }}
              >
                <AccountBalanceRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Accounting"
                primaryTypographyProps={{
                  fontWeight: isAccountingActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isAccountingActive ? undefined : alpha(theme.palette.common.white, 0.9),
                }}
                sx={{ color: isAccountingActive ? '#fff' : undefined }}
              />
            </ListItemButton>
          )
        })()}

        {/* Announcement — after Accounting, before Webinar */}
        {(() => {
          const announcementPath = '/admin/announcements'
          const isAnnouncementActive = location.pathname === announcementPath
          return (
            <ListItemButton
              onClick={() => handleNav(announcementPath)}
              selected={isAnnouncementActive}
              sx={{
                borderRadius: '7px',
                mb: 0.75,
                bgcolor: !isAnnouncementActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                '&.Mui-selected': {
                  borderLeft: '3px solid #fff',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  color: '#fff',
                  boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                    boxShadow: `0 3px 12px ${alpha(theme.palette.common.black, 0.25)}`,
                    color: '#fff',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  bgcolor: !isAnnouncementActive ? alpha(theme.palette.common.white, 0.12) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isAnnouncementActive ? '#fff' : alpha(theme.palette.common.white, 0.85),
                }}
              >
                <CampaignRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Announcement"
                primaryTypographyProps={{
                  fontWeight: isAnnouncementActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isAnnouncementActive ? undefined : alpha(theme.palette.common.white, 0.9),
                }}
                sx={{ color: isAnnouncementActive ? '#fff' : undefined }}
              />
            </ListItemButton>
          )
        })()}

        {/* Webinar — after Accounting, before Settings */}
        {(() => {
          const webinarPath = '/admin/webinars'
          const isWebinarActive = location.pathname === webinarPath
          return (
            <ListItemButton
              onClick={() => handleNav(webinarPath)}
              selected={isWebinarActive}
              sx={{
                borderRadius: '7px',
                mb: 0.75,
                bgcolor: !isWebinarActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                '&.Mui-selected': {
                  borderLeft: '3px solid #fff',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  color: '#fff',
                  boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                    boxShadow: `0 3px 12px ${alpha(theme.palette.common.black, 0.25)}`,
                    color: '#fff',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  bgcolor: !isWebinarActive ? alpha(theme.palette.common.white, 0.12) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isWebinarActive ? '#fff' : alpha(theme.palette.common.white, 0.85),
                }}
              >
                <VideoCallRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Webinar"
                primaryTypographyProps={{
                  fontWeight: isWebinarActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isWebinarActive ? undefined : alpha(theme.palette.common.white, 0.9),
                }}
                sx={{ color: isWebinarActive ? '#fff' : undefined }}
              />
            </ListItemButton>
          )
        })()}

        {/* Notes — simple nav (same as Webinar / Users) */}
        {(() => {
          const notesPath = '/admin/notes/notes'
          const isNotesActive = location.pathname === notesPath || location.pathname === '/admin/notes/add'
          return (
            <ListItemButton
              onClick={() => handleNav(notesPath)}
              selected={isNotesActive}
              sx={{
                borderRadius: '7px',
                mb: 0.75,
                bgcolor: !isNotesActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                '&.Mui-selected': {
                  borderLeft: '3px solid #fff',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  color: '#fff',
                  boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                    boxShadow: `0 3px 12px ${alpha(theme.palette.common.black, 0.25)}`,
                    color: '#fff',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  bgcolor: !isNotesActive ? alpha(theme.palette.common.white, 0.12) : undefined,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isNotesActive ? '#fff' : alpha(theme.palette.common.white, 0.85),
                }}
              >
                <NoteRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Notes"
                primaryTypographyProps={{
                  fontWeight: isNotesActive ? 700 : 500,
                  fontSize: '0.9375rem',
                  color: isNotesActive ? undefined : alpha(theme.palette.common.white, 0.9),
                }}
                sx={{ color: isNotesActive ? '#fff' : undefined }}
              />
            </ListItemButton>
          )
        })()}

        {/* Scenarios — dropdown with Scenario topic/focus, Scenarios, Scenario Question Bank */}
        <ListItemButton
          onClick={() => setScenariosOpen((o) => !o)}
          sx={{
            borderRadius: '7px',
            mb: 0.75,
            bgcolor: alpha(theme.palette.common.white, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.12),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: alpha(theme.palette.common.white, 0.85) }}>
            <PsychologyIcon />
          </ListItemIcon>
          <ListItemText
            primary="Scenarios"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9375rem',
              color: alpha(theme.palette.common.white, 0.9),
            }}
          />
          {scenariosOpen ? <ExpandLess sx={{ color: alpha(theme.palette.common.white, 0.85) }} /> : <ExpandMore sx={{ color: alpha(theme.palette.common.white, 0.85) }} />}
        </ListItemButton>
        <Collapse in={scenariosOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2, pr: 1.5 }}>
            {scenariosSubItems.map((sub) => {
              const isSubActive = location.pathname === sub.path
              return (
                <ListItemButton
                  key={sub.path}
                  onClick={() => handleNav(sub.path)}
                  selected={isSubActive}
                  sx={{
                    borderRadius: '7px',
                    mb: 0.5,
                    py: 0.75,
                    bgcolor: !isSubActive ? 'transparent' : undefined,
                    '&.Mui-selected': {
                      borderLeft: '3px solid #fff',
                      background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                      color: '#fff',
                      boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                        color: '#fff',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&:hover': {
                      bgcolor: !isSubActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isSubActive ? '#fff' : alpha(theme.palette.common.white, 0.85) }}>
                    {sub.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontWeight: isSubActive ? 700 : 500,
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      color: isSubActive ? undefined : alpha(theme.palette.common.white, 0.9),
                    }}
                    sx={{ color: isSubActive ? '#fff' : undefined }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>

        {/* Settings — dropdown with Profile, Services, Type, etc. */}
        <ListItemButton
          onClick={() => setSettingsOpen((o) => !o)}
          sx={{
            borderRadius: '7px',
            mb: 0.75,
            bgcolor: alpha(theme.palette.common.white, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.12),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: alpha(theme.palette.common.white, 0.85) }}>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9375rem',
              color: alpha(theme.palette.common.white, 0.9),
            }}
          />
          {settingsOpen ? <ExpandLess sx={{ color: alpha(theme.palette.common.white, 0.85) }} /> : <ExpandMore sx={{ color: alpha(theme.palette.common.white, 0.85) }} />}
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
                    borderRadius: '7px',
                    mb: 0.5,
                    py: 0.75,
                    bgcolor: !isSubActive ? 'transparent' : undefined,
                    '&.Mui-selected': {
                      borderLeft: '3px solid #fff',
                      background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                      color: '#fff',
                      boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                        color: '#fff',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#fff',
                      },
                    },
                    '&:hover': {
                      bgcolor: !isSubActive ? alpha(theme.palette.common.white, 0.08) : undefined,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isSubActive ? '#fff' : alpha(theme.palette.common.white, 0.85) }}>
                    {sub.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontWeight: isSubActive ? 700 : 500,
                      fontSize: '0.875rem',
                      color: isSubActive ? undefined : alpha(theme.palette.common.white, 0.9),
                    }}
                    sx={{ color: isSubActive ? '#fff' : undefined }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
        </List>
      </Box>
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
          color: 'common.white',
          borderBottom: '1px solid',
          borderColor: darkBorder,
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56 }, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, color: 'common.white' }}
            >
              <MenuIcon />
            </IconButton>
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24, color: 'common.white' }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'common.white' }}>
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
                bgcolor: ADMIN_PRIMARY,
                color: '#fff',
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
        {/* Header — solid #384D84 */}
        <Box
          component="header"
          sx={{
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            bgcolor: headerBg,
            borderBottom: '1px solid',
            borderColor: darkBorder,
            boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.15)}`,
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
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  color: 'common.white',
                }}
              >
                <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'common.white', lineHeight: 1.2 }}>
                  UKMLA PLAB Reasoning
                </Typography>
                <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.85) }}>
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
                  bgcolor: ADMIN_PRIMARY,
                  color: '#fff',
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
            borderTop: '1px solid',
            borderColor: darkBorder,
            boxShadow: `0 -2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.85), fontWeight: 500 }}>
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
              borderRadius: '7px',
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
          <ListItemIcon sx={{ minWidth: 40, color: ADMIN_PRIMARY }}>
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
