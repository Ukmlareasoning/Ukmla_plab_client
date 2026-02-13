import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

function AdminAddWebinar() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [eventTitle, setEventTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [presence, setPresence] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [maxAttendees, setMaxAttendees] = useState('')
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setBannerPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveBanner = () => {
    setBannerFile(null)
    setBannerPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: submit to API
    navigate('/admin/webinars')
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
            Add Webinar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Create a new webinar or online event
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
          required
          label="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          placeholder="e.g. UKMLA PLAB 1 Overview"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(), mb: 2 }}
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
          required
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
              required
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
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
              required
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
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
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="start-time-label" shrink>Start Time</InputLabel>
              <Select
                labelId="start-time-label"
                value={startTime}
                label="Start Time"
                onChange={(e) => setStartTime(e.target.value)}
                notched
              >
                {TIME_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
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
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="end-time-label" shrink>End Time</InputLabel>
              <Select
                labelId="end-time-label"
                value={endTime}
                label="End Time"
                onChange={(e) => setEndTime(e.target.value)}
                notched
              >
                {TIME_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
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
          <FormControl fullWidth required size="medium" sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
            <InputLabel id="presence-label" shrink>Presence option (Onsite / Online)</InputLabel>
            <Select
              labelId="presence-label"
              value={presence}
              label="Presence option (Onsite / Online)"
              onChange={(e) => setPresence(e.target.value)}
              notched
            >
              {PRESENCE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {isOnline && (
          <TextField
            fullWidth
            required
            label="Google / Zoom meeting link"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            variant="outlined"
            size="medium"
            sx={{ ...inputSx(), mb: 2 }}
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
            required
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0 for free"
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
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
              onChange={(e) => setMaxAttendees(e.target.value)}
              placeholder="e.g. 100"
              variant="outlined"
              size="medium"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1 }}
              sx={{ ...inputSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
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
                  border: `3px solid ${bannerPreview ? ADMIN_PRIMARY : alpha(ADMIN_PRIMARY, 0.3)}`,
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
            startIcon={<SaveRoundedIcon sx={{ fontSize: 22 }} />}
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
            }}
          >
            Save Webinar
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddWebinar
