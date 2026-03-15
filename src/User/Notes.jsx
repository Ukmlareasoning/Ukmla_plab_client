import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Collapse,
  Skeleton,
} from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ViewListIcon from '@mui/icons-material/ViewList'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SummarizeIcon from '@mui/icons-material/Summarize'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FilterListIcon from '@mui/icons-material/FilterList'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'
import apiClient from '../server'

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

const NOTES_PER_PAGE = 6

function Notes() {
  const theme = useTheme()
  const [noteTypes, setNoteTypes] = useState([])
  const [notes, setNotes] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [typesLoading, setTypesLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fetchNoteTypes = async () => {
    setTypesLoading(true)
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('per_page', '100')
    params.set('apply_filters', '1')
    params.set('status', 'Active')
    try {
      const { ok, data } = await apiClient(`/notes-types?${params.toString()}`, 'GET')
      if (ok && data?.success && Array.isArray(data.data?.notes_types)) {
        setNoteTypes(data.data.notes_types)
      }
    } catch {
      // non-blocking; filters can still show "All"
    } finally {
      setTypesLoading(false)
    }
  }

  const fetchNotes = async (targetPage = 1) => {
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(NOTES_PER_PAGE))
    params.set('apply_filters', '1')
    params.set('status', 'Active')
    if (typeFilter !== 'all') params.set('notes_type_id', typeFilter)
    try {
      const { ok, data } = await apiClient(`/notes?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message =
          data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : data?.message
        setListError(message || 'Unable to load notes.')
        return
      }
      const list = data.data?.notes || []
      const pagination = data.data?.pagination || {}
      setNotes(list)
      const total = Number(pagination.total || 0)
      const lastPage = Number(pagination.last_page || Math.max(1, Math.ceil(total / NOTES_PER_PAGE)))
      setTotalRows(total)
      setTotalPages(lastPage)
    } catch {
      setListError('Unable to reach server. Please try again.')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchNoteTypes()
  }, [])

  useEffect(() => {
    fetchNotes(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, page])

  const handleFilterChange = (value) => {
    setTypeFilter(value)
    setPage(1)
  }

  const handlePageChange = (_, value) => {
    setPage(value)
  }

  const safePage = Math.min(Math.max(1, page), totalPages)
  const from = totalRows === 0 ? 0 : (safePage - 1) * NOTES_PER_PAGE + 1
  const to = Math.min(safePage * NOTES_PER_PAGE, totalRows)

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
          aria-label="Notes Hero"
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
              Notes
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
              Comprehensive notes organized by specialty to help you master UKMLA & PLAB 1 topics.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<StyleOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Flashcards"
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
                icon={<QuizOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Quizzes"
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
                icon={<LightbulbOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Study notes"
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

        {/* Filters & Search */}
        <Box
          component="section"
          sx={{
            py: { xs: 4, md: 6 },
            px: { xs: 2, sm: 3 },
            animation: 'fadeInUp 0.6s ease-out 0.15s both',
          }}
        >
          <Container maxWidth="lg">
            {/* Tabs filter: dropdown on mobile, chips on desktop */}
            <Box sx={{ mb: 4 }}>
              {/* Mobile: dropdown */}
              <Box sx={{ display: { xs: 'block', sm: 'none' }, maxWidth: 320 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FilterListIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Filter by category
                  </Typography>
                </Box>
                <FormControl fullWidth size="medium" sx={{ minWidth: 200 }}>
                  <InputLabel id="notes-type-filter-label" sx={{ fontWeight: 600 }}>
                    Category
                  </InputLabel>
                  <Select
                    labelId="notes-type-filter-label"
                    id="notes-type-filter"
                    value={typeFilter}
                    label="Category"
                    onChange={(e) => handleFilterChange(e.target.value)}
                    sx={{
                      borderRadius: '7px',
                      fontWeight: 600,
                      bgcolor: 'background.paper',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.grey[400], 0.5),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: PAGE_PRIMARY,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                        borderColor: PAGE_PRIMARY,
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {noteTypes.map((type) => (
                      <MenuItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* Desktop: chips */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Chip
                  label="All"
                  onClick={() => handleFilterChange('all')}
                  sx={{
                    borderRadius: '7px',
                    fontWeight: 600,
                    bgcolor: typeFilter === 'all' ? PAGE_PRIMARY : alpha(theme.palette.grey[500], 0.1),
                    color: typeFilter === 'all' ? '#fff' : 'text.primary',
                    border: '1px solid',
                    borderColor: typeFilter === 'all' ? PAGE_PRIMARY : alpha(theme.palette.grey[400], 0.3),
                    '&:hover': {
                      bgcolor: typeFilter === 'all' ? PAGE_PRIMARY_DARK : alpha(PAGE_PRIMARY, 0.1),
                    },
                  }}
                />
                {noteTypes.map((type) => (
                  <Chip
                    key={type.id}
                    label={type.name}
                    onClick={() => handleFilterChange(String(type.id))}
                    sx={{
                      borderRadius: '7px',
                      fontWeight: 600,
                      bgcolor: typeFilter === type.id.toString() ? PAGE_PRIMARY : alpha(theme.palette.grey[500], 0.1),
                      color: typeFilter === type.id.toString() ? '#fff' : 'text.primary',
                      border: '1px solid',
                      borderColor: typeFilter === type.id.toString() ? PAGE_PRIMARY : alpha(theme.palette.grey[400], 0.3),
                      '&:hover': {
                        bgcolor: typeFilter === type.id.toString() ? PAGE_PRIMARY_DARK : alpha(PAGE_PRIMARY, 0.1),
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* List error */}
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

            {/* Results count */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <ViewListIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.9375rem' }}>
                {listLoading
                  ? 'Loading…'
                  : totalRows > 0
                    ? `Showing ${from}–${to} of ${totalRows} ${totalRows === 1 ? 'note' : 'notes'}`
                    : 'No notes in this category'}
              </Typography>
            </Box>

            {/* Notes Grid */}
            {listLoading ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                {Array.from({ length: NOTES_PER_PAGE }).map((_, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.grey[300], 0.5),
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: '7px' }} />
                      <Skeleton variant="text" width={80} height={20} />
                    </Box>
                    <Skeleton variant="text" width="90%" height={28} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="100%" height={40} sx={{ mb: 1.5 }} />
                    <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: '7px', mb: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={70} height={24} />
                    </Box>
                    <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: '10px', mt: 2 }} />
                  </Paper>
                ))}
              </Box>
            ) : notes.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  {notes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </Box>

                {/* Pagination */}
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
                      onChange={handlePageChange}
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
            ) : (
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
                <DescriptionOutlinedIcon sx={{ fontSize: 56, color: theme.palette.grey[400], mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                  No notes found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Try adjusting your filters or search query.
                </Typography>
              </Paper>
            )}
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

function NoteCard({ note }) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const typeName = note.notes_type_name || 'General'
  const difficultyLabel = note.difficulty_level_name || note.difficulty_level || '—'
  const importanceLabel = note.exam_importance_level || '—'
  const difficultyColor = difficultyLabel === 'Hard' ? theme.palette.error.main : difficultyLabel === 'Medium' ? theme.palette.warning.main : theme.palette.success.main
  const importanceColor = importanceLabel === 'High' ? theme.palette.error.main : importanceLabel === 'Medium' ? theme.palette.warning.main : theme.palette.info.main
  const tags = Array.isArray(note.tags) ? note.tags : []
  const keyPoints = Array.isArray(note.key_points) ? note.key_points : []

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '7px',
        border: '1px solid',
        borderColor: alpha(theme.palette.grey[300], 0.5),
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(PAGE_PRIMARY, 0.5),
          boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.15)}`,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Type badge (left) + Created date (top right) */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label={typeName}
            size="small"
            sx={{
              borderRadius: '7px',
              bgcolor: alpha(PAGE_PRIMARY, 0.12),
              color: PAGE_PRIMARY,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
              Created: {new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.3,
            color: 'text.primary',
          }}
        >
          {note.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 1.5,
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {note.description}
        </Typography>

        {/* Summary (with icon) */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: '7px',
            bgcolor: alpha(theme.palette.grey[100], 0.5),
            border: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.4),
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <SummarizeIcon sx={{ fontSize: 14, color: PAGE_PRIMARY }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
              Summary
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem', lineHeight: 1.5 }}>
            {note.summary}
          </Typography>
        </Box>

        {/* Difficulty + Importance */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SignalCellularAltIcon sx={{ fontSize: 16, color: difficultyColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {difficultyLabel}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarBorderIcon sx={{ fontSize: 16, color: importanceColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {importanceLabel} importance
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
          {tags.slice(0, 3).map((tag, idx) => (
            <Chip
              key={idx}
              icon={<LocalOfferIcon sx={{ fontSize: 12 }} />}
              label={typeof tag === 'string' ? tag : tag?.name ?? tag}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6875rem',
                bgcolor: alpha(PAGE_PRIMARY, 0.08),
                color: 'text.secondary',
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'text.secondary' },
              }}
            />
          ))}
          {tags.length > 3 && (
            <Chip
              label={`+${tags.length - 3}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6875rem',
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                color: 'text.secondary',
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* Key Points (Collapsible, with icon) */}
        <Box sx={{ mb: 1.5 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            startIcon={<FormatListBulletedIcon sx={{ fontSize: 16, color: PAGE_PRIMARY }} />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              mb: 1,
              p: 0,
              minHeight: 0,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: PAGE_PRIMARY,
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            {expanded ? 'Hide' : 'Show'} Key Points ({keyPoints.length})
          </Button>
          <Collapse in={expanded}>
            <Box
              component="ul"
              sx={{
                pl: 2.5,
                m: 0,
                '& li': {
                  mb: 0.75,
                  color: 'text.secondary',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                },
              }}
            >
              {keyPoints.map((point, idx) => (
                <li key={idx}>{typeof point === 'string' ? point : point?.text ?? point}</li>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Details button (same style as Webinars Book Now) */}
        <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
          <Button
            component={RouterLink}
            to={`/notes/${note.id}`}
            fullWidth
            variant="contained"
            size="large"
            startIcon={<VisibilityIcon sx={{ fontSize: 22 }} />}
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
            Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Notes
