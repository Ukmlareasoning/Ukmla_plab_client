import { useMemo, useState, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import UserDashboardLayout from './UserDashboardLayout'
import { WEBINARS_DATA, formatDate, formatTime, WebinarCard } from './Webinars'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'

// Extra upcoming webinars so Current tab always has at least 2
const EXTRA_UPCOMING_WEBINARS = [
  {
    id: 201,
    eventTitle: 'PLAB 1 Exam Strategies',
    description: 'Live session on exam strategies, time management, and common PLAB 1 question patterns. Q&A included.',
    startDate: '2026-01-15',
    endDate: '2026-01-15',
    startTime: '11:00',
    endTime: '13:00',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/example1',
    address: '',
    price: 0,
    maxAttendees: 120,
    bannerImage: 'https://images.unsplash.com/photo-1503676260728-fc7a8016a8f8?w=800&h=400&fit=crop',
    status: 'Active',
  },
  {
    id: 202,
    eventTitle: 'Clinical Scenario Deep Dive',
    description: 'Walkthrough of complex clinical scenarios and how to structure your answers for UKMLA and PLAB 1.',
    startDate: '2026-02-20',
    endDate: '2026-02-20',
    startTime: '15:00',
    endTime: '17:00',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/example2',
    address: '',
    price: 19.99,
    maxAttendees: 90,
    bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    status: 'Active',
  },
]

const PAST_WEBINARS = [
  {
    id: 101,
    eventTitle: 'UKMLA Reasoning Foundations',
    description: 'An overview of core reasoning skills for UKMLA and PLAB 1. Recorded session covering key concepts and common pitfalls.',
    startDate: '2025-01-18',
    endDate: '2025-01-18',
    startTime: '14:00',
    endTime: '16:00',
    isOnline: true,
    zoomMeetingLink: '',
    address: '',
    price: 0,
    maxAttendees: 100,
    bannerImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=400&fit=crop',
    status: 'Ended',
  },
  {
    id: 102,
    eventTitle: 'Patient Safety & Red Flags',
    description: 'Recorded webinar on patient safety and red-flag thinking for clinical scenarios.',
    startDate: '2024-12-10',
    endDate: '2024-12-10',
    startTime: '10:00',
    endTime: '12:00',
    isOnline: true,
    zoomMeetingLink: '',
    address: '',
    price: 0,
    maxAttendees: 80,
    bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    status: 'Ended',
  },
  {
    id: 103,
    eventTitle: 'Ethics & GMC Guidance',
    description: 'Past session covering GMC guidance and ethical decision-making in exam scenarios.',
    startDate: '2024-11-22',
    endDate: '2024-11-22',
    startTime: '09:00',
    endTime: '11:00',
    isOnline: true,
    zoomMeetingLink: '',
    address: '',
    price: 29.99,
    maxAttendees: 75,
    bannerImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    status: 'Ended',
  },
]

function getStartMs(webinar) {
  const dateStr = webinar.startDate || ''
  const timeStr = webinar.startTime || '00:00'
  return new Date(`${dateStr}T${timeStr}`).getTime()
}

// Two webinars with start dates always in the future (7 and 14 days from now) so Current tab has at least 2
function getAlwaysUpcomingWebinars(now) {
  const d7 = new Date(now)
  d7.setDate(d7.getDate() + 7)
  d7.setHours(10, 0, 0, 0)
  const d14 = new Date(now)
  d14.setDate(d14.getDate() + 14)
  d14.setHours(14, 0, 0, 0)
  const toDateStr = (d) => d.toISOString().slice(0, 10)
  return [
    {
      id: 'upcoming-1',
      eventTitle: 'PLAB 1 Exam Strategies',
      description: 'Live session on exam strategies, time management, and common PLAB 1 question patterns. Q&A included.',
      startDate: toDateStr(d7),
      endDate: toDateStr(d7),
      startTime: '10:00',
      endTime: '12:00',
      isOnline: true,
      zoomMeetingLink: 'https://zoom.us/j/example1',
      address: '',
      price: 0,
      maxAttendees: 120,
      bannerImage: 'https://images.unsplash.com/photo-1503676260728-fc7a8016a8f8?w=800&h=400&fit=crop',
      status: 'Active',
    },
    {
      id: 'upcoming-2',
      eventTitle: 'Clinical Scenario Deep Dive',
      description: 'Walkthrough of complex clinical scenarios and how to structure your answers for UKMLA and PLAB 1.',
      startDate: toDateStr(d14),
      endDate: toDateStr(d14),
      startTime: '14:00',
      endTime: '16:00',
      isOnline: true,
      zoomMeetingLink: 'https://zoom.us/j/example2',
      address: '',
      price: 19.99,
      maxAttendees: 90,
      bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
      status: 'Active',
    },
  ]
}

function formatCountdown(ms) {
  if (ms <= 0) return { text: 'Started', done: true }
  const s = Math.floor(ms / 1000) % 60
  const m = Math.floor(ms / 60000) % 60
  const h = Math.floor(ms / 3600000) % 24
  const d = Math.floor(ms / 86400000)
  const parts = []
  if (d > 0) parts.push(`${d}d`)
  parts.push(`${h}h`)
  parts.push(`${m}m`)
  parts.push(`${s}s`)
  return { text: parts.join(' '), done: false }
}

function CurrentWebinarCard({ webinar, now }) {
  const theme = useTheme()
  const startMs = getStartMs(webinar)
  const remaining = startMs - now
  const countdown = formatCountdown(remaining)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', minWidth: 0 }}>
      <Paper
        elevation={0}
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: '8px',
          border: '1px solid',
          borderColor: countdown.done ? alpha(theme.palette.success.main, 0.4) : alpha(PAGE_PRIMARY, 0.3),
          bgcolor: countdown.done ? alpha(theme.palette.success.main, 0.08) : alpha(PAGE_PRIMARY, 0.06),
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <ScheduleRoundedIcon sx={{ fontSize: 20, color: countdown.done ? 'success.main' : PAGE_PRIMARY }} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: countdown.done ? 'success.dark' : 'text.primary' }}>
          {countdown.done ? 'Started' : `Starts in: ${countdown.text}`}
        </Typography>
      </Paper>
      <WebinarCard webinar={webinar} />
    </Box>
  )
}

export default function UserWebinarPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [tab, setTab] = useState('current') // 'current' | 'history'
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const allWebinars = useMemo(() => [...WEBINARS_DATA, ...EXTRA_UPCOMING_WEBINARS, ...PAST_WEBINARS], [])

  const currentWebinars = useMemo(() => {
    const futureFromData = allWebinars.filter((w) => getStartMs(w) > now)
    const alwaysTwo = getAlwaysUpcomingWebinars(now)
    return [...alwaysTwo, ...futureFromData].sort((a, b) => getStartMs(a) - getStartMs(b))
  }, [allWebinars, now])

  const historyWebinars = useMemo(
    () => allWebinars.filter((w) => getStartMs(w) <= now).sort((a, b) => getStartMs(b) - getStartMs(a)),
    [allWebinars, now]
  )

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 }, overflowX: 'hidden', maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.35rem', sm: '1.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Webinar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Upcoming webinars with countdown and past session history
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.2),
            bgcolor: alpha(PAGE_PRIMARY, 0.03),
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              minHeight: 48,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem' },
              '& .Mui-selected': { color: PAGE_PRIMARY },
              '& .MuiTabs-indicator': { bgcolor: PAGE_PRIMARY, height: 3 },
            }}
          >
            <Tab
              value="current"
              label="Current"
              icon={<ScheduleRoundedIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              value="history"
              label="History"
              icon={<HistoryRoundedIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {tab === 'current' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {currentWebinars.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.6),
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                }}
              >
                <OndemandVideoIcon sx={{ fontSize: 56, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                  No upcoming webinars
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  New sessions will appear here with a countdown. Check back later.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 2, sm: 3 },
                  width: '100%',
                }}
              >
                {currentWebinars.map((webinar) => (
                  <Box key={webinar.id} sx={{ minWidth: 0, display: 'flex' }}>
                    <CurrentWebinarCard webinar={webinar} now={now} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {tab === 'history' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {historyWebinars.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.6),
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                }}
              >
                <HistoryRoundedIcon sx={{ fontSize: 56, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                  No past webinars
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Past sessions will appear here once they have ended.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 2, sm: 3 },
                  width: '100%',
                }}
              >
                {historyWebinars.map((webinar) => (
                  <Box key={webinar.id} sx={{ minWidth: 0, display: 'flex' }}>
                    <WebinarCard webinar={webinar} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </UserDashboardLayout>
  )
}
