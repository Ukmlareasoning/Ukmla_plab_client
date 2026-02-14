import { useState, useMemo, useEffect } from 'react'
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
} from '@mui/material'
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
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImage from '../assets/hero.jpg'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

// Mock data for scenarios (reasoning-first focus)
const scenariosData = [
  {
    id: 1,
    title: 'Full UKMLA Reasoning Core',
    scenarioType: 'Cardiology',
    description: 'Master the complete reasoning framework UK examiners expect. From history-taking to differential diagnosis, learn to think systematically through every case.',
    tags: ['Reasoning', 'GMC', 'Patient Safety'],
    duration: '12 weeks',
    level: 'Core',
    enrolled: true,
    progress: 45,
    isPaid: false,
    icon: <PsychologyIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 2,
    title: 'Ethics & GMC Decision-Making',
    scenarioType: 'Gynaecology',
    description: 'Navigate complex ethical scenarios with confidence. Apply GMC principles to consent, confidentiality, capacity, and professional conduct in real exam scenarios.',
    tags: ['Ethics', 'GMC', 'Professional Judgement'],
    duration: '6 weeks',
    level: 'Core',
    enrolled: true,
    progress: 78,
    isPaid: false,
    icon: <GavelIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 3,
    title: 'Patient Safety & Red-Flag Thinking',
    scenarioType: 'Respiratory',
    description: 'Identify critical red flags and prioritize patient safety in every decision. Learn to spot examiner traps testing your ability to protect patients.',
    tags: ['Patient Safety', 'Reasoning', 'Red Flags'],
    duration: '4 weeks',
    level: 'Foundation',
    enrolled: false,
    progress: 0,
    isPaid: false,
    icon: <LocalHospitalIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 4,
    title: 'Data Interpretation & Examiner Traps',
    scenarioType: 'Cardiology',
    description: 'Master ECG, blood gas, lab results, and imaging interpretation. Understand examiner intent behind data-heavy questions and avoid common pitfalls.',
    tags: ['Reasoning', 'Data Analysis', 'Pattern Recognition'],
    duration: '8 weeks',
    level: 'Advanced',
    enrolled: false,
    progress: 0,
    isPaid: true,
    icon: <AssessmentIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 5,
    title: 'Pattern Recognition & Diagnostic Contrast',
    scenarioType: 'Respiratory',
    description: 'Train your brain to distinguish similar presentations. Learn systematic comparison techniques for look-alike conditions that frequently appear in exams.',
    tags: ['Reasoning', 'Pattern Recognition', 'Diagnostics'],
    duration: '6 weeks',
    level: 'Advanced',
    enrolled: false,
    progress: 0,
    isPaid: true,
    icon: <CompareIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 6,
    title: 'PLAB 1 Reasoning Essentials',
    scenarioType: 'Neurology',
    description: 'Comprehensive reasoning training specifically for PLAB 1 format. Focus on UK-specific guidelines, GMC standards, and examiner expectations.',
    tags: ['Reasoning', 'GMC', 'UK Guidelines'],
    duration: '10 weeks',
    level: 'Core',
    enrolled: false,
    progress: 0,
    isPaid: false,
    icon: <PsychologyIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 7,
    title: 'Evidence-Based Medicine Reasoning',
    scenarioType: 'Gynaecology',
    description: 'Apply evidence-based principles to exam scenarios. Interpret research, guidelines, and best practices through the lens of reasoning.',
    tags: ['Reasoning', 'Evidence-Based Practice', 'Guidelines'],
    duration: '5 weeks',
    level: 'Advanced',
    enrolled: false,
    progress: 0,
    isPaid: true,
    icon: <LightbulbIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 8,
    title: 'Communication & Consent Reasoning',
    scenarioType: 'Gynaecology',
    description: 'Master the reasoning behind difficult conversations. Learn to structure consent discussions, break bad news, and manage challenging interactions.',
    tags: ['Ethics', 'Communication', 'GMC'],
    duration: '4 weeks',
    level: 'Foundation',
    enrolled: false,
    progress: 0,
    isPaid: false,
    icon: <VerifiedUserIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 9,
    title: 'Mental Capacity & Mental Health Act',
    scenarioType: 'Neurology',
    description: 'Navigate the legal and ethical frameworks around capacity assessment and mental health legislation with practical reasoning frameworks.',
    tags: ['Ethics', 'GMC', 'Mental Health'],
    duration: '3 weeks',
    level: 'Foundation',
    enrolled: false,
    progress: 0,
    isPaid: false,
    icon: <GavelIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 10,
    title: 'Safeguarding & Child Protection',
    scenarioType: 'Paediatrics',
    description: 'Apply safeguarding principles and child protection procedures within a reasoning-first framework. Recognise red flags and know when and how to escalate appropriately.',
    tags: ['Ethics', 'Patient Safety', 'GMC'],
    duration: '4 weeks',
    level: 'Foundation',
    enrolled: false,
    progress: 0,
    isPaid: false,
    icon: <LocalHospitalIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
]

// Reusable ScenarioCard component
function ScenarioCard({ scenario }) {
  const theme = useTheme()

  const getCtaConfig = () => {
    if (scenario.enrolled) {
      return {
        text: 'Continue Learning',
        icon: <PlayArrowIcon />,
        variant: 'contained',
      }
    }
    if (scenario.isPaid) {
      return {
        text: 'Continue Learning',
        icon: <LockIcon />,
        variant: 'contained',
      }
    }
    return {
      text: 'Continue Learning',
      icon: <VisibilityIcon />,
      variant: 'contained',
    }
  }

  const ctaConfig = getCtaConfig()

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
            {scenario.icon}
          </Box>
          <Chip
            label={scenario.scenarioType}
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
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
          {scenario.tags.map((tag, index) => (
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
              {scenario.duration}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '7px',
              bgcolor: alpha(getLevelColor(scenario.level), 0.1),
              border: '1px solid',
              borderColor: alpha(getLevelColor(scenario.level), 0.25),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: getLevelColor(scenario.level),
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {scenario.level}
            </Typography>
          </Box>
        </Box>

        {/* Progress bar (if enrolled) */}
        {scenario.enrolled && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 700 }}>
                  Your Progress
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: PAGE_PRIMARY, fontSize: '0.8125rem', fontWeight: 800 }}>
                {scenario.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={scenario.progress}
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
        )}

        {/* CTA Button */}
        <Button
          variant={ctaConfig.variant}
          fullWidth
          startIcon={ctaConfig.icon}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '7px',
            textTransform: 'none',
            borderWidth: ctaConfig.variant === 'outlined' ? 2 : undefined,
            ...(ctaConfig.variant === 'contained'
              ? { bgcolor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK } }
              : { borderColor: PAGE_PRIMARY, color: PAGE_PRIMARY, '&:hover': { borderColor: PAGE_PRIMARY_DARK, bgcolor: alpha(PAGE_PRIMARY, 0.08) } }),
            boxShadow: ctaConfig.variant === 'contained' ? `0 6px 20px ${alpha(PAGE_PRIMARY, 0.35)}` : 'none',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderWidth: ctaConfig.variant === 'outlined' ? 2 : undefined,
              transform: 'translateY(-3px)',
              boxShadow:
                ctaConfig.variant === 'contained'
                  ? `0 10px 28px ${alpha(PAGE_PRIMARY, 0.4)}`
                  : `0 6px 20px ${alpha(PAGE_PRIMARY, 0.18)}`,
            },
          }}
        >
          {ctaConfig.text}
        </Button>
      </CardContent>
    </Card>
  )
}

// Topic filter options — 4 total: All + 3 (from scenario tags)
const TOPIC_OPTIONS = ['all', 'Reasoning', 'Ethics', 'Patient Safety']

function Scenarios() {
  const theme = useTheme()
  const [searchInput, setSearchInput] = useState('') // what user types in the search bar
  const [searchQuery, setSearchQuery] = useState('') // applied when user clicks Search
  const [examFilter, setExamFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [page, setPage] = useState(1)

  // When navigating to Scenarios from another page, scroll to top so the main section is in view (not footer)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // Filtered scenarios — search applies only when Search button is clicked
  const filteredScenarios = useMemo(() => {
    return scenariosData.filter((scenario) => {
      const matchesSearch = !searchQuery.trim() ||
        scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesExam = examFilter === 'all' || scenario.scenarioType === examFilter
      const matchesLevel = levelFilter === 'all' || scenario.level === levelFilter
      const matchesTopic = topicFilter === 'all' || scenario.tags.some(
        (tag) => tag.toLowerCase() === topicFilter.toLowerCase()
      )

      return matchesSearch && matchesExam && matchesLevel && matchesTopic
    })
  }, [searchQuery, examFilter, levelFilter, topicFilter])

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

  const SCENARIOS_PER_PAGE = 6
  const totalPages = Math.max(1, Math.ceil(filteredScenarios.length / SCENARIOS_PER_PAGE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const paginatedScenarios = useMemo(() => {
    const start = (safePage - 1) * SCENARIOS_PER_PAGE
    return filteredScenarios.slice(start, start + SCENARIOS_PER_PAGE)
  }, [filteredScenarios, safePage])

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
        {/* Hero section — same pattern as Pricing, Contact Us, About Us */}
        <Box
          component="section"
          aria-label="Scenarios Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 300, md: 340 },
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
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    borderRadius: '7px',
                    overflow: 'hidden',
                    bgcolor: alpha(theme.palette.background.paper, 0.15),
                    backdropFilter: 'blur(30px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                    border: '1px solid',
                    borderColor: alpha(PAGE_PRIMARY, 0.25),
                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                    animation: 'fadeInUp 0.7s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '7px',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)} 0%, transparent 100%)`,
                      pointerEvents: 'none',
                      zIndex: 0,
                    },
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <MenuBookIcon sx={{ color: 'text.primary', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      Learning Paths
                    </Typography>
                  </Box>
                  <Typography
                    id="scenarios-heading"
                    component="h1"
                    variant="h1"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                      mb: 1.5,
                      color: 'text.primary',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Scenarios
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.primary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Master reasoning through structured, examiner-aligned scenarios. Train your thinking, not your memory.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<PsychologyIcon sx={{ fontSize: 18 }} />}
                      label="Reasoning-first"
                      size="small"
                      sx={{
                        borderRadius: '7px !important',
                        '&.MuiChip-root': { borderRadius: '7px' },
                        bgcolor: alpha(PAGE_PRIMARY, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
                      label="UKMLA & PLAB 1"
                      size="small"
                      sx={{
                        borderRadius: '7px !important',
                        '&.MuiChip-root': { borderRadius: '7px' },
                        bgcolor: alpha(PAGE_PRIMARY, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                  </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Section with gradient background — theme-aligned with Home */}
        <Box
          component="section"
          aria-labelledby="browse-scenarios-heading"
          sx={{
            py: { xs: 5, md: 7 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(PAGE_PRIMARY, 0.02)} 50%, ${theme.palette.background.default} 100%)`,
            position: 'relative',
            '&::before': {
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
                    placeholder="Search scenarios by title, topic, or focus area..."
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
                const scenarioTypeOptions = ['all', 'Cardiology', 'Respiratory', 'Gynaecology', 'Neurology', 'Paediatrics']
                const levelOptions = ['all', 'Foundation', 'Core', 'Advanced']
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 2,
                    }}
                  >
                    {/* Scenario type — 4 options */}
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
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {scenarioTypeOptions.map((value) => (
                          <Box
                            key={value}
                            component="button"
                            type="button"
                            onClick={() => setExamFilter(value)}
                            sx={filterPillSx(examFilter === value)}
                          >
                            {value === 'all' ? 'All' : value}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Difficulty level — 4 options */}
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
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {levelOptions.map((value) => (
                          <Box
                            key={value}
                            component="button"
                            type="button"
                            onClick={() => setLevelFilter(value)}
                            sx={filterPillSx(levelFilter === value)}
                          >
                            {value === 'all' ? 'All' : value}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Topic / focus — 4 options */}
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
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {TOPIC_OPTIONS.map((value) => (
                          <Box
                            key={value}
                            component="button"
                            type="button"
                            onClick={() => setTopicFilter(value)}
                            sx={filterPillSx(topicFilter === value)}
                          >
                            {value === 'all' ? 'All' : value}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )
              })()}
            </Box>

            {/* Results count — icon + pagination text */}
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
                {filteredScenarios.length > 0
                  ? (() => {
                      const start = (safePage - 1) * SCENARIOS_PER_PAGE + 1
                      const end = Math.min(safePage * SCENARIOS_PER_PAGE, filteredScenarios.length)
                      const total = filteredScenarios.length
                      const range = start === end ? `${start}` : `${start}–${end}`
                      return `Showing ${range} of ${total} ${total === 1 ? 'scenario' : 'scenarios'}`
                    })()
                  : 'No scenarios match your filters'}
              </Typography>
            </Box>

            {/* Scenarios grid — 2 per row; 1 per row on small screens only */}
            {filteredScenarios.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: { xs: 3, sm: 4 },
                  }}
                >
                  {paginatedScenarios.map((scenario) => (
                    <Box key={scenario.id}>
                      <ScenarioCard scenario={scenario} />
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

      <Footer />
    </Box>
  )
}

export default Scenarios
