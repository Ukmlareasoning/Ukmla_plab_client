import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
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
  Skeleton,
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
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ViewListIcon from '@mui/icons-material/ViewList'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

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

const WEBINARS_PER_PAGE = 4

/** Parse date+time from API (handles date + "HH:MM"/"HH:MM:SS" or full ISO/datetime string) */
function toWebinarMs(dateStr, timeStr, fallbackTime) {
  const date = dateStr ? String(dateStr).trim() : ''
  let time = timeStr != null ? String(timeStr).trim() : fallbackTime
  if (!date && !time) return 0
  // If time is a full datetime/ISO string, take only the time part and use our date
  if (time && (time.includes('T') || (time.includes('-') && time.length > 10))) {
    const match = time.match(/(\d{1,2}:\d{2}(?::\d{2})?)/)
    if (match) time = match[1]
    else {
      const ms = new Date(time).getTime()
      if (!Number.isNaN(ms)) return ms
    }
  }
  if (!date) return 0
  const timePart = time || fallbackTime
  const normalized = timePart.length > 8 ? timePart.slice(0, 8) : timePart
  const combined = `${date}T${normalized}`
  const ms = new Date(combined).getTime()
  return Number.isNaN(ms) ? 0 : ms
}

function getWebinarEndMs(w) {
  return toWebinarMs(w.endDate || w.startDate, w.endTime, '23:59')
}

function getWebinarStartMs(w) {
  return toWebinarMs(w.startDate, w.startTime, '00:00')
}

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export const formatTime = (t) => {
  if (!t) return '—'
  // "HH:MM:SS" or "HH:MM"
  if (typeof t === 'string') {
    const parts = t.split(':')
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
  }
  return t
}

function formatCountdown(ms) {
  if (ms <= 0) return null
  const totalSec = Math.floor(ms / 1000)
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n) => String(n).padStart(2, '0')
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
  if (h > 0) return `${pad(h)}h ${pad(m)}m ${pad(s)}s`
  return `${pad(m)}m ${pad(s)}s`
}

/** Shared Dialog chrome: top bar + mobile handle */
function DialogShell({ open, onClose, isMobile, title, subtitle, icon: IconComp, children, actions }) {
  const theme = useTheme()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      sx={isMobile ? { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } } : {}}
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
            ? `0 -8px 32px rgba(15,23,42,0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
            : `0 24px 48px rgba(15,23,42,0.16), 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.06)}`,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 5,
            background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
          },
        },
      }}
    >
      {isMobile && (
        <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', bgcolor: alpha(PAGE_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.1) }}>
          <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
        </Box>
      )}
      <DialogTitle component="div" sx={{ pt: { xs: 2.5, sm: 3 }, pb: 2, px: { xs: 2.5, sm: 3.5 }, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.1), bgcolor: alpha(PAGE_PRIMARY, 0.02) }}>
        <Box sx={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(PAGE_PRIMARY, 0.12), color: PAGE_PRIMARY, border: '2px solid', borderColor: alpha(PAGE_PRIMARY, 0.2), boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.2)}` }}>
          <IconComp sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{title}</Typography>
          {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>{subtitle}</Typography>}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5, pb: 2, px: { xs: 2.5, sm: 3.5 } }}>{children}</DialogContent>
      <DialogActions sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2, pt: 1.5, pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 }, borderTop: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.5), bgcolor: theme.palette.grey[50], gap: 1, flexWrap: 'wrap' }}>
        {actions}
      </DialogActions>
    </Dialog>
  )
}

function DetailRow({ label, value, icon }) {
  const theme = useTheme()
  if (value == null || value === '') return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4), transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.04), borderColor: alpha(PAGE_PRIMARY, 0.2) } }}>
      {icon && (
        <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(PAGE_PRIMARY, 0.1), color: PAGE_PRIMARY }}>
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.5, fontSize: '0.6875rem' }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, wordBreak: 'break-word', fontWeight: 500 }}>{value}</Typography>
      </Box>
    </Box>
  )
}

/** Countdown badge shown on current webinars */
function CountdownBadge({ endMs }) {
  const [remaining, setRemaining] = useState(() => endMs - Date.now())
  const theme = useTheme()
  useEffect(() => {
    const id = setInterval(() => setRemaining(endMs - Date.now()), 1000)
    return () => clearInterval(id)
  }, [endMs])
  if (remaining <= 0) return null
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.5, borderRadius: '7px', bgcolor: alpha(theme.palette.warning.main, 0.12), border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`, mb: 1.5 }}>
      <AccessTimeRoundedIcon sx={{ fontSize: 15, color: theme.palette.warning.dark }} />
      <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.warning.dark, fontSize: '0.75rem', letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>
        Ends in: {formatCountdown(remaining)}
      </Typography>
    </Box>
  )
}

export function WebinarCard({ webinar, onBookingSuccess, isAlreadyBooked = false }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false)
  const [loginRequiredDialogOpen, setLoginRequiredDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookedLocally, setBookedLocally] = useState(false)

  const isBooked = isAlreadyBooked || bookedLocally

  const isOnline = webinar.presence === 'Online'
  const endMs = getWebinarEndMs(webinar)
  const startMs = getWebinarStartMs(webinar)
  const isPast = endMs > 0 && Date.now() > endMs
  const remaining = webinar.remainingSeats
  const isFull = remaining !== null && remaining !== undefined && remaining <= 0

  const handleBooking = () => {
    if (!isLoggedIn) { setLoginRequiredDialogOpen(true); return }
    if (isPast || isFull || isBooked) return
    setBookingError('')
    setConfirmDialogOpen(true)
  }

  const handleConfirmBook = async () => {
    setBookingLoading(true)
    setBookingError('')
    try {
      const { ok, data } = await apiClient(`/webinars/${webinar.id}/book`, 'POST')
      if (!ok || !data?.success) {
        const msg = data?.errors
          ? Object.values(data.errors).flat().join(' ')
          : data?.message
        setBookingError(msg || 'Booking failed. Please try again.')
        return
      }
      setBookedLocally(true)
      setConfirmDialogOpen(false)
      showToast(data?.message || 'Webinar booked successfully.', 'success')
      if (onBookingSuccess) onBookingSuccess()
    } catch {
      setBookingError('Unable to reach server. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const bookBtnLabel = isBooked ? 'Already Booked' : isPast ? 'Session ended' : isFull ? 'Fully booked' : 'Book Now'
  const bookBtnDisabled = isBooked || isPast || isFull

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%', minWidth: 0, height: '100%',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid', borderColor: alpha(theme.palette.grey[300], 0.5),
        borderRadius: '12px', bgcolor: 'background.paper',
        boxShadow: `0 8px 32px ${alpha(PAGE_PRIMARY, 0.08)}`,
        '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: `linear-gradient(180deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`, opacity: 0, transition: 'opacity 0.4s' },
        '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`, opacity: 0, transition: 'opacity 0.4s' },
        '&:hover': { borderColor: alpha(PAGE_PRIMARY, 0.5), boxShadow: `0 24px 56px ${alpha(PAGE_PRIMARY, 0.2)}, 0 0 0 2px ${alpha(PAGE_PRIMARY, 0.12)}`, transform: 'translateY(-10px)', '&::before': { opacity: 1 }, '&::after': { opacity: 1 }, '& .webinar-banner-overlay': { opacity: 0.3 } },
      }}
    >
      {/* Banner */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          component="img"
          src={webinar.bannerImage || ''}
          alt={webinar.eventTitle}
          onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240"><rect fill="#E2E8F0" width="800" height="240"/><text x="400" y="125" fill="#94A3B8" text-anchor="middle" font-size="18">Webinar Banner</text></svg>') }}
          sx={{ width: '100%', height: 240, objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
        />
        <Box className="webinar-banner-overlay" sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 0%, ${alpha(PAGE_PRIMARY_DARK, 0.6)} 100%)`, opacity: 0.15, transition: 'opacity 0.4s' }} />
      </Box>

      <CardContent sx={{ p: { xs: 2.5, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Price + Online/Onsite + Seats chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
          {webinar.price === 0 ? (
            <Chip label="Free" size="small" sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.8125rem', height: 28, px: 0.5, bgcolor: alpha(theme.palette.success.main, 0.15), color: theme.palette.success.dark, border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` }} />
          ) : (
            <Chip icon={<EuroRoundedIcon sx={{ fontSize: 15 }} />} label={`€${Number(webinar.price).toFixed(2)}`} size="small" sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.8125rem', height: 28, px: 0.5, bgcolor: alpha(PAGE_PRIMARY, 0.12), color: PAGE_PRIMARY_DARK, border: `1px solid ${alpha(PAGE_PRIMARY, 0.25)}`, '& .MuiChip-icon': { color: 'inherit' } }} />
          )}
          <Chip
            icon={isOnline ? <LinkRoundedIcon sx={{ fontSize: 15 }} /> : <LocationOnRoundedIcon sx={{ fontSize: 15 }} />}
            label={isOnline ? 'Online' : 'Onsite'}
            size="small"
            sx={{ borderRadius: '8px', fontSize: '0.8125rem', height: 28, px: 0.5, bgcolor: alpha(theme.palette.grey[500], 0.1), color: 'text.secondary', fontWeight: 600, border: `1px solid ${alpha(theme.palette.grey[400], 0.25)}`, '& .MuiChip-icon': { color: 'inherit' } }}
          />
          {remaining !== null && remaining !== undefined && (
            <Chip
              icon={<PeopleAltRoundedIcon sx={{ fontSize: 14 }} />}
              label={remaining === 0 ? 'Full' : `${remaining} seats left`}
              size="small"
              sx={{ borderRadius: '8px', fontSize: '0.75rem', height: 26, fontWeight: 700, bgcolor: remaining === 0 ? alpha(theme.palette.error.main, 0.12) : alpha(theme.palette.success.main, 0.12), color: remaining === 0 ? theme.palette.error.dark : theme.palette.success.dark, border: `1px solid ${alpha(remaining === 0 ? theme.palette.error.main : theme.palette.success.main, 0.3)}`, '& .MuiChip-icon': { color: 'inherit' } }}
            />
          )}
          {isPast && (
            <Chip icon={<EventBusyRoundedIcon sx={{ fontSize: 14 }} />} label="Ended" size="small" sx={{ borderRadius: '8px', fontSize: '0.75rem', height: 26, fontWeight: 700, bgcolor: alpha(theme.palette.grey[500], 0.12), color: 'text.secondary', border: `1px solid ${alpha(theme.palette.grey[400], 0.3)}`, '& .MuiChip-icon': { color: 'inherit' } }} />
          )}
          {isBooked && (
            <Chip icon={<LockRoundedIcon sx={{ fontSize: 14 }} />} label="Already Booked" size="small" sx={{ borderRadius: '8px', fontSize: '0.75rem', height: 26, fontWeight: 700, bgcolor: alpha(theme.palette.success.main, 0.15), color: theme.palette.success.dark, border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`, '& .MuiChip-icon': { color: 'inherit' } }} />
          )}
        </Box>

        {/* Date & time */}
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.8125rem' }, fontWeight: 600, mb: 1.25, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          <CalendarMonthRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: PAGE_PRIMARY, flexShrink: 0 }} />
          {formatDate(webinar.startDate)}{webinar.startTime && `, ${formatTime(webinar.startTime)}`}
          {(webinar.endDate || webinar.endTime) && (
            <> – {formatDate(webinar.endDate || webinar.startDate)}{webinar.endTime && `, ${formatTime(webinar.endTime)}`}</>
          )}
        </Typography>

        {/* Real-time countdown to end (only for current webinars that haven't ended) */}
        {!isPast && endMs > 0 && <CountdownBadge endMs={endMs} />}

        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: { xs: '1.125rem', md: '1.25rem' }, lineHeight: 1.3, color: 'text.primary', letterSpacing: '-0.01em' }}>
          {webinar.eventTitle}
        </Typography>

        {/* Description */}
        {webinar.description && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(PAGE_PRIMARY, 0.1), color: PAGE_PRIMARY }}>
              <VideoCallRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.5, fontSize: '0.6875rem' }}>Description</Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, fontWeight: 500, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {webinar.description}
              </Typography>
              <Button size="small" onClick={() => setDescriptionDialogOpen(true)} sx={{ mt: 0.5, p: 0, minHeight: 0, fontSize: '0.8125rem', fontWeight: 600, color: PAGE_PRIMARY, textTransform: 'none', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                Show more
              </Button>
            </Box>
          </Box>
        )}

        <DetailRow label={isOnline ? 'Online Meeting Link' : 'Venue Address'} value={isOnline ? webinar.zoomMeetingLink : webinar.address} icon={isOnline ? <LinkRoundedIcon sx={{ fontSize: 16 }} /> : <LocationOnRoundedIcon sx={{ fontSize: 16 }} />} />
        {webinar.maxAttendees && <DetailRow label="Max Attendees" value={`Up to ${webinar.maxAttendees} participants`} icon={<GroupsRoundedIcon sx={{ fontSize: 16 }} />} />}

        {/* Book Now button */}
        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={bookBtnDisabled}
            startIcon={isBooked ? <LockRoundedIcon sx={{ fontSize: 22 }} /> : isPast ? <EventBusyRoundedIcon sx={{ fontSize: 22 }} /> : <EventAvailableRoundedIcon sx={{ fontSize: 22 }} />}
            onClick={handleBooking}
            sx={{
              py: 1.5, borderRadius: '10px', fontWeight: 700, fontSize: '1.0625rem', textTransform: 'none',
              background: bookBtnDisabled ? undefined : `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
              boxShadow: bookBtnDisabled ? 'none' : `0 6px 18px ${alpha(PAGE_PRIMARY, 0.45)}`,
              transition: 'all 0.3s ease',
              '&:hover': bookBtnDisabled ? {} : { background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`, boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.55)}`, transform: 'translateY(-2px)' },
            }}
          >
            {bookBtnLabel}
          </Button>
        </Box>
      </CardContent>

      {/* Description dialog */}
      <DialogShell open={descriptionDialogOpen} onClose={() => setDescriptionDialogOpen(false)} isMobile={isMobile} title="Description" subtitle={webinar.eventTitle} icon={VideoCallRoundedIcon} actions={
        <Button onClick={() => setDescriptionDialogOpen(false)} startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', borderRadius: '7px', px: 2, '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06), color: PAGE_PRIMARY } }}>Close</Button>
      }>
        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{webinar.description}</Typography>
      </DialogShell>

      {/* Login required dialog */}
      <DialogShell open={loginRequiredDialogOpen} onClose={() => setLoginRequiredDialogOpen(false)} isMobile={isMobile} title="Login required" subtitle="Book this webinar" icon={LockRoundedIcon} actions={
        <>
          <Button onClick={() => setLoginRequiredDialogOpen(false)} startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', borderRadius: '7px', px: 2, '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06), color: PAGE_PRIMARY } }}>Cancel</Button>
          <Button variant="contained" onClick={() => { setLoginRequiredDialogOpen(false); navigate('/sign-in') }} startIcon={<LoginRoundedIcon sx={{ fontSize: 20 }} />} sx={{ fontWeight: 700, fontSize: '0.9375rem', textTransform: 'none', borderRadius: '7px', px: 2.5, py: 1, background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`, boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}`, '&:hover': { background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`, boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.5)}` } }}>Login</Button>
        </>
      }>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <InfoOutlinedIcon sx={{ fontSize: 22, color: PAGE_PRIMARY, mt: 0.25, flexShrink: 0 }} />
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: '0.9375rem' }}>You can only book a webinar once you are logged in. Please sign in to your account to continue.</Typography>
        </Box>
      </DialogShell>

      {/* Confirm booking dialog */}
      <DialogShell open={confirmDialogOpen} onClose={() => { if (!bookingLoading) setConfirmDialogOpen(false) }} isMobile={isMobile} title="Confirm booking" subtitle={webinar.eventTitle} icon={EventAvailableRoundedIcon} actions={
        <>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={bookingLoading} startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.9375rem', textTransform: 'none', borderRadius: '7px', px: 2, '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06), color: PAGE_PRIMARY } }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmBook}
            disabled={bookingLoading}
            startIcon={
              bookingLoading ? (
                <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff', fontSize: 20 }} />
              ) : (
                <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
              )
            }
            sx={{
              '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
              fontWeight: 700,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '7px',
              px: 2.5,
              py: 1,
              color: '#fff',
              background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)`,
              boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.4)}`,
              '&:hover': { background: `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)`, boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.5)}` },
              '&.Mui-disabled': { color: '#fff' },
            }}
          >
            {bookingLoading ? 'Booking…' : 'Confirm Booking'}
          </Button>
        </>
      }>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <InfoOutlinedIcon sx={{ fontSize: 22, color: PAGE_PRIMARY, mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: '0.9375rem' }}>
              Are you sure you want to book <strong>{webinar.eventTitle}</strong>?
              {webinar.price === 0 ? ' This webinar is free.' : ` This is a paid webinar (€${Number(webinar.price).toFixed(2)}).`}
            </Typography>
          </Box>
          {remaining !== null && remaining !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleAltRoundedIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {remaining} {remaining === 1 ? 'seat' : 'seats'} remaining out of {webinar.maxAttendees}
              </Typography>
            </Box>
          )}
          {bookingError && (
            <Box sx={{ p: 1.5, borderRadius: '7px', bgcolor: alpha('#d32f2f', 0.08), border: '1px solid', borderColor: alpha('#d32f2f', 0.3) }}>
              <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>{bookingError}</Typography>
            </Box>
          )}
        </Box>
      </DialogShell>
    </Card>
  )
}

function WebinarSkeleton() {
  return (
    <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid', borderColor: alpha('#94a3b8', 0.3), overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={240} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={28} sx={{ borderRadius: '8px' }} />
          <Skeleton variant="rounded" width={70} height={28} sx={{ borderRadius: '8px' }} />
        </Box>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={32} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="75%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: '8px', mb: 1.5 }} />
        <Skeleton variant="rounded" width="100%" height={52} sx={{ borderRadius: '8px', mb: 1.5 }} />
        <Skeleton variant="rounded" width="100%" height={52} sx={{ borderRadius: '8px', mt: 3 }} />
      </CardContent>
    </Card>
  )
}

function Webinars() {
  const theme = useTheme()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const [page, setPage] = useState(1)
  const [webinarFilter, setWebinarFilter] = useState('current')

  const [webinars, setWebinars] = useState([])
  const [bookedIds, setBookedIds] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const fetchRef = useRef(0)

  useEffect(() => {
    window.scrollTo(0, 0)
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

  const fetchMyBookings = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      const { ok, data } = await apiClient('/webinars/my-bookings', 'GET')
      if (ok && data?.success && Array.isArray(data.data?.webinar_ids)) {
        setBookedIds(data.data.webinar_ids)
      } else {
        setBookedIds([])
      }
    } catch {
      setBookedIds([])
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchWebinars()
  }, [fetchWebinars])

  useEffect(() => {
    if (isLoggedIn) fetchMyBookings()
    else setBookedIds([])
  }, [isLoggedIn, fetchMyBookings])

  const now = Date.now()

  const currentWebinars = useMemo(() => {
    const list = webinars.filter((w) => {
      if (w.is_deleted) return false
      const endMs = getWebinarEndMs(w)
      // endMs 0 = unparseable → show in current so we don't hide data
      return endMs === 0 || endMs > now
    })
    return list.sort((a, b) => getWebinarStartMs(a) - getWebinarStartMs(b))
  }, [webinars, now])

  const pastWebinars = useMemo(() => {
    const list = webinars.filter((w) => {
      if (w.is_deleted) return false
      const endMs = getWebinarEndMs(w)
      return endMs > 0 && endMs <= now
    })
    return list.sort((a, b) => getWebinarEndMs(b) - getWebinarEndMs(a))
  }, [webinars, now])

  const filteredWebinars = webinarFilter === 'current' ? currentWebinars : pastWebinars

  const totalPages = Math.max(1, Math.ceil(filteredWebinars.length / WEBINARS_PER_PAGE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const paginatedWebinars = useMemo(() => {
    const start = (safePage - 1) * WEBINARS_PER_PAGE
    return filteredWebinars.slice(start, start + WEBINARS_PER_PAGE)
  }, [filteredWebinars, safePage])

  const handleWebinarFilterChange = (value) => {
    setWebinarFilter(value)
    setPage(1)
  }

  return (
    <Box sx={{ width: '100%', minWidth: '100%', maxWidth: '100vw', minHeight: '100vh', overflowX: 'hidden', bgcolor: 'background.default' }}>
      <Header />

      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
        {/* Hero */}
        <Box
          component="section"
          aria-label="Webinars Hero"
          sx={{
            width: '100%', minHeight: { xs: 420, sm: 460, md: 500 },
            py: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, sm: 3, md: 4 },
            display: 'flex', flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center', justifyContent: 'space-between', gap: { xs: 4, md: 6 },
            bgcolor: HERO_BG, background: `linear-gradient(180deg, #243b55 0%, ${HERO_BG} 50%, #182d47 100%)`,
          }}
        >
          <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' }, maxWidth: { md: '55%' } }}>
            <Typography component="h1" sx={{ fontSize: { xs: '1.65rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' }, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, letterSpacing: '-0.02em', mb: 2 }}>Webinars</Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' }, fontWeight: 400, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6, mb: 3 }}>
              Join live sessions and workshops on UKMLA & PLAB 1 reasoning, ethics, and exam preparation.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[{ icon: VideoCallRoundedIcon, label: 'Live Sessions' }, { icon: EventAvailableRoundedIcon, label: 'UKMLA & PLAB 1' }, { icon: GroupsRoundedIcon, label: 'Online & in-person' }].map(({ icon: Icon, label }) => (
                <Chip key={label} icon={<Icon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />} label={label} size="small" sx={{ borderRadius: '7px', bgcolor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 600, fontSize: '0.75rem', height: 28, border: '1px solid rgba(255,255,255,0.3)', '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' } }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '45%' }, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' }, minHeight: { xs: 260, md: 340 } }}>
            <Box component="img" src={heroImg} alt="UKMLA clinical reasoning interface" sx={{ maxWidth: '100%', height: 'auto', maxHeight: { xs: 260, md: 360 }, objectFit: 'contain', borderRadius: '7px' }} />
          </Box>
        </Box>

        {/* List section */}
        <Box component="section" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 }, animation: 'fadeInUp 0.6s ease-out 0.15s both', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Container maxWidth="lg" sx={{ mx: 'auto', width: '100%' }}>

            {/* Pill tabs */}
            <Box role="tablist" aria-label="Current or past webinars" sx={{ display: 'flex', p: 0.75, mb: 3, borderRadius: '7px', bgcolor: theme.palette.grey[100], border: '1px solid', borderColor: alpha(theme.palette.grey[400], 0.4), boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)' }}>
              {[{ value: 'current', label: 'Current Webinars', icon: ScheduleRoundedIcon }, { value: 'past', label: 'Past Webinars', icon: HistoryRoundedIcon }].map(({ value, label, icon: Icon }) => (
                <Box key={value} component="button" type="button" role="tab" aria-selected={webinarFilter === value} onClick={() => handleWebinarFilterChange(value)}
                  sx={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                    py: 1.25, px: 2, border: 'none', borderRadius: '7px', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9375rem',
                    color: webinarFilter === value ? '#fff' : theme.palette.text.secondary,
                    background: webinarFilter === value ? `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_DARK} 100%)` : 'transparent',
                    boxShadow: webinarFilter === value ? `0 2px 8px ${alpha(PAGE_PRIMARY, 0.35)}` : 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { color: webinarFilter === value ? '#fff' : PAGE_PRIMARY, background: webinarFilter === value ? `linear-gradient(135deg, ${PAGE_PRIMARY_DARK} 0%, ${PAGE_PRIMARY} 100%)` : alpha(PAGE_PRIMARY, 0.08), boxShadow: webinarFilter === value ? `0 3px 12px ${alpha(PAGE_PRIMARY, 0.4)}` : 'none' },
                    '& svg': { color: 'inherit' },
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                  {label}
                </Box>
              ))}
            </Box>

            {/* Error */}
            {listError && (
              <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.08) }}>
                <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>{listError}</Typography>
              </Paper>
            )}

            {/* Skeleton loading */}
            {listLoading ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, sm: 3 } }}>
                {Array.from({ length: WEBINARS_PER_PAGE }).map((_, i) => <WebinarSkeleton key={i} />)}
              </Box>
            ) : filteredWebinars.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, borderRadius: '7px', border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.6), bgcolor: 'background.paper', textAlign: 'center' }}>
                <VideoCallRoundedIcon sx={{ fontSize: 56, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>{webinarFilter === 'current' ? 'No upcoming webinars' : 'No past webinars'}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{webinarFilter === 'current' ? 'New sessions will be listed here. Check back soon.' : 'Past sessions will appear here once they have ended.'}</Typography>
              </Paper>
            ) : (
              <>
                {/* Results count */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <ViewListIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.9375rem' }}>
                    {(() => {
                      const start = (safePage - 1) * WEBINARS_PER_PAGE + 1
                      const end = Math.min(safePage * WEBINARS_PER_PAGE, filteredWebinars.length)
                      const total = filteredWebinars.length
                      return `Showing ${start === end ? start : `${start}–${end}`} of ${total} ${total === 1 ? 'webinar' : 'webinars'}`
                    })()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, sm: 3 }, width: '100%' }}>
                  {paginatedWebinars.map((webinar) => (
                    <Box key={webinar.id} sx={{ minWidth: 0, display: 'flex' }}>
                      <WebinarCard
                        webinar={webinar}
                        isAlreadyBooked={bookedIds.includes(webinar.id)}
                        onBookingSuccess={() => {
                          fetchWebinars()
                          fetchMyBookings()
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, pt: 4, borderTop: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4), gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <TrendingUpIcon sx={{ color: PAGE_PRIMARY, fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Page {safePage} of {totalPages}</Typography>
                    </Box>
                    <Pagination count={totalPages} page={safePage} onChange={(_, v) => setPage(v)} size="large" showFirstButton showLastButton
                      sx={{ '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: '0.9375rem', borderRadius: '7px' }, '& .MuiPaginationItem-page.Mui-selected': { background: `linear-gradient(135deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_DARK})`, color: '#fff', boxShadow: `0 2px 8px ${alpha(PAGE_PRIMARY, 0.4)}`, '&:hover': { background: `linear-gradient(135deg, ${PAGE_PRIMARY_LIGHT}, ${PAGE_PRIMARY})` } }, '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(PAGE_PRIMARY, 0.1), color: PAGE_PRIMARY }, '& .MuiPaginationItem-icon': { color: PAGE_PRIMARY } }}
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
