import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import UserDashboardLayout from './UserDashboardLayout'
import { formatDate, formatTime, WebinarCard } from './Webinars'
import apiClient from '../server'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'

function getStartMs(webinar) {
  const dateStr = webinar.startDate || ''
  const timeStr = webinar.startTime || '00:00'
  return new Date(`${dateStr}T${timeStr}`).getTime()
}

function getEndMs(webinar) {
  const dateStr = webinar.endDate || webinar.startDate || ''
  const timeStr = webinar.endTime || '23:59'
  if (!dateStr) return 0
  return new Date(`${dateStr}T${timeStr}`).getTime()
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
  const [webinars, setWebinars] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const fetchRef = useRef(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWebinars = useCallback(async () => {
    const token = ++fetchRef.current
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('per_page', '100')
    params.set('apply_filters', '1')
    params.set('status', 'Active')
    try {
      const { ok, data } = await apiClient(`/webinars?${params.toString()}`, 'GET')
      if (token !== fetchRef.current) return
      if (!ok || !data?.success) {
        setListError(data?.message || 'Unable to load webinars.')
        return
      }
      setWebinars(data.data?.webinars || [])
    } catch {
      if (token === fetchRef.current) setListError('Unable to reach server. Please try again.')
    } finally {
      if (token === fetchRef.current) setListLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWebinars()
  }, [fetchWebinars])

  const activeWebinars = useMemo(() => webinars.filter((w) => !w.is_deleted), [webinars])

  const currentWebinars = useMemo(
    () => activeWebinars.filter((w) => getEndMs(w) > now).sort((a, b) => getStartMs(a) - getStartMs(b)),
    [activeWebinars, now]
  )

  const historyWebinars = useMemo(
    () => activeWebinars.filter((w) => getEndMs(w) <= now).sort((a, b) => getEndMs(b) - getEndMs(a)),
    [activeWebinars, now]
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

        {listError && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: '7px',
              border: '1px solid',
              borderColor: theme.palette.error.main,
              bgcolor: alpha(theme.palette.error.main, 0.08),
            }}
          >
            <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
              {listError}
            </Typography>
          </Paper>
        )}

        {listLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: { xs: 2, sm: 3 },
              width: '100%',
            }}
          >
            {[1, 2].map((i) => (
              <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: '8px', border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.5) }}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: '8px', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: '8px' }} />
              </Paper>
            ))}
          </Box>
        ) : tab === 'current' && (
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

        {tab === 'history' && !listLoading && (
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
