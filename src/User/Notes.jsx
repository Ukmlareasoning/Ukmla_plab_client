import { useState, useMemo, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Collapse,
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

// Types (Categories like Cardio, Respiratory, etc.)
const TYPES_DATA = [
  { id: 1, name: 'Cardiology', status: 'Active' },
  { id: 2, name: 'Respiratory', status: 'Active' },
  { id: 3, name: 'Gynecology', status: 'Active' },
  { id: 4, name: 'Neurology', status: 'Active' },
  { id: 5, name: 'Gastroenterology', status: 'Active' },
  { id: 6, name: 'Endocrinology', status: 'Active' },
  { id: 7, name: 'Psychiatry', status: 'Active' },
  { id: 8, name: 'Pediatrics', status: 'Active' },
]

// Notes data
const NOTES_DATA = [
  {
    id: 1,
    title: 'Acute Coronary Syndrome Management',
    description: 'Comprehensive notes on ACS presentation, diagnosis, and immediate management strategies for UKMLA/PLAB 1.',
    type_id: 1,
    summary: 'ACS includes STEMI and NSTEMI. Key is rapid diagnosis and intervention.',
    key_points: [
      'ECG changes: ST elevation (STEMI) vs ST depression/T wave inversion (NSTEMI)',
      'Troponin elevation confirms MI',
      'MONA: Morphine, Oxygen, Nitrates, Aspirin',
      'PCI within 120 minutes for STEMI',
    ],
    difficulty_level: 'Hard',
    exam_importance_level: 'High',
    tags: ['ACS', 'STEMI', 'NSTEMI', 'Emergency', 'Cardiology'],
    status: 'Active',
    created_at: '2025-01-15',
    notes_flashcards: 12,
    notes_quizzes: 3,
    notes_tracking: 145,
  },
  {
    id: 2,
    title: 'Asthma Exacerbation Protocol',
    description: 'Step-by-step approach to assessing and managing acute asthma exacerbations in emergency settings.',
    type_id: 2,
    summary: 'Assess severity, provide oxygen, bronchodilators, and steroids. Escalate if needed.',
    key_points: [
      'Assess severity: mild, moderate, severe, life-threatening',
      'Salbutamol nebulizer + ipratropium',
      'Oral/IV corticosteroids',
      'Monitor peak flow and oxygen saturation',
    ],
    difficulty_level: 'Medium',
    exam_importance_level: 'High',
    tags: ['Asthma', 'Emergency', 'Respiratory', 'PLAB'],
    status: 'Active',
    created_at: '2025-01-18',
    notes_flashcards: 8,
    notes_quizzes: 2,
    notes_tracking: 98,
  },
  {
    id: 3,
    title: 'Ovarian Cyst Complications',
    description: 'Understanding ovarian cyst torsion and rupture: clinical features, diagnosis, and management.',
    type_id: 3,
    summary: 'Torsion = sudden pain + mass. Rupture = sudden pain + peritonism. US confirms. Surgery if needed.',
    key_points: [
      'Torsion: sudden severe pain, nausea, vomiting',
      'Ultrasound shows enlarged ovary with reduced blood flow',
      'Emergency laparoscopy for torsion',
      'Rupture: peritoneal signs, free fluid on US',
    ],
    difficulty_level: 'Medium',
    exam_importance_level: 'Medium',
    tags: ['Gynecology', 'Ovarian Cyst', 'Torsion', 'Emergency'],
    status: 'Active',
    created_at: '2025-01-20',
    notes_flashcards: 6,
    notes_quizzes: 1,
    notes_tracking: 67,
  },
  {
    id: 4,
    title: 'Ischemic Stroke Management',
    description: 'Rapid assessment and treatment of acute ischemic stroke including thrombolysis criteria.',
    type_id: 4,
    summary: 'Time is brain. CT to exclude hemorrhage, thrombolysis within 4.5 hours, thrombectomy if large vessel.',
    key_points: [
      'FAST assessment: Face, Arms, Speech, Time',
      'CT head to exclude hemorrhage',
      'Thrombolysis with alteplase if within 4.5 hours and no contraindications',
      'Thrombectomy for large vessel occlusion',
    ],
    difficulty_level: 'Hard',
    exam_importance_level: 'High',
    tags: ['Stroke', 'Neurology', 'Emergency', 'Thrombolysis'],
    status: 'Active',
    created_at: '2025-01-22',
    notes_flashcards: 10,
    notes_quizzes: 2,
    notes_tracking: 112,
  },
  {
    id: 5,
    title: 'Peptic Ulcer Disease',
    description: 'Pathophysiology, diagnosis, and treatment of gastric and duodenal ulcers.',
    type_id: 5,
    summary: 'H. pylori and NSAIDs are main causes. PPIs heal ulcers. Eradication therapy for H. pylori.',
    key_points: [
      'Epigastric pain, worse with food (gastric) or improved with food (duodenal)',
      'Endoscopy for diagnosis',
      'H. pylori testing: urea breath test, stool antigen',
      'Triple therapy: PPI + amoxicillin + clarithromycin',
    ],
    difficulty_level: 'Easy',
    exam_importance_level: 'Medium',
    tags: ['GI', 'Peptic Ulcer', 'H. pylori', 'PPI'],
    status: 'Active',
    created_at: '2025-01-25',
    notes_flashcards: 7,
    notes_quizzes: 2,
    notes_tracking: 89,
  },
  {
    id: 6,
    title: 'Type 2 Diabetes Initial Management',
    description: 'First-line pharmacological and lifestyle interventions for newly diagnosed Type 2 Diabetes.',
    type_id: 6,
    summary: 'Lifestyle first, then metformin. Add second agent if HbA1c >58 mmol/mol on metformin.',
    key_points: [
      'Diet, exercise, weight loss',
      'Metformin first-line (start 500mg, titrate)',
      'Monitor HbA1c every 3-6 months',
      'Add SGLT2i or DPP4i if inadequate control',
    ],
    difficulty_level: 'Medium',
    exam_importance_level: 'High',
    tags: ['Diabetes', 'Endocrinology', 'Metformin', 'HbA1c'],
    status: 'Active',
    created_at: '2025-01-28',
    notes_flashcards: 9,
    notes_quizzes: 3,
    notes_tracking: 134,
  },
  {
    id: 7,
    title: 'Depression Diagnosis & Treatment',
    description: 'Diagnostic criteria, risk assessment, and evidence-based treatments for major depressive disorder.',
    type_id: 7,
    summary: 'PHQ-9 for screening. SSRIs first-line. CBT effective. Assess suicide risk.',
    key_points: [
      'Low mood, anhedonia, fatigue, sleep/appetite changes for >2 weeks',
      'PHQ-9 score: mild (5-9), moderate (10-14), severe (15-27)',
      'SSRIs (e.g., sertraline, fluoxetine) first-line',
      'CBT as effective as medication for mild-moderate',
    ],
    difficulty_level: 'Medium',
    exam_importance_level: 'High',
    tags: ['Psychiatry', 'Depression', 'SSRI', 'CBT'],
    status: 'Active',
    created_at: '2025-02-01',
    notes_flashcards: 8,
    notes_quizzes: 2,
    notes_tracking: 78,
  },
  {
    id: 8,
    title: 'Febrile Seizures in Children',
    description: 'Approach to diagnosis, management, and parental counseling for febrile seizures.',
    type_id: 8,
    summary: 'Common in children 6 months - 5 years. Usually benign. Rule out meningitis. Most don\'t recur.',
    key_points: [
      'Seizure with fever >38°C in child 6mo-5yr without CNS infection',
      'Simple: <15 min, generalized, no recurrence in 24h',
      'Complex: >15 min, focal, multiple in 24h',
      'Exclude meningitis if concerning features',
    ],
    difficulty_level: 'Easy',
    exam_importance_level: 'Medium',
    tags: ['Pediatrics', 'Seizure', 'Febrile', 'Children'],
    status: 'Active',
    created_at: '2025-02-03',
    notes_flashcards: 5,
    notes_quizzes: 1,
    notes_tracking: 56,
  },
]

const NOTES_PER_PAGE = 6

function Notes() {
  const theme = useTheme()
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredNotes = useMemo(() => {
    return NOTES_DATA.filter((note) => {
      const matchesType = typeFilter === 'all' || note.type_id === parseInt(typeFilter)
      return matchesType && note.status === 'Active'
    })
  }, [typeFilter])

  useEffect(() => {
    setPage(1)
  }, [typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / NOTES_PER_PAGE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const paginatedNotes = useMemo(() => {
    const start = (safePage - 1) * NOTES_PER_PAGE
    return filteredNotes.slice(start, start + NOTES_PER_PAGE)
  }, [filteredNotes, safePage])

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
                    onChange={(e) => setTypeFilter(e.target.value)}
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
                    {TYPES_DATA.filter((t) => t.status === 'Active').map((type) => (
                      <MenuItem key={type.id} value={type.id.toString()}>
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
                  onClick={() => setTypeFilter('all')}
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
                {TYPES_DATA.filter((t) => t.status === 'Active').map((type) => (
                  <Chip
                    key={type.id}
                    label={type.name}
                    onClick={() => setTypeFilter(type.id.toString())}
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

            {/* Results count */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <ViewListIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.9375rem' }}>
                {filteredNotes.length > 0
                  ? (() => {
                      const start = (safePage - 1) * NOTES_PER_PAGE + 1
                      const end = Math.min(safePage * NOTES_PER_PAGE, filteredNotes.length)
                      const total = filteredNotes.length
                      const range = start === end ? `${start}` : `${start}–${end}`
                      return `Showing ${range} of ${total} ${total === 1 ? 'note' : 'notes'}`
                    })()
                  : 'No notes in this category'}
              </Typography>
            </Box>

            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  {paginatedNotes.map((note) => (
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

  const typeName = TYPES_DATA.find((t) => t.id === note.type_id)?.name || 'General'

  const difficultyColor = note.difficulty_level === 'Hard' ? theme.palette.error.main : note.difficulty_level === 'Medium' ? theme.palette.warning.main : theme.palette.success.main

  const importanceColor = note.exam_importance_level === 'High' ? theme.palette.error.main : note.exam_importance_level === 'Medium' ? theme.palette.warning.main : theme.palette.info.main

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
              {note.difficulty_level}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarBorderIcon sx={{ fontSize: 16, color: importanceColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {note.exam_importance_level} importance
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
          {note.tags.slice(0, 3).map((tag, idx) => (
            <Chip
              key={idx}
              icon={<LocalOfferIcon sx={{ fontSize: 12 }} />}
              label={tag}
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
          {note.tags.length > 3 && (
            <Chip
              label={`+${note.tags.length - 3}`}
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
            {expanded ? 'Hide' : 'Show'} Key Points ({note.key_points.length})
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
              {note.key_points.map((point, idx) => (
                <li key={idx}>{point}</li>
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

export { NOTES_DATA, TYPES_DATA }
export default Notes
