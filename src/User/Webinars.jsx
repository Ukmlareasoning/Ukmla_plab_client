import { useEffect, useState } from 'react'
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
  useTheme,
} from '@mui/material'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImage from '../assets/hero.jpg'

// Page primary (#384D84 — match Home, AboutUs, Courses, Pricing)
const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

// Static webinars (Active only for user-facing list)
const WEBINARS_DATA = [
  {
    id: 1,
    eventTitle: 'UKMLA PLAB 1 Overview',
    description: 'Overview',
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
  },
  {
    id: 2,
    eventTitle: 'Clinical Reasoning Workshop',
    description: ' Hands-on workshop on clinicalHands-on workshop on clinical ',
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
  },
  {
    id: 3,
    eventTitle: 'Ethics & Communication',
    description: 'Ethics and communication',
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
  },
  {
    id: 4,
    eventTitle: 'Data Interpretation Masterclass',
    description: 'Data interpretation',
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
  },
]

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const formatTime = (t) => {
  if (!t) return '—'
  if (t.length === 5 && t.includes(':')) return t
  if (t.length >= 4) return `${t.slice(0, 2)}:${t.slice(2, 4)}`
  return t
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

function WebinarCard({ webinar }) {
  const theme = useTheme()
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

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

        {/* Start & End date-time (after Online/Onsite, before title) — same format for both */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.8125rem',
            fontWeight: 600,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'wrap',
          }}
        >
          <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: PAGE_PRIMARY }} />
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

        {/* All details (same fields as AdminAddWebinar) — Description with 3-line clamp + Show more/less */}
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
                  WebkitLineClamp: descriptionExpanded ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {webinar.description}
              </Typography>
              <Button
                size="small"
                onClick={() => setDescriptionExpanded((e) => !e)}
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
                {descriptionExpanded ? 'Show less' : 'Show more'}
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
    </Card>
  )
}

function Webinars() {
  const theme = useTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const activeWebinars = WEBINARS_DATA.filter((w) => w.status === 'Active')

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
        {/* Hero */}
        <Box
          component="section"
          aria-label="Webinars Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 280, md: 320 },
            py: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.05)} 45%, transparent 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container>
              <Grid item xs={12} md={8} lg={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: '7px',
                    bgcolor: alpha(theme.palette.background.paper, 0.15),
                    backdropFilter: 'blur(30px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.common.white, 0.25),
                    animation: 'fadeInUp 0.6s ease-out forwards',
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(PAGE_PRIMARY, 0.2),
                      color: PAGE_PRIMARY,
                      mb: 1.5,
                    }}
                  >
                    <VideoCallRoundedIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: { xs: '1.75rem', md: '2rem' },
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      mb: 1,
                    }}
                  >
                    Webinars
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: { xs: '0.9375rem', md: '1rem' } }}>
                    Join live sessions and workshops on UKMLA & PLAB 1 reasoning, ethics, and exam preparation.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
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
            {activeWebinars.length === 0 ? (
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
                  No webinars at the moment
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  New sessions will be listed here. Check back soon.
                </Typography>
              </Paper>
            ) : (
              <Grid
                container
                spacing={{ xs: 2, sm: 3 }}
                sx={{ width: '100%', maxWidth: '100%', margin: 0, justifyContent: 'center' }}
              >
                {activeWebinars.map((webinar) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    key={webinar.id}
                    sx={{ display: 'flex', minWidth: 0 }}
                  >
                    <WebinarCard webinar={webinar} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default Webinars
