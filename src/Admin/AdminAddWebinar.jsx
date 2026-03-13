import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'

// Admin primary (#384D84 — no green)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

const inputSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(ADMIN_PRIMARY, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: ADMIN_PRIMARY,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: 'text.secondary',
    fontWeight: 600,
    '&.Mui-focused': { color: ADMIN_PRIMARY },
    '&.Mui-error': { color: 'error.main' },
  },
})

const selectSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(ADMIN_PRIMARY, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: ADMIN_PRIMARY,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: 'text.secondary',
    fontWeight: 600,
    '&.Mui-focused': { color: ADMIN_PRIMARY },
    '&.Mui-error': { color: 'error.main' },
  },
})

// 24 hours with 30 min gap: 00:00, 00:30, 01:00, ... 23:30
const TIME_OPTIONS = (() => {
  const opts = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      opts.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return opts
})()

const PRESENCE_OPTIONS = [
  { value: 'Online', label: 'Online' },
  { value: 'Onsite', label: 'Onsite' },
]

const normalizeTimeForSelect = (value) => {
  if (!value) return ''
  const str = String(value)
  const match = str.match(/(\d{2}):(\d{2})/)
  if (match) {
    return `${match[1]}:${match[2]}`
  }
  return ''
}

function AdminAddWebinar() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const location = useLocation()
  const { showToast } = useToast()

  const editingWebinar = location.state?.webinar || null
  const isEditMode = !!editingWebinar?.id

  const today = (() => {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
  })()

  const nowHHMM = (() => {
    const d = new Date()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  })()

  const [eventTitle, setEventTitle] = useState(editingWebinar?.eventTitle || '')
  const [description, setDescription] = useState(editingWebinar?.description || '')
  const [startDate, setStartDate] = useState(editingWebinar?.startDate || '')
  const [endDate, setEndDate] = useState(editingWebinar?.endDate || '')
  const [startTime, setStartTime] = useState(
    normalizeTimeForSelect(editingWebinar?.startTime || editingWebinar?.start_time)
  )
  const [endTime, setEndTime] = useState(
    normalizeTimeForSelect(editingWebinar?.endTime || editingWebinar?.end_time)
  )
  const [presence, setPresence] = useState(editingWebinar?.presence || '')
  const [meetingLink, setMeetingLink] = useState(editingWebinar?.zoomMeetingLink || '')
  const [address, setAddress] = useState(editingWebinar?.address || '')
  const [price, setPrice] = useState(
    editingWebinar && typeof editingWebinar.price !== 'undefined' ? String(editingWebinar.price) : ''
  )
  const [maxAttendees, setMaxAttendees] = useState(
    editingWebinar && typeof editingWebinar.maxAttendees !== 'undefined'
      ? String(editingWebinar.maxAttendees)
      : ''
  )
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(editingWebinar?.bannerImage || null)

  const [eventTitleError, setEventTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [startTimeError, setStartTimeError] = useState('')
  const [endTimeError, setEndTimeError] = useState('')
  const [presenceError, setPresenceError] = useState('')
  const [meetingLinkError, setMeetingLinkError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [maxAttendeesError, setMaxAttendeesError] = useState('')
  const [bannerError, setBannerError] = useState('')
  const [loading, setLoading] = useState(false)

  const effectiveStartDateMin = !isEditMode || !startDate || startDate >= today ? today : startDate
  const effectiveEndDateMin = !isEditMode || !endDate || endDate >= today ? today : endDate

  const originalStartTime = isEditMode
    ? normalizeTimeForSelect(editingWebinar?.startTime || editingWebinar?.start_time)
    : ''
  const originalEndTime = isEditMode
    ? normalizeTimeForSelect(editingWebinar?.endTime || editingWebinar?.end_time)
    : ''

  const buildTimeOptionsWithOriginal = (original) => {
    if (!original) return TIME_OPTIONS
    return TIME_OPTIONS.includes(original) ? TIME_OPTIONS : [original, ...TIME_OPTIONS]
  }

  const startTimeOptions = buildTimeOptionsWithOriginal(originalStartTime)
  const endTimeOptions = buildTimeOptionsWithOriginal(originalEndTime)

  const isPastStartTimeOption = (t) => {
    if (!startDate) return false
    if (startDate > today) return false
    if (isEditMode && startDate < today && t === originalStartTime) return false
    if (startDate < today) return true
    if (isEditMode && t === originalStartTime) return false
    return t < nowHHMM
  }

  const isPastEndTimeOption = (t) => {
    if (!endDate) return false
    if (endDate > today) return false
    if (isEditMode && endDate < today && t === originalEndTime) return false
    if (endDate < today) return true
    if (isEditMode && t === originalEndTime) return false
    return t < nowHHMM
  }

  useEffect(() => {
    if (editingWebinar) {
      setEventTitle(editingWebinar.eventTitle || '')
      setDescription(editingWebinar.description || '')
      setStartDate(editingWebinar.startDate || editingWebinar.start_date || '')
      setEndDate(editingWebinar.endDate || editingWebinar.end_date || '')
      setStartTime(
        normalizeTimeForSelect(editingWebinar.startTime || editingWebinar.start_time)
      )
      setEndTime(normalizeTimeForSelect(editingWebinar.endTime || editingWebinar.end_time))
      setPresence(editingWebinar.presence || '')
      setMeetingLink(editingWebinar.zoomMeetingLink || '')
      setAddress(editingWebinar.address || '')
      setPrice(
        typeof editingWebinar.price !== 'undefined' ? String(editingWebinar.price) : ''
      )
      setMaxAttendees(
        typeof editingWebinar.maxAttendees !== 'undefined'
          ? String(editingWebinar.maxAttendees)
          : ''
      )
      if (editingWebinar.bannerImage) {
        setBannerPreview(editingWebinar.bannerImage)
      }
    }
  }, [editingWebinar])

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      if (bannerError) setBannerError('')
      const reader = new FileReader()
      reader.onloadend = () => setBannerPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveBanner = () => {
    setBannerFile(null)
    setBannerPreview(null)
    if (bannerError) setBannerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setEventTitleError('')
    setDescriptionError('')
    setStartDateError('')
    setEndDateError('')
    setStartTimeError('')
    setEndTimeError('')
    setPresenceError('')
    setMeetingLinkError('')
    setAddressError('')
    setPriceError('')
    setMaxAttendeesError('')
    setBannerError('')

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('event_title', eventTitle || '')
      formData.append('description', description || '')
      formData.append('start_date', startDate || '')
      formData.append('end_date', endDate || '')
      formData.append('start_time', startTime || '')
      formData.append('end_time', endTime || '')
      formData.append('presence', presence || '')
      formData.append('zoom_meeting_link', meetingLink || '')
      formData.append('address', address || '')
      formData.append('price', price || '')
      formData.append('max_attendees', maxAttendees || '')
      if (bannerFile) {
        formData.append('banner_image', bannerFile)
      }

      const path = isEditMode ? `/webinars/${editingWebinar.id}` : '/webinars'
      const method = 'POST'

      const { ok, data } = await apiClient(path, method, formData)

      if (!ok || !data?.success) {
        const errors = data?.errors || {}

        if (errors.event_title) {
          const msg = Array.isArray(errors.event_title) ? errors.event_title[0] : errors.event_title
          setEventTitleError(String(msg))
        }
        if (errors.description) {
          const msg = Array.isArray(errors.description) ? errors.description[0] : errors.description
          setDescriptionError(String(msg))
        }
        if (errors.start_date) {
          const msg = Array.isArray(errors.start_date) ? errors.start_date[0] : errors.start_date
          setStartDateError(String(msg))
        }
        if (errors.end_date) {
          const msg = Array.isArray(errors.end_date) ? errors.end_date[0] : errors.end_date
          setEndDateError(String(msg))
        }
        if (errors.start_time) {
          const msg = Array.isArray(errors.start_time) ? errors.start_time[0] : errors.start_time
          setStartTimeError(String(msg))
        }
        if (errors.end_time) {
          const msg = Array.isArray(errors.end_time) ? errors.end_time[0] : errors.end_time
          setEndTimeError(String(msg))
        }
        if (errors.presence) {
          const msg = Array.isArray(errors.presence) ? errors.presence[0] : errors.presence
          setPresenceError(String(msg))
        }
        if (errors.zoom_meeting_link) {
          const msg = Array.isArray(errors.zoom_meeting_link) ? errors.zoom_meeting_link[0] : errors.zoom_meeting_link
          setMeetingLinkError(String(msg))
        }
        if (errors.address) {
          const msg = Array.isArray(errors.address) ? errors.address[0] : errors.address
          setAddressError(String(msg))
        }
        if (errors.price) {
          const msg = Array.isArray(errors.price) ? errors.price[0] : errors.price
          setPriceError(String(msg))
        }
        if (errors.max_attendees) {
          const msg = Array.isArray(errors.max_attendees) ? errors.max_attendees[0] : errors.max_attendees
          setMaxAttendeesError(String(msg))
        }
        if (errors.banner_image) {
          const msg = Array.isArray(errors.banner_image) ? errors.banner_image[0] : errors.banner_image
          setBannerError(String(msg))
        }

        if (
          !errors.event_title &&
          !errors.description &&
          !errors.start_date &&
          !errors.end_date &&
          !errors.start_time &&
          !errors.end_time &&
          !errors.presence &&
          !errors.zoom_meeting_link &&
          !errors.address &&
          !errors.price &&
          !errors.max_attendees &&
          !errors.banner_image
        ) {
          const message =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          if (message) {
            setEventTitleError(String(message))
          }
        }

        setLoading(false)
        return
      }

      showToast(
        isEditMode ? 'Webinar updated successfully.' : 'Webinar created successfully.',
        'success'
      )
      navigate('/admin/webinars')
    } catch {
      setEventTitleError('Unable to reach server. Please try again.')
      setLoading(false)
    }
  }

  const isOnline = presence === 'Online'
  const isOnsite = presence === 'Onsite'

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 1000,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Header with Back + title — same as AdminAddService */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <IconButton
          onClick={() => navigate('/admin/webinars')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': {
              bgcolor: alpha(ADMIN_PRIMARY, 0.15),
            },
          }}
          aria-label="Back to webinars"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {isEditMode ? 'Edit Webinar' : 'Add Webinar'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {isEditMode ? 'Update webinar details' : 'Create a new webinar or online event'}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          bgcolor: theme.palette.background.paper,
          boxShadow: { xs: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`, sm: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.04)}` },
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
      >
        {/* Centered section title — same as AdminAddService */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(ADMIN_PRIMARY, 0.1),
              color: ADMIN_PRIMARY,
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <VideoCallRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Add Webinar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create a new webinar or online event
          </Typography>
        </Box>

        {/* Title and Description on top */}
        <TextField
          fullWidth
          label="Event Title"
          value={eventTitle}
          onChange={(e) => {
            setEventTitle(e.target.value)
            if (eventTitleError) setEventTitleError('')
          }}
          placeholder="e.g. UKMLA PLAB 1 Overview"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(), mb: 2 }}
          error={!!eventTitleError}
          helperText={
            eventTitleError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {eventTitleError}
                </Typography>
              </Box>
            ) : null
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (descriptionError) setDescriptionError('')
          }}
          placeholder="Brief description of the webinar"
          variant="outlined"
          size="medium"
          multiline
          minRows={4}
          maxRows={8}
          sx={{
            ...inputSx(),
            mb: 2,
            '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
          }}
          error={!!descriptionError}
          helperText={
            descriptionError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {descriptionError}
                </Typography>
              </Box>
            ) : null
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                <DescriptionRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Start Date & End Date — two columns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <CalendarMonthRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                if (startDateError) setStartDateError('')
              }}
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: effectiveStartDateMin }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
              error={!!startDateError}
              helperText={
                startDateError ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {startDateError}
                    </Typography>
                  </Box>
                ) : null
              }
            />
          </Box>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <CalendarMonthRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                if (endDateError) setEndDateError('')
              }}
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: effectiveEndDateMin }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
              error={!!endDateError}
              helperText={
                endDateError ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {endDateError}
                    </Typography>
                  </Box>
                ) : null
              }
            />
          </Box>
        </Box>

        {/* Start Time & End Time — two columns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <ScheduleRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <FormControl
              fullWidth
              size="medium"
              error={!!startTimeError}
              sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
            >
              <InputLabel id="start-time-label" shrink>Start Time</InputLabel>
              <Select
                labelId="start-time-label"
                value={startTime}
                label="Start Time"
                onChange={(e) => {
                  setStartTime(e.target.value)
                  if (startTimeError) setStartTimeError('')
                }}
                notched
              >
                {startTimeOptions.map((t) => (
                  <MenuItem key={t} value={t} disabled={isPastStartTimeOption(t)}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
              {startTimeError && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {startTimeError}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Box>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <ScheduleRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <FormControl
              fullWidth
              size="medium"
              error={!!endTimeError}
              sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
            >
              <InputLabel id="end-time-label" shrink>End Time</InputLabel>
              <Select
                labelId="end-time-label"
                value={endTime}
                label="End Time"
                onChange={(e) => {
                  setEndTime(e.target.value)
                  if (endTimeError) setEndTimeError('')
                }}
                notched
              >
                {endTimeOptions.map((t) => (
                  <MenuItem key={t} value={t} disabled={isPastEndTimeOption(t)}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
              {endTimeError && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {endTimeError}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Box>
        </Box>

        {/* Presence — full width */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <PublicRoundedIcon
            sx={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              color: ADMIN_PRIMARY,
              fontSize: 22,
              pointerEvents: 'none',
            }}
          />
          <FormControl
            fullWidth
            size="medium"
            error={!!presenceError}
            sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
          >
            <InputLabel id="presence-label" shrink>Presence option (Onsite / Online)</InputLabel>
            <Select
              labelId="presence-label"
              value={presence}
              label="Presence option (Onsite / Online)"
              onChange={(e) => {
                setPresence(e.target.value)
                if (presenceError) setPresenceError('')
              }}
              notched
            >
              {PRESENCE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {presenceError && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {presenceError}
                </Typography>
              </Box>
            )}
          </FormControl>
        </Box>

        {isOnline && (
          <TextField
            fullWidth
            label="Google / Zoom meeting link"
            value={meetingLink}
            onChange={(e) => {
              setMeetingLink(e.target.value)
              if (meetingLinkError) setMeetingLinkError('')
            }}
            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            variant="outlined"
            size="medium"
            sx={{ ...inputSx(), mb: 2 }}
            error={!!meetingLinkError}
            helperText={
              meetingLinkError ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {meetingLinkError}
                  </Typography>
                </Box>
              ) : null
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {isOnsite && (
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              if (addressError) setAddressError('')
            }}
            placeholder="Venue address"
            variant="outlined"
            size="medium"
            multiline
            minRows={2}
            sx={{
              ...inputSx(),
              mb: 2,
              '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
            }}
            error={!!addressError}
            helperText={
              addressError ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {addressError}
                  </Typography>
                </Box>
              ) : null
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                  <LocationOnRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Price & Max Attendees — two columns like Add Service */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <EuroRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <TextField
              fullWidth
              label="Price (€)"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value)
                if (priceError) setPriceError('')
              }}
              placeholder="0 for free"
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
              error={!!priceError}
              helperText={
                priceError ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {priceError}
                    </Typography>
                  </Box>
                ) : null
              }
            />
          </Box>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <GroupsRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <TextField
              fullWidth
              label="Max Attendees"
              type="number"
              value={maxAttendees}
              onChange={(e) => {
                setMaxAttendees(e.target.value)
                if (maxAttendeesError) setMaxAttendeesError('')
              }}
              placeholder="e.g. 100"
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1 }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
              error={!!maxAttendeesError}
              helperText={
                maxAttendeesError ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                      {maxAttendeesError}
                    </Typography>
                  </Box>
                ) : null
              }
            />
          </Box>
        </Box>

        {/* Banner Image — same as AdminAddUser Profile Photo section */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 }, mb: { xs: 2.5, sm: 3 } }}>
            <Box
              sx={{
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                borderRadius: '7px',
                bgcolor: alpha(ADMIN_PRIMARY, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AccountCircleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 22, sm: 24 } }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.0625rem', sm: '1.125rem' } }}>
                Banner Image
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                Upload webinar banner image
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: { xs: 2.5, sm: 3 },
              p: { xs: 2.5, sm: 4 },
              borderRadius: '7px',
              bgcolor: alpha(ADMIN_PRIMARY, 0.02),
              border: `1px dashed ${alpha(ADMIN_PRIMARY, 0.2)}`,
            }}
          >
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Box
                sx={{
                  width: { xs: 140, sm: 120 },
                  height: { xs: 140, sm: 120 },
                  borderRadius: '7px',
                  overflow: 'hidden',
                  border: `3px solid ${
                    bannerError
                      ? theme.palette.error.main
                      : bannerPreview
                        ? ADMIN_PRIMARY
                        : alpha(ADMIN_PRIMARY, 0.3)
                  }`,
                  bgcolor: theme.palette.grey[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: bannerPreview ? `0 4px 16px ${alpha(ADMIN_PRIMARY, 0.2)}` : 'none',
                }}
              >
                {bannerPreview ? (
                  <Box
                    component="img"
                    src={bannerPreview}
                    alt="Banner preview"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <AddPhotoAlternateRoundedIcon sx={{ color: theme.palette.grey[400], fontSize: 48 }} />
                )}
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                {bannerPreview ? 'Banner uploaded successfully!' : 'Choose a banner image'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                Recommended: 1200×630px or similar ratio, max 5MB
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 1.5 },
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                <Button
                  component="label"
                  variant={bannerPreview ? 'outlined' : 'contained'}
                  size="small"
                  startIcon={<AddPhotoAlternateRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                  sx={{
                    borderRadius: '7px',
                    fontWeight: 600,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.25 },
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    minWidth: 0,
                    ...(bannerPreview
                      ? {
                          borderColor: ADMIN_PRIMARY,
                          color: ADMIN_PRIMARY,
                          '&:hover': {
                            borderColor: ADMIN_PRIMARY_DARK,
                            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
                          },
                        }
                      : {
                          bgcolor: ADMIN_PRIMARY,
                          color: '#fff',
                          '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
                        }),
                  }}
                >
                  {bannerFile ? 'Change image' : 'Upload image'}
                  <input type="file" hidden accept="image/*" onChange={handleBannerChange} />
                </Button>
                {bannerPreview && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRemoveBanner}
                    sx={{
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      borderRadius: '7px',
                      fontWeight: 600,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1, sm: 1.25 },
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      minWidth: 0,
                      '&:hover': {
                        borderColor: theme.palette.error.dark,
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
          {bannerError && (
            <Typography variant="body2" sx={{ mt: 1, color: 'error.main' }}>
              {bannerError}
            </Typography>
          )}
        </Box>

        {/* Actions — same as AdminAddService */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/webinars')}
            sx={{
              borderColor: alpha(theme.palette.grey[400], 0.8),
              color: 'text.secondary',
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              py: 1.25,
              textTransform: 'none',
              '&:hover': {
                borderColor: ADMIN_PRIMARY,
                color: ADMIN_PRIMARY,
                bgcolor: alpha(ADMIN_PRIMARY, 0.06),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <AutorenewIcon
                  sx={{
                    fontSize: 22,
                    animation: 'spin 0.8s linear infinite',
                    color: '#fff',
                  }}
                />
              ) : (
                <SaveRoundedIcon sx={{ fontSize: 22 }} />
              )
            }
            sx={{
              py: 1.5,
              px: 3,
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '7px',
              background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
              boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                boxShadow: `0 6px 20px ${alpha(ADMIN_PRIMARY, 0.45)}`,
              },
              '&.Mui-disabled': {
                color: '#fff',
                background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`,
                opacity: 1,
              },
            }}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Webinar' : 'Save Webinar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddWebinar
