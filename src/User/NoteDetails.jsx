import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  useTheme,
  Skeleton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CategoryIcon from '@mui/icons-material/Category'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LabelIcon from '@mui/icons-material/Label'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SummarizeIcon from '@mui/icons-material/Summarize'
import Header from '../components/Header'
import Footer from '../components/Footer'
import apiClient from '../server'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'

function DetailRow({ label, value, icon }) {
  const theme = useTheme()
  if (value == null || value === '') return null
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: { xs: 1, sm: 1.5 },
        mb: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: '8px',
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        border: '1px solid',
        borderColor: alpha(theme.palette.grey[300], 0.4),
        textAlign: { xs: 'center', sm: 'left' },
      }}
    >
      {icon && (
        <Box
          sx={{
            width: { xs: 48, sm: 40 },
            height: { xs: 48, sm: 40 },
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: alpha(PAGE_PRIMARY, 0.1),
            color: PAGE_PRIMARY,
            alignSelf: { xs: 'center', sm: 'flex-start' },
            '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 20 } },
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1, width: '100%' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            display: 'block',
            mb: 0.5,
            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
          }}
        >
          {label}
        </Typography>
        {typeof value === 'string' && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {value}
          </Typography>
        )}
        {Array.isArray(value) && (
          <Box
            component="ul"
            sx={{
              pl: { xs: 2.5, sm: 2.5 },
              m: 0,
              textAlign: { xs: 'left', sm: 'left' },
              display: { xs: 'inline-block', sm: 'block' },
              '& li': { mb: 0.5, lineHeight: 1.5, fontSize: '0.875rem' },
            }}
          >
            {value.map((item, idx) => (
              <li key={idx}>
                <Typography variant="body1" component="span" sx={{ color: 'text.primary', fontSize: 'inherit' }}>
                  {item}
                </Typography>
              </li>
            ))}
          </Box>
        )}
        {typeof value === 'number' && (
          <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

function NoteDetails() {
  const theme = useTheme()
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (!id) {
      setNote(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError('')
    apiClient(`/notes/${id}`, 'GET')
      .then(({ ok, data }) => {
        if (cancelled) return
        if (ok && data?.success && data.data?.note) {
          setNote(data.data.note)
          setError('')
        } else {
          setNote(null)
          setError(data?.message || 'Note not found')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNote(null)
          setError('Unable to load note.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ flex: 1, py: { xs: 3, md: 6 }, px: { xs: 1.5, sm: 3 } }}>
          <Container maxWidth="md" disableGutters sx={{ px: 0 }}>
            <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5, md: 4 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.5) }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: '7px' }} />
                <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: '7px' }} />
              </Box>
              <Skeleton variant="text" width="80%" height={48} sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={80} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={120} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="rounded" width={120} height={56} sx={{ borderRadius: '8px' }} />
                <Skeleton variant="rounded" width={120} height={56} sx={{ borderRadius: '8px' }} />
              </Box>
              <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rounded" width={72} height={28} sx={{ borderRadius: '7px' }} />
                ))}
              </Box>
            </Paper>
          </Container>
        </Box>
        <Footer />
      </Box>
    )
  }

  if (error || !note) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', flex: 1 }}>
          <DescriptionOutlinedIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            Note not found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {error || "The note you're looking for doesn't exist or has been removed."}
          </Typography>
          <Button
            component={RouterLink}
            to="/notes"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{
              borderRadius: '7px',
              fontWeight: 600,
              bgcolor: PAGE_PRIMARY,
              '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
            }}
          >
            Back to Notes
          </Button>
        </Container>
        <Footer />
      </Box>
    )
  }

  const typeName = note.notes_type_name || 'General'
  const difficultyLabel = note.difficulty_level_name || note.difficulty_level || '—'
  const importanceLabel = note.exam_importance_level || '—'
  const difficultyColor =
    difficultyLabel === 'Hard'
      ? theme.palette.error.main
      : difficultyLabel === 'Medium'
        ? theme.palette.warning.main
        : theme.palette.success.main
  const importanceColor =
    importanceLabel === 'High'
      ? theme.palette.error.main
      : importanceLabel === 'Medium'
        ? theme.palette.warning.main
        : theme.palette.info.main
  const keyPointsNormalized = (note.key_points || []).map((p) => (typeof p === 'string' ? p : p?.text ?? p))
  const tagsNormalized = (note.tags || []).map((t) => (typeof t === 'string' ? t : t?.name ?? t))

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box sx={{ flex: 1, py: { xs: 3, md: 6 }, px: { xs: 1.5, sm: 3 } }}>
        <Container maxWidth="md" disableGutters sx={{ px: 0 }}>
          {/* Back button — touch-friendly on mobile */}
          <Button
            component={RouterLink}
            to="/notes"
            startIcon={<ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            sx={{
              mb: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 0.5 },
              px: { xs: 0, sm: 1 },
              minHeight: { xs: 44, sm: 'auto' },
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              '&:hover': { color: PAGE_PRIMARY, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
            }}
          >
            Back to Notes
          </Button>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 4 },
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(theme.palette.grey[300], 0.5),
              bgcolor: 'background.paper',
            }}
          >
            {/* Title + Type badge — compact on mobile */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: { xs: 1.5, sm: 2 } }}>
              <Chip
                label={typeName}
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: alpha(PAGE_PRIMARY, 0.12),
                  color: PAGE_PRIMARY,
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                  height: { xs: 26, sm: 32 },
                }}
              />
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                label={note.status}
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: alpha(theme.palette.success.main, 0.12),
                  color: theme.palette.success.dark,
                  fontWeight: 600,
                  height: { xs: 26, sm: 32 },
                  '& .MuiChip-icon': { fontSize: 14 },
                }}
              />
            </Box>

            {/* Title + icon — icon centered on mobile (same as PrivacyPolicy) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: { xs: 1, sm: 1.5 },
                mb: { xs: 2, sm: 3 },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <Box
                sx={{
                  width: { xs: 48, sm: 48 },
                  height: { xs: 48, sm: 48 },
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  color: PAGE_PRIMARY,
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                }}
              >
                <DescriptionOutlinedIcon sx={{ fontSize: { xs: 28, sm: 28 } }} />
              </Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  lineHeight: 1.3,
                }}
              >
                {note.title}
              </Typography>
            </Box>

            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            {/* A–Z details */}
            <DetailRow
              label="Description"
              value={note.description}
              icon={<DescriptionOutlinedIcon sx={{ fontSize: 20 }} />}
            />
            <DetailRow
              label="Type / Specialty"
              value={typeName}
              icon={<CategoryIcon sx={{ fontSize: 20 }} />}
            />
            <DetailRow
              label="Summary"
              value={note.summary}
              icon={<SummarizeIcon sx={{ fontSize: 20 }} />}
            />
            <DetailRow
              label="Key Points"
              value={keyPointsNormalized.length ? keyPointsNormalized : null}
              icon={<FormatListBulletedIcon sx={{ fontSize: 20 }} />}
            />

            {/* Difficulty + Importance — compact row on mobile */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 1.25, sm: 2 },
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.4),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <SignalCellularAltIcon sx={{ fontSize: { xs: 18, sm: 22 }, color: difficultyColor }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    Difficulty
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                    {difficultyLabel}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 1.25, sm: 2 },
                  borderRadius: '8px',
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.4),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <StarBorderIcon sx={{ fontSize: { xs: 18, sm: 22 }, color: importanceColor }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                    Importance
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                    {importanceLabel}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Tags — icon centered on mobile (same as PrivacyPolicy) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: { xs: 1, sm: 1.5 },
                mb: { xs: 1.5, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                borderRadius: '8px',
                bgcolor: alpha(theme.palette.grey[100], 0.5),
                border: '1px solid',
                borderColor: alpha(theme.palette.grey[300], 0.4),
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <Box
                sx={{
                  width: { xs: 48, sm: 40 },
                  height: { xs: 48, sm: 40 },
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  color: PAGE_PRIMARY,
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                }}
              >
                <LocalOfferIcon sx={{ fontSize: { xs: 28, sm: 20 } }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    display: 'block',
                    mb: 0.75,
                    fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                  }}
                >
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  {tagsNormalized.map((tag, idx) => (
                    <Chip
                      key={idx}
                      icon={<LabelIcon sx={{ fontSize: 12 }} />}
                      label={tag}
                      size="small"
                      sx={{
                        borderRadius: '7px',
                        bgcolor: alpha(PAGE_PRIMARY, 0.1),
                        color: 'text.primary',
                        fontWeight: 500,
                        height: 24,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': { fontSize: 12 },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <DetailRow
              label="Created At"
              value={new Date(note.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
              icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />}
            />
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default NoteDetails
