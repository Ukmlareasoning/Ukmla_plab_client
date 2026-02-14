import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import TimelineIcon from '@mui/icons-material/Timeline'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SIDEBAR_BG = '#1e3a5f'
const SIDEBAR_ACTIVE_BG = 'rgba(255,255,255,0.12)'

export const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: BarChartRoundedIcon, path: '/user-dashboard' },
  { id: 'courses', label: 'Mocks Exams', Icon: MenuBookRoundedIcon, path: '/user-dashboard/mocks-exams' },
  { id: 'history', label: 'Mocks History', Icon: HistoryRoundedIcon, path: '/user-dashboard/history' },
  { id: 'scenarios', label: 'Scenarios', Icon: AutoStoriesRoundedIcon, path: '/user-dashboard/scenarios' },
  { id: 'scenarios-history', label: 'Scenarios History', Icon: TimelineIcon, path: '/user-dashboard/scenarios-history' },
]

const getActiveTabFromPath = (pathname) => {
  if (pathname === '/user-dashboard' || pathname === '/user-dashboard/') return 'dashboard'
  if (pathname.startsWith('/user-dashboard/mocks-exams')) return 'courses'
  if (pathname.startsWith('/user-dashboard/course-practice')) return 'courses'
  if (pathname.startsWith('/user-dashboard/history')) return 'history'
  if (pathname.startsWith('/user-dashboard/course-details')) return 'history'
  if (pathname.startsWith('/user-dashboard/scenarios-history')) return 'scenarios-history'
  if (pathname.startsWith('/user-dashboard/scenarios')) return 'scenarios'
  return 'dashboard'
}

export default function UserDashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = getActiveTabFromPath(location.pathname)

  const handleTabClick = (tab) => {
    if (tab.path !== location.pathname) {
      navigate(tab.path)
    }
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
          {TABS.map((tab) => {
            const Icon = tab.Icon
            const isActive = activeTab === tab.id
            return (
              <Box
                key={tab.id}
                component="button"
                type="button"
                onClick={() => handleTabClick(tab)}
                sx={{
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
                }}
              >
                <Icon
                  sx={{
                    fontSize: { xs: 22, md: 24 },
                    color: 'inherit',
                    opacity: isActive ? 1 : 0.85,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 'inherit',
                    fontSize: 'inherit',
                    color: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            )
          })}
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
