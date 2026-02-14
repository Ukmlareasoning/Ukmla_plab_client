import { useEffect, useState, useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ViewListIcon from '@mui/icons-material/ViewList'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'

// Page primary (#384D84 — match Home, AboutUs, Courses, Pricing)
const PAGE_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes heroFadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(24px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

// Long Lorem Ipsum paragraph for description (2-line clamp + Show more dialog)
const LOREM_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla facilisi. Ut convallis, sem sit amet interdum consectetuer, odio augue aliquam leo, nec dapibus tortor nibh sed augue. Integer pellentesque quam vel velit.'

// Static webinars (Active only for user-facing list) — exported for UserWebinarPage
export const WEBINARS_DATA = [
  {
    id: 1,
    eventTitle: 'UKMLA PLAB 1 Overview',
    description: LOREM_DESCRIPTION,
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    startTime: '14:00',
    endTime: '16:00',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/1234567890',
    address: '',
    price: 0,
    maxAttendees: 100,
    bannerImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=400&fit=crop',
    status: 'Active',
    topic: 'Cardiology',
  },
  {
    id: 2,
    eventTitle: 'Clinical Reasoning Workshop',
    description: LOREM_DESCRIPTION,
    startDate: '2025-03-22',
    endDate: '2025-03-22',
    startTime: '10:00',
    endTime: '12:30',
    isOnline: false,
    zoomMeetingLink: '',
    address: '123 Medical Centre, London, UK',
    price: 49.99,
    maxAttendees: 50,
    bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    status: 'Active',
    topic: 'Neurology',
  },
  {
    id: 3,
    eventTitle: 'Ethics & Communication',
    description: LOREM_DESCRIPTION,
    startDate: '2025-04-05',
    endDate: '2025-04-05',
    startTime: '09:00',
    endTime: '11:00',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/9876543210',
    address: '',
    price: 29.99,
    maxAttendees: 80,
    bannerImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    status: 'Active',
    topic: 'Respiratory',
  },
  {
    id: 4,
    eventTitle: 'Data Interpretation Masterclass',
    description: LOREM_DESCRIPTION,
    startDate: '2025-04-12',
    endDate: '2025-04-12',
    startTime: '15:00',
    endTime: '17:30',
    isOnline: true,
    zoomMeetingLink: 'https://zoom.us/j/5555555555',
    address: '',
    price: 39.99,
    maxAttendees: 75,
    bannerImage: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&h=400&fit=crop',
    status: 'Active',
    topic: 'Gastroenterology',
  }
]

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
export const formatTime = (t) => {
  if (!t) return '—'
  if (t.length === 5 && t.includes(':')) return t
  if (t.length >= 4) return `${t.slice(0, 2)}:${t.slice(2, 4)}`
  return t
}

function getWebinarStartMs(webinar) {
  const dateStr = webinar.startDate || ''
  const timeStr = webinar.startTime || '00:00'
  return new Date(`${dateStr}T${timeStr}`).getTime()
}

// Topic/specialty options for filter (Cardiology, Neurology, etc.)
const WEBINAR_TOPIC_OPTIONS = ['all', 'Cardiology', 'Respiratory', 'Neurology', 'Gastroenterology', 'Dermatology', 'Endocrine', 'Musculoskeletal']

// Two webinars with start always in the future so Current tab has at least 2
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
      topic: 'Cardiology',
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
      topic: 'Neurology',
    },
  ]
}

/** Single detail row with label + icon box (polished, icon-friendly) */
function DetailRow({ label, value, icon }) {
  const theme = useTheme()
  if (value == null || value === '') return null
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 1.5,
        p: 1.5,
        borderRadius: '8px',
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        border: '1px solid',
        borderColor: alpha(theme.palette.grey[300], 0.4),
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: alpha(PAGE_PRIMARY, 0.04),
          borderColor: alpha(PAGE_PRIMARY, 0.2),
        },
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: alpha(PAGE_PRIMARY, 0.1),
            color: PAGE_PRIMARY,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            display: 'block',
            mb: 0.5,
            fontSize: '0.6875rem',
          }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, wordBreak: 'break-word', fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

export function WebinarCard({ webinar }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false)

  const handleBooking = () => {
    // TODO: open booking flow or navigate to booking page
  }

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid',
        borderColor: alpha(theme.palette.grey[300], 0.5),
        borderRadius: '12px',
        bgcolor: 'background.paper',
        boxShadow: `0 8px 32px ${alpha(PAGE_PRIMARY, 0.08)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: `linear-gradient(180deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
          opacity: 0,
          transition: 'opacity 0.4s',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
          opacity: 0,
          transition: 'opacity 0.4s',
        },
        '&:hover': {
          borderColor: alpha(PAGE_PRIMARY, 0.5),
          boxShadow: `0 24px 56px ${alpha(PAGE_PRIMARY, 0.2)}, 0 0 0 2px ${alpha(PAGE_PRIMARY, 0.12)}`,
          transform: 'translateY(-10px)',
          '&::before': { opacity: 1 },
          '&::after': { opacity: 1 },
          '& .webinar-banner-overlay': {
            opacity: 0.3,
          },
        },
      }}
    >
      {/* Banner Image with gradient overlay */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          component="img"
          src={webinar.bannerImage}
          alt={webinar.eventTitle}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240"><rect fill="#E2E8F0" width="800" height="240"/><text x="400" y="125" fill="#94A3B8" text-anchor="middle" font-size="18">Webinar Banner</text></svg>')
          }}
          sx={{
            width: '100%',
            height: 240,
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
          }}
        />
        <Box
          className="webinar-banner-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, transparent 0%, ${alpha(PAGE_PRIMARY_DARK, 0.6)} 100%)`,
            opacity: 0.15,
            transition: 'opacity 0.4s',
          }}
        />
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Chips: Price + Online/Onsite */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2.5 }}>
          {webinar.price === 0 ? (
            <Chip
              label="Free"
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8125rem',
                height: 28,
                px: 0.5,
                bgcolor: alpha(theme.palette.success.main, 0.15),
                color: theme.palette.success.dark,
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.15)}`,
              }}
            />
          ) : (
            <Chip
              icon={<EuroRoundedIcon sx={{ fontSize: 15 }} />}
              label={`€${webinar.price.toFixed(2)}`}
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8125rem',
                height: 28,
                px: 0.5,
                bgcolor: alpha(PAGE_PRIMARY, 0.12),
                color: PAGE_PRIMARY_DARK,
                border: `1px solid ${alpha(PAGE_PRIMARY, 0.25)}`,
                boxShadow: `0 2px 8px ${alpha(PAGE_PRIMARY, 0.12)}`,
                '& .MuiChip-icon': { color: 'inherit' },
              }}
            />
          )}
          <Chip
            icon={webinar.isOnline ? <LinkRoundedIcon sx={{ fontSize: 15 }} /> : <LocationOnRoundedIcon sx={{ fontSize: 15 }} />}
            label={webinar.isOnline ? 'Online' : 'Onsite'}
            size="small"
            sx={{
              borderRadius: '8px',
              fontSize: '0.8125rem',
              height: 28,
              px: 0.5,
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              color: 'text.secondary',
              fontWeight: 600,
              border: `1px solid ${alpha(theme.palette.grey[400], 0.25)}`,
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        </Box>

        {/* Start & End date-time (after Online/Onsite, before title) — same format for both; compact on mobile so icon + text stay on one line */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            fontWeight: 600,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.25, sm: 0.5 },
            flexWrap: { xs: 'nowrap', sm: 'wrap' },
          }}
        >
          <CalendarMonthRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: PAGE_PRIMARY, flexShrink: 0 }} />
          {formatDate(webinar.startDate)}
          {webinar.startTime && `, ${formatTime(webinar.startTime)}`}
          {(webinar.endDate || webinar.endTime) && (
            <>
              {' – '}
              {formatDate(webinar.endDate || webinar.startDate)}
              {webinar.endTime && `, ${formatTime(webinar.endTime)}`}
            </>
          )}
        </Typography>

        {/* Event Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            lineHeight: 1.3,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          {webinar.eventTitle}
        </Typography>

        {/* Description: 2 lines + Show more opens dialog with full description */}
        {webinar.description != null && webinar.description !== '' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              mb: 1.5,
              p: 1.5,
              borderRadius: '8px',
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              border: '1px solid',
              borderColor: alpha(theme.palette.grey[300], 0.4),
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(PAGE_PRIMARY, 0.04),
                borderColor: alpha(PAGE_PRIMARY, 0.2),
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(PAGE_PRIMARY, 0.1),
                color: PAGE_PRIMARY,
              }}
            >
              <VideoCallRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, maxWidth: '50%' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  display: 'block',
                  mb: 0.5,
                  fontSize: '0.6875rem',
                }}
              >
                Description
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  fontWeight: 500,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {webinar.description}
              </Typography>
              <Button
                size="small"
                onClick={() => setDescriptionDialogOpen(true)}
                sx={{
                  mt: 0.5,
                  p: 0,
                  minHeight: 0,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: PAGE_PRIMARY,
                  textTransform: 'none',
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Show more
              </Button>
            </Box>
          </Box>
        )}
        {webinar.isOnline ? (
          <DetailRow label="Online Meeting Link" value={webinar.zoomMeetingLink} icon={<LinkRoundedIcon sx={{ fontSize: 16 }} />} />
        ) : (
          <DetailRow label="Venue Address" value={webinar.address} icon={<LocationOnRoundedIcon sx={{ fontSize: 16 }} />} />
        )}
        <DetailRow label="Max Attendees" value={`Up to ${webinar.maxAttendees} participants`} icon={<GroupsRoundedIcon sx={{ fontSize: 16 }} />} />

        {/* Booking button */}
        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<EventAvailableRoundedIcon sx={{ fontSize: 22 }} />}
            onClick={handleBooking}
            sx={{
              py: 1.5,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1.0625rem',
              textTransform: 'none',
              background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
              boxShadow: `0 6px 18px ${alpha(PAGE_PRIMARY, 0.45)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`,
                boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.55)}`,
                transform: 'translateY(-2px)',
              },
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>

      {/* Description dialog — full description, styled like SignIn */}
      <Dialog
        open={descriptionDialogOpen}
        onClose={() => setDescriptionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': {
              alignItems: 'flex-end',
              justifyContent: 'center',
            },
          }),
        }}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '7px 7px 0 0' : '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
              : `0 24px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.06)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
            },
          },
        }}
      >
        {isMobile && (
          <Box
            sx={{
              pt: 1.5,
              pb: 0.5,
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(PAGE_PRIMARY, 0.02),
              borderBottom: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.1),
            }}
          >
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 4 },
            pb: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.1),
            bgcolor: alpha(PAGE_PRIMARY, 0.02),
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(PAGE_PRIMARY, 0.12),
              color: PAGE_PRIMARY,
              border: '2px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.2),
              boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.2)}`,
            }}
          >
            <VideoCallRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>
              {webinar.eventTitle}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, pb: 2.5, px: { xs: 2.5, sm: 3.5 }, minHeight: 120 }}>
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {webinar.description}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 },
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.5),
            bgcolor: theme.palette.grey[50],
          }}
        >
          <Button
            onClick={() => setDescriptionDialogOpen(false)}
            startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '7px',
              px: 2,
              '&:hover': {
                bgcolor: alpha(PAGE_PRIMARY, 0.06),
                color: PAGE_PRIMARY,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

const WEBINARS_PER_PAGE = 4

function Webinars() {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [webinarFilter, setWebinarFilter] = useState('current') // 'current' | 'past'
  const [topicFilter, setTopicFilter] = useState('all') // 'all' | Cardiology | Neurology | ...

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const activeWebinars = useMemo(
    () => WEBINARS_DATA.filter((w) => w.status === 'Active'),
    []
  )

  const now = Date.now()
  const currentWebinars = useMemo(() => {
    const futureFromData = activeWebinars
      .filter((w) => getWebinarStartMs(w) > now)
      .sort((a, b) => getWebinarStartMs(a) - getWebinarStartMs(b))
    const alwaysTwo = getAlwaysUpcomingWebinars(now)
    return [...alwaysTwo, ...futureFromData].sort((a, b) => getWebinarStartMs(a) - getWebinarStartMs(b))
  }, [activeWebinars, now])

  const pastWebinars = useMemo(
    () =>
      activeWebinars
        .filter((w) => getWebinarStartMs(w) <= now)
        .sort((a, b) => getWebinarStartMs(b) - getWebinarStartMs(a)),
    [activeWebinars, now]
  )

  const byTimeWebinars = webinarFilter === 'current' ? currentWebinars : pastWebinars
  const filteredWebinars = useMemo(
    () =>
      topicFilter === 'all'
        ? byTimeWebinars
        : byTimeWebinars.filter((w) => (w.topic || '') === topicFilter),
    [byTimeWebinars, topicFilter]
  )

  const totalPages = Math.max(1, Math.ceil(filteredWebinars.length / WEBINARS_PER_PAGE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const paginatedWebinars = useMemo(() => {
    const start = (safePage - 1) * WEBINARS_PER_PAGE
    return filteredWebinars.slice(start, start + WEBINARS_PER_PAGE)
  }, [filteredWebinars, safePage])

  const handleFilterChange = (_, value) => {
    if (value != null) {
      setWebinarFilter(value)
      setPage(1)
    }
  }

  const handleTopicChange = (_, value) => {
    if (value != null) {
      setTopicFilter(value)
      setPage(1)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Header />

      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
        {/* Hero section — same style as Help Center: dark blue bg, title, subtitle, badges, hero-img.png */}
        <Box
          component="section"
          aria-label="Webinars Hero"
          sx={{
            width: '100%',
            minHeight: { xs: 420, sm: 460, md: 500 },
            py: { xs: 4, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 6 },
            bgcolor: HERO_BG,
            background: `linear-gradient(180deg, #243b55 0%, ${HERO_BG} 50%, #182d47 100%)`,
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: { xs: '100%', md: 'auto' },
              maxWidth: { md: '55%' },
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.65rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              Webinars
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontWeight: 400,
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Join live sessions and workshops on UKMLA & PLAB 1 reasoning, ethics, and exam preparation.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<VideoCallRoundedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Live Sessions"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
              <Chip
                icon={<EventAvailableRoundedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="UKMLA & PLAB 1"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
              <Chip
                icon={<GroupsRoundedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Online & in-person"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: '45%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-end' },
              minHeight: { xs: 260, md: 340 },
            }}
          >
            <Box
              component="img"
              src={heroImg}
              alt="UKMLA clinical reasoning interface"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: { xs: 260, md: 360 },
                objectFit: 'contain',
                borderRadius: '7px',
              }}
            />
          </Box>
        </Box>

        {/* Webinars list — 2 per row (6-6 columns), centered */}
        <Box
          component="section"
          sx={{
            py: { xs: 4, md: 6 },
            px: { xs: 2, sm: 3 },
            animation: 'fadeInUp 0.6s ease-out 0.15s both',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Container maxWidth="lg" sx={{ mx: 'auto', width: '100%' }}>
            {/* Filter: Current Webinar | Past Webinar */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.2),
                bgcolor: alpha(PAGE_PRIMARY, 0.03),
              }}
            >
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Show
              </Typography>
              <ToggleButtonGroup
                value={webinarFilter}
                exclusive
                onChange={handleFilterChange}
                size="small"
                sx={{
                  flexWrap: 'wrap',
                  gap: 0.5,
                  '& .MuiToggleButtonGroup-grouped': { borderRadius: '7px !important', textTransform: 'none', fontWeight: 600 },
                  '& .MuiToggleButton-root': { border: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.3), color: 'text.secondary', '&.Mui-selected': { bgcolor: PAGE_PRIMARY, color: '#fff', borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK } } },
                }}
              >
                <ToggleButton value="current" aria-label="Current webinars">
                  <ScheduleRoundedIcon sx={{ fontSize: 18, mr: 0.75 }} />
                  Current Webinar
                </ToggleButton>
                <ToggleButton value="past" aria-label="Past webinars">
                  <HistoryRoundedIcon sx={{ fontSize: 18, mr: 0.75 }} />
                  Past Webinar
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

            {/* Filter: Topic (Cardiology, Neurology, etc.) */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 3,
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.2),
                bgcolor: alpha(PAGE_PRIMARY, 0.03),
              }}
            >
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Topic
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {WEBINAR_TOPIC_OPTIONS.map((value) => (
                  <Chip
                    key={value}
                    label={value === 'all' ? 'All' : value}
                    onClick={() => handleTopicChange(null, value)}
                    variant={topicFilter === value ? 'filled' : 'outlined'}
                    size="small"
                    sx={{
                      borderRadius: '7px',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      ...(topicFilter === value && {
                        bgcolor: PAGE_PRIMARY,
                        color: '#fff',
                        borderColor: PAGE_PRIMARY,
                        '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                      }),
                      ...(topicFilter !== value && {
                        borderColor: alpha(PAGE_PRIMARY, 0.4),
                        color: 'text.secondary',
                        '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08), borderColor: PAGE_PRIMARY, color: PAGE_PRIMARY },
                      }),
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {filteredWebinars.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.6),
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                }}
              >
                <VideoCallRoundedIcon sx={{ fontSize: 56, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                  {webinarFilter === 'current' ? 'No upcoming webinars' : 'No past webinars'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {webinarFilter === 'current'
                    ? 'New sessions will be listed here. Check back soon.'
                    : 'Past sessions will appear here once they have ended.'}
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Results count — same style as Courses */}
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <ViewListIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                    }}
                  >
                    {(() => {
                      const start = (safePage - 1) * WEBINARS_PER_PAGE + 1
                      const end = Math.min(safePage * WEBINARS_PER_PAGE, filteredWebinars.length)
                      const total = filteredWebinars.length
                      const range = start === end ? `${start}` : `${start}–${end}`
                      return `Showing ${range} of ${total} ${total === 1 ? 'webinar' : 'webinars'}`
                    })()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: { xs: 2, sm: 3 },
                    width: '100%',
                    maxWidth: '100%',
                  }}
                >
                  {paginatedWebinars.map((webinar) => (
                    <Box key={webinar.id} sx={{ minWidth: 0, display: 'flex' }}>
                      <WebinarCard webinar={webinar} />
                    </Box>
                  ))}
                </Box>

                {/* Theme-friendly pagination — same as Courses */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mt: 5,
                      pt: 4,
                      borderTop: '1px solid',
                      borderColor: alpha(theme.palette.grey[300], 0.4),
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <TrendingUpIcon sx={{ color: PAGE_PRIMARY, fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Page {safePage} of {totalPages}
                      </Typography>
                    </Box>
                    <Pagination
                      count={totalPages}
                      page={safePage}
                      onChange={(_, value) => setPage(value)}
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          borderRadius: '7px',
                        },
                        '& .MuiPaginationItem-page.Mui-selected': {
                          background: `linear-gradient(135deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_DARK})`,
                          color: '#fff',
                          boxShadow: `0 2px 8px ${alpha(PAGE_PRIMARY, 0.4)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${PAGE_PRIMARY_LIGHT}, ${PAGE_PRIMARY})`,
                          },
                        },
                        '& .MuiPaginationItem-page:not(.Mui-selected):hover': {
                          backgroundColor: alpha(PAGE_PRIMARY, 0.1),
                          color: PAGE_PRIMARY,
                        },
                        '& .MuiPaginationItem-icon': {
                          color: PAGE_PRIMARY,
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default Webinars
