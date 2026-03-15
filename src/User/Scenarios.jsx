import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  LinearProgress,
  Pagination,
  useTheme,
  useMediaQuery,
  IconButton,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SearchIcon from '@mui/icons-material/Search'
import PsychologyIcon from '@mui/icons-material/Psychology'
import GavelIcon from '@mui/icons-material/Gavel'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import TimelineIcon from '@mui/icons-material/Timeline'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import CompareIcon from '@mui/icons-material/Compare'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FilterListIcon from '@mui/icons-material/FilterList'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SpeedIcon from '@mui/icons-material/Speed'
import CategoryIcon from '@mui/icons-material/Category'
import ViewListIcon from '@mui/icons-material/ViewList'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'
import apiClient from '../server'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'
const HERO_BG = '#1e3a5f'
const HERO_BTN_GREEN = '#22c55e'
const HERO_BTN_GREEN_HOVER = '#16a34a'
const HERO_BTN_GOLD = '#FFD700'
const HERO_BTN_GOLD_HOVER = '#F5C400'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

// Map backend icon keys (used in AdminScenarios) to scenario icons for user cards
const SCENARIO_ICONS = {
  psychology: PsychologyIcon,
  assignment: AssignmentIcon,
  timeline: TimelineIcon,
  gavel: GavelIcon,
  localHospital: LocalHospitalIcon,
  assessment: AssessmentIcon,
  compare: CompareIcon,
  lightbulb: LightbulbIcon,
  verifiedUser: VerifiedUserIcon,
}

function renderScenarioIcon(iconKey) {
  const IconComponent = SCENARIO_ICONS[iconKey] || PsychologyIcon
  return <IconComponent sx={{ fontSize: 36, color: PAGE_PRIMARY }} />
}

// Reusable ScenarioCard component
function ScenarioCard({ scenario, onContinueClick }) {
  const theme = useTheme()

  const isEnrolled = !!scenario.enrolled

  const tags = useMemo(() => {
    if (Array.isArray(scenario.tags) && scenario.tags.length > 0) {
      return scenario.tags
    }
    if (Array.isArray(scenario.topic_focuses)) {
      return scenario.topic_focuses.map((t) => t.name).filter(Boolean)
    }
    return []
  }, [scenario.tags, scenario.topic_focuses])

  const getLevelColor = (level) => {
    switch (level) {
      case 'Foundation':
        return PAGE_PRIMARY
      case 'Core':
        return PAGE_PRIMARY
      case 'Advanced':
        return PAGE_PRIMARY_DARK
      default:
        return theme.palette.grey[600]
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: alpha(theme.palette.grey[300], 0.6),
        borderRadius: '7px',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
          opacity: scenario.enrolled ? 1 : 0,
          transition: 'opacity 0.35s',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
          opacity: 0,
          transition: 'opacity 0.35s',
        },
        '&:hover': {
          borderColor: alpha(PAGE_PRIMARY, 0.4),
          boxShadow: `0 20px 48px ${alpha(PAGE_PRIMARY, 0.15)}, 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.08)}`,
          transform: 'translateY(-8px)',
          '&::before': { opacity: 1 },
          '&::after': { opacity: 1 },
          '& .scenario-card-icon-wrap': {
            transform: 'scale(1.08)',
            background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.16)}, ${alpha(PAGE_PRIMARY_LIGHT, 0.1)})`,
            borderColor: alpha(PAGE_PRIMARY, 0.3),
          },
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 3, md: 3.5 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          pl: { xs: 3.5, md: 4 },
        }}
      >
        {/* Header: Icon + Scenarios Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          <Box
            className="scenario-card-icon-wrap"
            sx={{
              width: 72,
              height: 72,
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.12)}, ${alpha(PAGE_PRIMARY_LIGHT, 0.08)})`,
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.2),
              transition: 'all 0.35s ease',
            }}
          >
            {renderScenarioIcon(scenario.icon_key)}
          </Box>
          <Chip
            label={scenario.type_name || scenario.exam_type_name || 'Scenario'}
            size="small"
            sx={{
              borderRadius: '7px !important',
              '&.MuiChip-root': { borderRadius: '7px' },
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 26,
              px: 1,
              bgcolor: alpha(PAGE_PRIMARY, 0.1),
              color: PAGE_PRIMARY,
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.25),
              boxShadow: `0 2px 8px ${alpha(PAGE_PRIMARY, 0.12)}`,
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            lineHeight: 1.35,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          {scenario.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.65,
            mb: 2,
            flex: 1,
            fontSize: { xs: '0.9375rem', md: '1rem' },
          }}
        >
          {scenario.description}
        </Typography>

        {/* Tags */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  borderRadius: '7px !important',
                  '&.MuiChip-root': { borderRadius: '7px' },
                  fontSize: '0.6875rem',
                  height: 24,
                  bgcolor: alpha(theme.palette.grey[500], 0.06),
                  color: 'text.secondary',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[400], 0.2),
                  '&:hover': {
                    bgcolor: alpha(PAGE_PRIMARY, 0.08),
                    color: PAGE_PRIMARY,
                    borderColor: alpha(PAGE_PRIMARY, 0.2),
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Meta info: Duration + Level */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.4),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <TimelineIcon sx={{ fontSize: 20, color: PAGE_PRIMARY, opacity: 0.9 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
              {scenario.duration} {scenario.duration_type}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '7px',
              bgcolor: alpha(getLevelColor(scenario.difficulty_level_name || scenario.level), 0.1),
              border: '1px solid',
              borderColor: alpha(getLevelColor(scenario.difficulty_level_name || scenario.level), 0.25),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: getLevelColor(scenario.difficulty_level_name || scenario.level),
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {scenario.difficulty_level_name || scenario.level || 'Difficulty'}
            </Typography>
          </Box>
        </Box>

        {/* Progress bar (always shown, static if no real data) */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 700 }}>
                Your Progress
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: PAGE_PRIMARY, fontSize: '0.8125rem', fontWeight: 800 }}>
              {scenario.progress ?? 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={scenario.progress ?? 0}
            sx={{
              height: 8,
              borderRadius: '7px',
              bgcolor: alpha(theme.palette.grey[400], 0.12),
              overflow: 'hidden',
              '& .MuiLinearProgress-bar': {
                borderRadius: '7px',
                background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                boxShadow: `0 0 12px ${alpha(PAGE_PRIMARY, 0.4)}`,
              },
            }}
          />
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<PlayArrowIcon />}
          onClick={() => onContinueClick?.(scenario)}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '7px',
            textTransform: 'none',
            bgcolor: PAGE_PRIMARY,
            boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.35)}`,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: PAGE_PRIMARY_DARK,
              transform: 'translateY(-3px)',
              boxShadow: `0 10px 28px ${alpha(PAGE_PRIMARY, 0.4)}`,
            },
          }}
        >
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  )
}

// Topic filter options will be loaded dynamically; include "all"

function Scenarios({ disableLoginDialog = false, hideHero = false, hideFooter = false, compactTop = false } = {}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const typeFromUrl = searchParams.get('type')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const [searchInput, setSearchInput] = useState('') // what user types in the search bar
  const [rulesOpen, setRulesOpen] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // applied when user clicks Search
  const [examFilter, setExamFilter] = useState(typeFromUrl || 'all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [page, setPage] = useState(1)
  const scenarioTypeScrollRef = useRef(null)
  const levelFilterScrollRef = useRef(null)
  const topicFilterScrollRef = useRef(null)
  const [scenarios, setScenarios] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [scenarioTypeOptions, setScenarioTypeOptions] = useState([])
  const [levelOptions, setLevelOptions] = useState([])
  const [topicOptions, setTopicOptions] = useState([])
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [statusFilterDisplay, setStatusFilterDisplay] = useState('all') // static dropdown: all | ongoing | completed

  // When navigating to Scenarios from another page, scroll to top so the main section is in view (not footer)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Sync examFilter with ?type= query param (from header Scenarios dropdown)
  useEffect(() => {
    if (typeFromUrl) setExamFilter(typeFromUrl)
  }, [typeFromUrl])

  // Load filters (types, difficulty levels, topics) from admin lists (public APIs)
  useEffect(() => {
    const loadFilters = async () => {
      setFiltersLoading(true)
      try {
        const [typesRes, levelsRes, topicsRes] = await Promise.all([
          apiClient('/notes-types?per_page=1000&apply_filters=1&status=Active', 'GET'),
          apiClient('/difficulty-levels?per_page=1000&apply_filters=1&status=Active', 'GET'),
          apiClient('/scenarios-topic-focuses?per_page=1000&apply_filters=1&status=Active', 'GET'),
        ])

        if (typesRes.ok && typesRes.data?.success) {
          const list = typesRes.data.data?.notes_types || []
          setScenarioTypeOptions(list.map((t) => t.name).filter(Boolean))
        }
        if (levelsRes.ok && levelsRes.data?.success) {
          const list = levelsRes.data.data?.difficulty_levels || []
          setLevelOptions(list.filter((l) => l.name).map((l) => ({ id: l.id, name: l.name })))
        }
        if (topicsRes.ok && topicsRes.data?.success) {
          const list = topicsRes.data.data?.scenario_topic_focuses || []
          setTopicOptions(list.filter((t) => t.name).map((t) => ({ id: t.id, name: t.name })))
        }
      } catch {
        // fail silently, filters will just show "all"
      } finally {
        setFiltersLoading(false)
      }
    }
    loadFilters()
  }, [])

  // Server-side pagination state (from API response)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  })

  // Load scenarios list (public GET /scenarios) — refetch when filters or page change
  useEffect(() => {
    const ac = new AbortController()
    const loadScenarios = async () => {
      setListLoading(true)
      setListError('')
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('per_page', '6')
      params.set('apply_filters', '1')
      params.set('status', 'Active')
      if (searchQuery.trim()) params.set('text', searchQuery.trim())
      if (examFilter !== 'all') params.set('exam_type_name', examFilter)
      if (levelFilter !== 'all') params.set('difficulty_level_id', String(levelFilter))
      if (topicFilter !== 'all' && Number(topicFilter)) {
        const id = Number(topicFilter)
        params.set('topic_focus_id', String(id))
        const topic = topicOptions.find((t) => t.id === id)
        if (topic?.name) params.set('topic_focus_name', topic.name)
      }
      try {
        const { ok, data } = await apiClient(`/scenarios?${params.toString()}`, 'GET', null, {
          signal: ac.signal,
        })
        if (ac.signal.aborted) return
        if (!ok || !data?.success) {
          const message =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setListError(message || 'Unable to load scenarios.')
          return
        }
        const list = data.data?.scenarios || []
        const pag = data.data?.pagination || {}
        setScenarios(list)
        setPagination({
          current_page: pag.current_page ?? 1,
          last_page: pag.last_page ?? 1,
          total: pag.total ?? 0,
          from: pag.from ?? 0,
          to: pag.to ?? 0,
        })
      } catch (e) {
        if (e?.name === 'AbortError' || ac.signal.aborted) return
        setListError('Unable to reach server. Please try again.')
      } finally {
        if (!ac.signal.aborted) setListLoading(false)
      }
    }
    loadScenarios()
    return () => ac.abort()
    // topicOptions not in deps: avoid double fetch on load; options are ready before user picks a topic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, examFilter, levelFilter, topicFilter])

  // When any filter changes, reset to page 1 (API will be called with page=1 by the load effect)
  useEffect(() => {
    setPage(1)
  }, [searchQuery, examFilter, levelFilter, topicFilter])

  const handleSearch = () => {
    setSearchQuery(searchInput.trim())
    setPage(1)
  }

  const handleReset = () => {
    setSearchInput('')
    setSearchQuery('')
    setExamFilter('all')
    setLevelFilter('all')
    setTopicFilter('all')
    setPage(1)
  }

  const handleContinueClick = (scenario) => {
    if (!isLoggedIn && !disableLoginDialog) {
      setSelectedScenario(scenario)
      setLoginDialogOpen(true)
      return
    }
    setSelectedScenario(scenario)
    setRulesOpen(true)
  }

  const handleStartPractice = () => {
    setRulesOpen(false)
    // Pass serializable scenario data (exclude icon JSX which can break navigation state)
    const scenarioData = selectedScenario ? {
      id: selectedScenario.id,
      title: selectedScenario.title,
      scenarioType: selectedScenario.scenarioType,
      description: selectedScenario.description,
      tags: selectedScenario.tags,
      duration: selectedScenario.duration,
      level: selectedScenario.difficulty_level_name || selectedScenario.level,
      enrolled: !!selectedScenario.enrolled,
      progress: selectedScenario.progress ?? 0,
      isPaid: !!selectedScenario.is_paid,
    } : null
    navigate('/scenarios/practice', { state: { scenario: scenarioData } })
  }

  const SCENARIOS_PER_PAGE = 6
  const totalPages = Math.max(1, pagination.last_page)
  const safePage = Math.min(Math.max(1, pagination.current_page), totalPages)

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

      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          position: 'relative',
        }}
      >
        {/* Hero section — matches image: dark blue bg, title, subtitle, CTAs, hero-img.png */}
        {!hideHero && (
        <Box
          component="section"
          aria-label="Scenarios Hero"
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
              id="scenarios-heading"
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
              Think like a UKMLA Examiner – not a question bank.
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
              AI-driven clinical reasoning. Examiner feedback. Zero memorisation.
            </Typography>
            <Grid
              container
              spacing={1.5}
              sx={{
                width: '100%',
                flexWrap: 'nowrap',
                boxSizing: 'border-box',
              }}
            >
              <Grid item xs={6} sx={{ minWidth: 0, flex: '1 1 50%', maxWidth: '50%' }}>
                <Button
                  component={Link}
                  to="/scenarios"
                  variant="contained"
                  fullWidth
                  startIcon={!isMobile ? <PsychologyIcon sx={{ fontSize: 20 }} /> : null}
                  sx={{
                    bgcolor: HERO_BTN_GREEN,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: { xs: '0.7rem', sm: '0.95rem' },
                    py: 1.25,
                    px: { xs: 1, sm: 2.5 },
                    borderRadius: '8px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    boxShadow: `0 4px 14px ${alpha(HERO_BTN_GREEN, 0.4)}`,
                    '&:hover': {
                      bgcolor: HERO_BTN_GREEN_HOVER,
                      boxShadow: `0 6px 20px ${alpha(HERO_BTN_GREEN, 0.5)}`,
                    },
                  }}
                >
                  {isMobile ? 'Try Free' : 'Try a Free Scenario'}
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ minWidth: 0, flex: '1 1 50%', maxWidth: '50%' }}>
                <Button
                  component={Link}
                  to="/pricing"
                  variant="contained"
                  fullWidth
                  startIcon={!isMobile ? <ArrowUpwardRoundedIcon sx={{ fontSize: 20 }} /> : null}
                  sx={{
                    bgcolor: HERO_BTN_GOLD,
                    color: '#1a1a1a',
                    fontWeight: 700,
                    fontSize: { xs: '0.7rem', sm: '0.95rem' },
                    py: 1.25,
                    px: { xs: 1, sm: 2.5 },
                    borderRadius: '8px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    boxShadow: `0 4px 14px ${alpha(HERO_BTN_GOLD, 0.4)}`,
                    '&:hover': {
                      bgcolor: HERO_BTN_GOLD_HOVER,
                      boxShadow: `0 6px 20px ${alpha(HERO_BTN_GOLD, 0.5)}`,
                    },
                  }}
                >
                  {isMobile ? '£5/mo' : 'View Pricing (£5/month)'}
                </Button>
              </Grid>
            </Grid>
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
        )}

        {/* Section with gradient background — theme-aligned with Home */}
        <Box
          component="section"
          aria-labelledby="browse-scenarios-heading"
          sx={{
            py: compactTop ? { xs: 2.5, md: 3 } : { xs: 5, md: 7 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(PAGE_PRIMARY, 0.02)} 50%, ${theme.palette.background.default} 100%)`,
            position: 'relative',
            '&::before': compactTop
              ? undefined
              : {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent 0%, ${alpha(PAGE_PRIMARY, 0.25)} 50%, transparent 100%)`,
                },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Section subheading */}
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <MenuBookIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />
                <Typography
                  id="browse-scenarios-heading"
                  component="h2"
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    color: 'text.primary',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Browse scenarios
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9375rem' }}>
                Filter by scenario type and level, or search by topic.
              </Typography>
              <Box
                sx={{
                  width: 48,
                  height: 4,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                  mx: 'auto',
                  mt: 2,
                }}
              />
            </Box>

                {/* Filters & Search — advanced card with strong hierarchy */}
            <Box
              sx={{
                mb: 5,
                p: { xs: 3, md: 4 },
                borderRadius: '7px',
                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(PAGE_PRIMARY, 0.03)} 100%)`,
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.12),
                boxShadow: `
                  0 8px 32px rgba(15, 23, 42, 0.1),
                  0 0 0 1px ${alpha(theme.palette.grey[300], 0.15)},
                  inset 0 1px 0 ${alpha('#fff', 0.8)}
                `,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT}, ${PAGE_PRIMARY})`,
                  opacity: 0.9,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: `linear-gradient(180deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                  opacity: 0.2,
                },
              }}
            >
              {/* Search bar + Search & Reset buttons — same line */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 1.5,
                  mb: 4,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                <Box
                  sx={{
                    flex: '1 1 auto',
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'stretch',
                    borderRadius: '7px',
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: alpha(theme.palette.grey[400], 0.35),
                    bgcolor: alpha(theme.palette.grey[500], 0.04),
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: alpha(PAGE_PRIMARY, 0.35),
                      bgcolor: alpha(theme.palette.grey[500], 0.06),
                    },
                    '&:focus-within': {
                      borderColor: PAGE_PRIMARY,
                      bgcolor: 'background.paper',
                      boxShadow: `0 0 0 4px ${alpha(PAGE_PRIMARY, 0.15)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 2,
                      bgcolor: alpha(PAGE_PRIMARY, 0.08),
                      borderRight: '1px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.12),
                    }}
                  >
                    <SearchIcon sx={{ color: PAGE_PRIMARY, fontSize: 24 }} />
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Search scenarios by title"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      sx: {
                        py: 1.75,
                        px: 2,
                        fontSize: '1rem',
                        '&::placeholder': {
                          color: 'text.secondary',
                          opacity: 0.9,
                        },
                      },
                    }}
                    sx={{
                      '& .MuiInput-root': {
                        color: 'text.primary',
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.25,
                    flexShrink: 0,
                    width: { xs: '100%', sm: 'auto' },
                    '& .MuiButton-root': {
                      flex: { xs: 1, sm: '0 0 auto' },
                      minWidth: 0,
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
                    sx={{
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1.25,
                      borderRadius: '7px',
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      textTransform: 'none',
                      bgcolor: PAGE_PRIMARY,
                      boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
                      '&:hover': {
                        bgcolor: PAGE_PRIMARY_DARK,
                        boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.45)}`,
                      },
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<RestartAltIcon sx={{ fontSize: 20 }} />}
                    sx={{
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1.25,
                      borderRadius: '7px',
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      textTransform: 'none',
                      borderWidth: 2,
                      borderColor: PAGE_PRIMARY,
                      color: PAGE_PRIMARY,
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: PAGE_PRIMARY_DARK,
                        bgcolor: alpha(PAGE_PRIMARY, 0.06),
                      },
                      '& .MuiButton-startIcon': { color: PAGE_PRIMARY },
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>

              {/* All three filters — 4 options each, single line, smaller text */}
              {(() => {
                const filterPillSx = (selected) => ({
                  px: 1.15,
                  py: 0.55,
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: selected ? 'transparent' : alpha(theme.palette.grey[400], 0.55),
                  bgcolor: selected ? PAGE_PRIMARY : alpha(theme.palette.grey[500], 0.06),
                  color: selected ? '#fff !important' : theme.palette.text.secondary,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  lineHeight: 1.05,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  boxShadow: selected ? `0 6px 14px ${alpha(PAGE_PRIMARY, 0.18)}` : 'none',
                  '&:hover': {
                    borderColor: selected ? 'transparent' : PAGE_PRIMARY,
                    bgcolor: selected ? PAGE_PRIMARY_DARK : alpha(PAGE_PRIMARY, 0.08),
                    color: selected ? '#fff !important' : PAGE_PRIMARY,
                  },
                  '&:focus-visible': {
                    outline: `3px solid ${alpha(PAGE_PRIMARY, 0.25)}`,
                    outlineOffset: 2,
                  },
                })
                const filterBlockSx = {
                  flex: '1 1 0',
                  minWidth: 0,
                  py: 2,
                  px: 2,
                  borderRadius: '7px',
                  bgcolor: alpha(theme.palette.grey[500], 0.04),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.grey[300], 0.4),
                }
                const scenarioTypeValues = ['all', ...scenarioTypeOptions]
                const levelValues = [{ value: 'all', label: 'All' }, ...levelOptions.map((o) => ({ value: o.id, label: o.name }))]
                const topicValues = [{ value: 'all', label: 'All' }, ...topicOptions.map((o) => ({ value: o.id, label: o.name }))]
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 2,
                    }}
                  >
                    {/* Scenario type — single line, horizontal scroll, scroll 2 lines at once */}
                    <Box sx={filterBlockSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
                        <AssignmentIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Scenario type
                        </Typography>
                      </Box>
                      <Box
                        ref={scenarioTypeScrollRef}
                        onWheel={(e) => {
                          const el = scenarioTypeScrollRef.current
                          if (!el) return
                          e.preventDefault()
                          el.scrollLeft += e.deltaY * 2
                        }}
                        sx={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          gap: 1,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          pb: 0.5,
                          scrollbarWidth: 'thin',
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': { height: 6 },
                          '&::-webkit-scrollbar-track': {
                            bgcolor: alpha(theme.palette.grey[400], 0.15),
                            borderRadius: 3,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            bgcolor: alpha(theme.palette.grey[500], 0.5),
                            borderRadius: 3,
                            '&:hover': { bgcolor: alpha(theme.palette.grey[600], 0.6) },
                          },
                        }}
                      >
                        {filtersLoading
                          ? Array.from({ length: 6 }).map((_, idx) => (
                              <Skeleton
                                key={`st-skel-${idx}`}
                                variant="rounded"
                                width={80}
                                height={28}
                                sx={{ borderRadius: '999px' }}
                              />
                            ))
                          : scenarioTypeValues.map((value) => (
                              <Box
                                key={value}
                                component="button"
                                type="button"
                                onClick={() => {
                                  setExamFilter(value)
                                  setPage(1)
                                }}
                                sx={{ ...filterPillSx(examFilter === value), flexShrink: 0 }}
                              >
                                {value === 'all' ? 'All' : value}
                              </Box>
                            ))}
                      </Box>
                    </Box>

                    {/* Difficulty level — single line, horizontal scroll */}
                    <Box sx={filterBlockSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
                        <SpeedIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Difficulty level
                        </Typography>
                      </Box>
                      <Box
                        ref={levelFilterScrollRef}
                        onWheel={(e) => {
                          const el = levelFilterScrollRef.current
                          if (!el) return
                          e.preventDefault()
                          el.scrollLeft += e.deltaY * 2
                        }}
                        sx={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          gap: 1,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          pb: 0.5,
                          scrollbarWidth: 'thin',
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': { height: 6 },
                          '&::-webkit-scrollbar-track': {
                            bgcolor: alpha(theme.palette.grey[400], 0.15),
                            borderRadius: 3,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            bgcolor: alpha(theme.palette.grey[500], 0.5),
                            borderRadius: 3,
                            '&:hover': { bgcolor: alpha(theme.palette.grey[600], 0.6) },
                          },
                        }}
                      >
                        {filtersLoading
                          ? Array.from({ length: 4 }).map((_, idx) => (
                              <Skeleton
                                key={`lvl-skel-${idx}`}
                                variant="rounded"
                                width={70}
                                height={28}
                                sx={{ borderRadius: '999px' }}
                              />
                            ))
                          : levelValues.map((opt) => (
                              <Box
                                key={opt.value}
                                component="button"
                                type="button"
                                onClick={() => {
                                  setLevelFilter(opt.value)
                                  setPage(1)
                                }}
                                sx={{ ...filterPillSx(levelFilter === opt.value), flexShrink: 0 }}
                              >
                                {opt.label}
                              </Box>
                            ))}
                      </Box>
                    </Box>

                    {/* Topic / focus — single line, horizontal scroll */}
                    <Box sx={filterBlockSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
                        <CategoryIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Topic / focus
                        </Typography>
                      </Box>
                      <Box
                        ref={topicFilterScrollRef}
                        onWheel={(e) => {
                          const el = topicFilterScrollRef.current
                          if (!el) return
                          e.preventDefault()
                          el.scrollLeft += e.deltaY * 2
                        }}
                        sx={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          gap: 1,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          pb: 0.5,
                          scrollbarWidth: 'thin',
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': { height: 6 },
                          '&::-webkit-scrollbar-track': {
                            bgcolor: alpha(theme.palette.grey[400], 0.15),
                            borderRadius: 3,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            bgcolor: alpha(theme.palette.grey[500], 0.5),
                            borderRadius: 3,
                            '&:hover': { bgcolor: alpha(theme.palette.grey[600], 0.6) },
                          },
                        }}
                      >
                        {filtersLoading
                          ? Array.from({ length: 4 }).map((_, idx) => (
                              <Skeleton
                                key={`tp-skel-${idx}`}
                                variant="rounded"
                                width={90}
                                height={28}
                                sx={{ borderRadius: '999px' }}
                              />
                            ))
                          : topicValues.map((opt) => (
                              <Box
                                key={opt.value}
                                component="button"
                                type="button"
                                onClick={() => {
                                  setTopicFilter(opt.value)
                                  setPage(1)
                                }}
                                sx={{ ...filterPillSx(topicFilter === opt.value), flexShrink: 0 }}
                              >
                                {opt.label}
                              </Box>
                            ))}
                      </Box>
                    </Box>
                  </Box>
                )
              })()}
            </Box>

            {/* Results count — left: icon + text; right: static status dropdown */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <ViewListIcon sx={{ color: PAGE_PRIMARY, fontSize: 22 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                  }}
                >
                  {!listLoading && pagination.total > 0
                    ? (() => {
                        const total = pagination.total
                        const from = pagination.from ?? 0
                        const to = pagination.to ?? 0
                        const range = from === to ? `${from}` : `${from}–${to}`
                        return `Showing ${range} of ${total} ${total === 1 ? 'scenario' : 'scenarios'}`
                      })()
                    : !listLoading && pagination.total === 0
                      ? 'No scenarios match your filters'
                      : listLoading
                        ? 'Loading…'
                        : 'No scenarios match your filters'}
                </Typography>
              </Box>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="scenarios-status-label">Status</InputLabel>
                <Select
                  labelId="scenarios-status-label"
                  value={statusFilterDisplay}
                  label="Status"
                  onChange={(e) => setStatusFilterDisplay(e.target.value)}
                  sx={{
                    borderRadius: '7px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Scenarios grid — skeletons, list, and pagination */}
            {listLoading ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 3, sm: 4 },
                }}
              >
                {Array.from({ length: SCENARIOS_PER_PAGE }).map((_, idx) => (
                  <Card
                    key={`skeleton-${idx}`}
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.12),
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                        <Skeleton
                          variant="rounded"
                          width={72}
                          height={72}
                          sx={{ borderRadius: '7px' }}
                        />
                        <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: '16px' }} />
                      </Box>
                      <Skeleton variant="text" width="70%" sx={{ mb: 1.5 }} />
                      <Skeleton variant="text" width="90%" sx={{ mb: 0.75 }} />
                      <Skeleton variant="text" width="80%" sx={{ mb: 2 }} />
                      <Skeleton variant="rounded" width="60%" height={24} sx={{ mb: 2, borderRadius: '12px' }} />
                      <Skeleton variant="rounded" width="100%" height={44} sx={{ borderRadius: '7px' }} />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : scenarios.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: { xs: 3, sm: 4 },
                  }}
                >
                  {scenarios.map((scenario) => (
                    <Box key={scenario.id}>
                      <ScenarioCard scenario={scenario} onContinueClick={handleContinueClick} />
                    </Box>
                  ))}
                </Box>

                {/* Theme-friendly pagination */}
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
              <Box
                sx={{
                  textAlign: 'center',
                  py: 10,
                  px: 2,
                  borderRadius: '7px',
                  bgcolor: alpha(theme.palette.grey[500], 0.04),
                  border: '1px dashed',
                  borderColor: alpha(theme.palette.grey[400], 0.4),
                }}
              >
                <SearchIcon
                  sx={{
                    fontSize: 64,
                    color: PAGE_PRIMARY,
                    opacity: 0.35,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                    fontWeight: 700,
                  }}
                >
                  No scenarios found
                </Typography>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <FilterListIcon sx={{ fontSize: 20, color: PAGE_PRIMARY, opacity: 0.8 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              </Box>
            )}
          </Container>
        </Box>
      </Box>

      {!hideFooter && <Footer />}

      {/* Login required dialog (similar to Webinars) */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
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
            borderColor: alpha(PAGE_PRIMARY, 0.25),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
              : `0 12px 40px ${alpha(PAGE_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
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
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: '7px',
                bgcolor: theme.palette.grey[400],
              }}
            />
          </Box>
        )}
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 3,
            pt: isMobile ? 2 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(PAGE_PRIMARY, 0.12),
                color: PAGE_PRIMARY,
              }}
            >
              <LockRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Login required
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setLoginDialogOpen(false)}
            sx={{
              color: theme.palette.grey[600],
              flexShrink: 0,
              '&:hover': { color: PAGE_PRIMARY, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: 3,
            pt: 2,
            pb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <InfoOutlinedIcon sx={{ fontSize: 22, color: PAGE_PRIMARY, mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: '0.9375rem' }}>
              You need to be logged in to start practising scenarios. Please sign in to your account to continue.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setLoginDialogOpen(false)}
            sx={{
              textTransform: 'none',
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="button"
            onClick={() => {
              setLoginDialogOpen(false)
              navigate('/sign-in')
            }}
            startIcon={<LoginRoundedIcon sx={{ fontSize: 20 }} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '7px',
              px: 2.5,
              bgcolor: PAGE_PRIMARY,
              '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Before you start practising dialog (only when logged in) */}
      <Dialog
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
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
            margin: isMobile ? 0 : 3,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '7px 7px 0 0' : '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.25),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
              : `0 12px 40px ${alpha(PAGE_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            '&::before': isMobile
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
                }
              : undefined,
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: alpha(theme.palette.common.black, 0.65),
              backdropFilter: 'blur(6px)',
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
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: '7px',
                bgcolor: theme.palette.grey[400],
              }}
            />
          </Box>
        )}
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 3,
            pt: isMobile ? 2 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(PAGE_PRIMARY, 0.12),
                color: PAGE_PRIMARY,
              }}
            >
              <QuizRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Before you start practising
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25, fontSize: '0.85rem' }}>
                Quick rules for this scenario practice session.
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setRulesOpen(false)}
            sx={{
              borderRadius: '7px',
              color: theme.palette.grey[600],
              flexShrink: 0,
              '&:hover': { color: PAGE_PRIMARY, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: 3,
            pt: 1,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Please read these points carefully. They explain how your scenario practice session will work.
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              Questions will appear one by one with a counter (e.g. 1/5, 2/5).
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              You can move back to previous questions, but once an answer is submitted it cannot be changed.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              Each answered question will update your scenario score percentage.
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
              At the end of the scenario you will see your performance summary and a button to continue to the next scenario.
            </Typography>
            <Typography component="li" variant="body2">
              This is a practice environment only – no marks are stored permanently yet.
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: '7px',
              bgcolor: alpha(PAGE_PRIMARY, 0.04),
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.2),
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <InfoOutlinedIcon sx={{ color: PAGE_PRIMARY, mt: 0.2 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              We recommend attempting questions in exam-style conditions: avoid pausing mid-scenario and focus on reasoning, not memorising answers.
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRulesOpen(false)}
            sx={{
              textTransform: 'none',
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="button"
            onClick={handleStartPractice}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '7px',
              px: 2.5,
              bgcolor: PAGE_PRIMARY,
              '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
            }}
          >
            {isMobile ? 'Start Practice' : 'I understand, start practice'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Scenarios
