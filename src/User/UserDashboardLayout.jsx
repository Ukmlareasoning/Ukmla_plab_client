import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Box, Typography, Collapse, useTheme, useMediaQuery } from '@mui/material'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import TimelineIcon from '@mui/icons-material/Timeline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonIcon from '@mui/icons-material/Person'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SIDEBAR_BG = '#1e3a5f'
const SIDEBAR_ACTIVE_BG = 'rgba(255,255,255,0.12)'

// Flat list for backwards compatibility (e.g. getActiveTabFromPath) — order matches sidebar
export const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: BarChartRoundedIcon, path: '/user-dashboard' },
  { id: 'scenarios', label: 'Scenarios', Icon: AutoStoriesRoundedIcon, path: '/user-dashboard/scenarios' },
  { id: 'scenarios-history', label: 'Scenarios History', Icon: TimelineIcon, path: '/user-dashboard/scenarios-history' },
  { id: 'courses', label: 'Mocks Exams', Icon: MenuBookRoundedIcon, path: '/user-dashboard/mocks-exams' },
  { id: 'history', label: 'Mocks History', Icon: HistoryRoundedIcon, path: '/user-dashboard/history' },
  { id: 'progress', label: 'Progress', Icon: TrendingUpIcon, path: '/user-dashboard/progress' },
  { id: 'mistakes', label: 'Mistakes', Icon: ErrorOutlineIcon, path: '/user-dashboard/mistakes' },
  { id: 'webinar', label: 'Webinar', Icon: OndemandVideoIcon, path: '/user-dashboard/webinar' },
  { id: 'notes', label: 'Notes', Icon: StickyNote2Icon, path: '/user-dashboard/notes' },
  { id: 'community', label: 'Community', Icon: GroupsIcon, path: '/user-dashboard/community' },
  { id: 'accounts', label: 'Accounts', Icon: PersonIcon, path: '/settings' },
]

// Sidebar nav: items with children show as dropdown — order: Dashboard, Scenarios, Mocks, Progress, Mistakes, Webinar, Notes, Community, Accounts
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: BarChartRoundedIcon, path: '/user-dashboard' },
  {
    id: 'scenarios-group',
    label: 'Scenarios',
    Icon: AutoStoriesRoundedIcon,
    children: [
      { id: 'scenarios', label: 'Scenarios', Icon: AutoStoriesRoundedIcon, path: '/user-dashboard/scenarios' },
      { id: 'scenarios-history', label: 'Scenarios History', Icon: TimelineIcon, path: '/user-dashboard/scenarios-history' },
    ],
  },
  {
    id: 'mocks',
    label: 'Mocks',
    Icon: MenuBookRoundedIcon,
    children: [
      { id: 'courses', label: 'Mocks Exams', Icon: MenuBookRoundedIcon, path: '/user-dashboard/mocks-exams' },
      { id: 'history', label: 'Mocks History', Icon: HistoryRoundedIcon, path: '/user-dashboard/history' },
    ],
  },
  { id: 'progress', label: 'Progress', Icon: TrendingUpIcon, path: '/user-dashboard/progress' },
  { id: 'mistakes', label: 'Mistakes', Icon: ErrorOutlineIcon, path: '/user-dashboard/mistakes' },
  { id: 'webinar', label: 'Webinar', Icon: OndemandVideoIcon, path: '/user-dashboard/webinar' },
  { id: 'notes', label: 'Notes', Icon: StickyNote2Icon, path: '/user-dashboard/notes' },
  { id: 'community', label: 'Community', Icon: GroupsIcon, path: '/user-dashboard/community' },
  { id: 'accounts', label: 'Accounts', Icon: PersonIcon, path: '/settings' },
]

const getActiveTabFromPath = (pathname) => {
  if (pathname === '/user-dashboard' || pathname === '/user-dashboard/') return 'dashboard'
  if (pathname.startsWith('/user-dashboard/mocks-exams')) return 'courses'
  if (pathname.startsWith('/user-dashboard/course-practice')) return 'courses'
  if (pathname.startsWith('/user-dashboard/history')) return 'history'
  if (pathname.startsWith('/user-dashboard/course-details')) return 'history'
  if (pathname.startsWith('/user-dashboard/scenarios-history')) return 'scenarios-history'
  if (pathname.startsWith('/user-dashboard/scenario-details')) return 'scenarios-history'
  if (pathname.startsWith('/user-dashboard/scenario-practice')) return 'scenarios'
  if (pathname.startsWith('/user-dashboard/scenarios')) return 'scenarios'
  if (pathname.startsWith('/user-dashboard/progress')) return 'progress'
  if (pathname.startsWith('/user-dashboard/mistakes')) return 'mistakes'
  if (pathname.startsWith('/user-dashboard/notes')) return 'notes'
  if (pathname.startsWith('/user-dashboard/webinar')) return 'webinar'
  if (pathname.startsWith('/user-dashboard/community')) return 'community'
  if (pathname.startsWith('/settings')) return 'accounts'
  return 'dashboard'
}

export default function UserDashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const activeTab = getActiveTabFromPath(location.pathname)

  const isMocksChild = activeTab === 'courses' || activeTab === 'history'
  const isScenariosChild = activeTab === 'scenarios' || activeTab === 'scenarios-history'
  const [mocksOpen, setMocksOpen] = useState(isMocksChild)
  const [scenariosOpen, setScenariosOpen] = useState(isScenariosChild)

  useEffect(() => {
    if (isMocksChild) setMocksOpen(true)
    if (isScenariosChild) setScenariosOpen(true)
  }, [isMocksChild, isScenariosChild])

  const handleTabClick = (tab) => {
    if (tab.path && tab.path !== location.pathname) {
      navigate(tab.path)
    }
  }

  const navButtonSx = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    width: { xs: 'auto', md: '100%' },
    minWidth: { xs: 140, md: 'auto' },
    flex: { xs: '1 1 0', md: 'none' },
    justifyContent: { xs: 'center', md: 'flex-start' },
    px: { xs: 2, md: 2.5 },
    py: { xs: 1.25, md: 1.5 },
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
    bgcolor: isActive ? SIDEBAR_ACTIVE_BG : 'transparent',
    fontWeight: isActive ? 700 : 600,
    fontSize: { xs: '0.8125rem', md: '0.9375rem' },
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    flexShrink: 0,
    '&::before': isActive
      ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: 'rgba(255,255,255,0.9)',
          borderRadius: '0 4px 4px 0',
        }
      : {},
    '&:hover': {
      bgcolor: isActive ? SIDEBAR_ACTIVE_BG : 'rgba(255,255,255,0.08)',
      color: '#ffffff',
    },
    '&:focus-visible': {
      outline: '2px solid rgba(255,255,255,0.5)',
      outlineOffset: 2,
    },
  })

  const renderNavItem = (item) => {
    if (item.children) {
      const isMocks = item.id === 'mocks'
      const isScenarios = item.id === 'scenarios-group'
      const isOpen = isMocks ? mocksOpen : scenariosOpen
      const setOpen = isMocks ? setMocksOpen : setScenariosOpen
      const hasActiveChild = item.children.some((c) => c.id === activeTab)
      return (
        <Box key={item.id} sx={{ width: '100%' }}>
          <Box
            component="button"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            sx={navButtonSx(hasActiveChild)}
          >
            <item.Icon
              sx={{
                fontSize: { xs: 22, md: 24 },
                color: 'inherit',
                opacity: hasActiveChild ? 1 : 0.85,
                flexShrink: 0,
              }}
            />
            <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit', color: 'inherit', whiteSpace: 'nowrap', flex: 1 }}>
              {item.label}
            </Typography>
            {isOpen ? (
              <ExpandLessIcon sx={{ fontSize: 20, color: 'inherit', opacity: 0.9 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 20, color: 'inherit', opacity: 0.9 }} />
            )}
          </Box>
          <Collapse in={isOpen}>
            <Box sx={{ mt: 1.5, pl: { xs: 0, md: 5 }, pr: { xs: 0, md: 1 } }}>
              {item.children.map((child) => {
                const ChildIcon = child.Icon
                const isActive = activeTab === child.id
                return (
                  <Box
                    key={child.id}
                    component="button"
                    type="button"
                    onClick={() => handleTabClick(child)}
                    sx={{
                      ...navButtonSx(isActive),
                      py: { xs: 1, md: 1.25 },
                      pl: { xs: 2, md: 3.5 },
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                    }}
                  >
                    <ChildIcon sx={{ fontSize: { xs: 18, md: 20 }, color: 'inherit', opacity: isActive ? 1 : 0.85, flexShrink: 0 }} />
                    <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit', color: 'inherit', whiteSpace: 'nowrap' }}>
                      {child.label}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Collapse>
        </Box>
      )
    }
    const isActive = activeTab === item.id
    return (
      <Box
        key={item.id}
        component="button"
        type="button"
        onClick={() => handleTabClick(item)}
        sx={navButtonSx(isActive)}
      >
        <item.Icon sx={{ fontSize: { xs: 22, md: 24 }, color: 'inherit', opacity: isActive ? 1 : 0.85, flexShrink: 0 }} />
        <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit', color: 'inherit', whiteSpace: 'nowrap' }}>
          {item.label}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: 'calc(100vh - 120px)',
          overflowX: 'hidden',
        }}
      >
        <Box
          component="nav"
          aria-label="Dashboard navigation"
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            gap: 0,
            width: { xs: '100%', md: 220 },
            minHeight: { xs: 'auto', md: '100%' },
            bgcolor: SIDEBAR_BG,
            background: { md: `linear-gradient(180deg, #243b55 0%, ${SIDEBAR_BG} 50%, #182d47 100%)` },
            borderRight: { xs: 'none', md: '1px solid rgba(255,255,255,0.06)' },
            overflowX: { xs: 'auto', md: 'visible' },
            overflowY: { xs: 'visible', md: 'auto' },
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: { xs: 0, md: 6 }, height: { xs: 6, md: 0 } },
          }}
        >
          {isMobile
            ? TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <Box
                    key={tab.id}
                    component="button"
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    sx={navButtonSx(isActive)}
                  >
                    <tab.Icon sx={{ fontSize: { xs: 22, md: 24 }, color: 'inherit', opacity: isActive ? 1 : 0.85, flexShrink: 0 }} />
                    <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit', color: 'inherit', whiteSpace: 'nowrap' }}>
                      {tab.label}
                    </Typography>
                  </Box>
                )
              })
            : NAV_ITEMS.map(renderNavItem)}
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: 1400,
            mx: 'auto',
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </>
  )
}
