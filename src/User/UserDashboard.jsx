import { useEffect, useMemo, useState, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Chip,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  LinearProgress,
  Pagination,
  TextField,
  useTheme,
  useMediaQuery,
  ButtonGroup,
  Button,
  IconButton,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'
import AllInclusiveRoundedIcon from '@mui/icons-material/AllInclusiveRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'

const TABS = [
  { id: 'statistics', label: 'Statistics', Icon: BarChartRoundedIcon },
  { id: 'courses', label: 'Mocks Exams', Icon: MenuBookRoundedIcon },
  { id: 'history', label: 'History', Icon: HistoryRoundedIcon },
]

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'
const primaryGradient = `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`

// User stats cards: mocks exams collection one-liners (replace with API)
const statsCards = [
  { id: 'all', label: 'All', value: '12', sub: 'Total mocks exams', Icon: AllInclusiveRoundedIcon, gradient: primaryGradient },
  { id: 'active', label: 'Active', value: '3', sub: 'In progress', Icon: PlayCircleOutlineRoundedIcon, gradient: primaryGradient },
  { id: 'completed', label: 'Completed', value: '2', sub: 'Finished', Icon: CheckCircleRoundedIcon, gradient: primaryGradient },
  { id: 'new', label: 'New', value: '7', sub: 'Not started', Icon: NewReleasesRoundedIcon, gradient: primaryGradient },
]

// Mock exam type filter tabs (one-liner filter)
const COURSE_FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'new', label: 'New' },
]

// Mock data for bar chart: mock exam progress (label, percentage)
const progressBarData = [
  { label: 'UKMLA Reasoning Core', value: 78 },
  { label: 'Ethics & GMC', value: 45 },
  { label: 'Patient Safety', value: 22 },
]

// Mock data for pie: mock exam distribution (label, percentage, color)
const pieData = [
  { label: 'Active', value: 25, color: '#0D9488' },
  { label: 'Completed', value: 17, color: '#10B981' },
  { label: 'New', value: 58, color: '#64748B' },
]

// NOTE: This is intentionally embedded here so the Dashboard Mocks Exams tab can
// show the full Mocks Exams page experience (without modifying `Courses.jsx`).
const dashboardCoursesData = [
  {
    id: 1,
    title: 'Full UKMLA Reasoning Core',
    exam: 'UKMLA',
    description:
      'Master the complete reasoning framework UK examiners expect. From history-taking to differential diagnosis, learn to think systematically through every case.',
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
    exam: 'UKMLA',
    description:
      'Navigate complex ethical scenarios with confidence. Apply GMC principles to consent, confidentiality, capacity, and professional conduct in real exam scenarios.',
    tags: ['Ethics', 'GMC', 'Professional Judgement'],
    duration: '6 weeks',
    level: 'Core',
    enrolled: true,
    // Set to 100 here so "Completed" filter has real results in dashboard.
    progress: 100,
    isPaid: false,
    icon: <GavelIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 3,
    title: 'Patient Safety & Red-Flag Thinking',
    exam: 'UKMLA',
    description:
      'Identify critical red flags and prioritize patient safety in every decision. Learn to spot examiner traps testing your ability to protect patients.',
    tags: ['Patient Safety', 'Reasoning', 'Red Flags'],
    duration: '4 weeks',
    level: 'Foundation',
    enrolled: true,
    progress: 100,
    isPaid: false,
    icon: <LocalHospitalIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 4,
    title: 'Data Interpretation & Examiner Traps',
    exam: 'UKMLA',
    description:
      'Master ECG, blood gas, lab results, and imaging interpretation. Understand examiner intent behind data-heavy questions and avoid common pitfalls.',
    tags: ['Reasoning', 'Data Analysis', 'Pattern Recognition'],
    duration: '8 weeks',
    level: 'Advanced',
    enrolled: true,
    progress: 100,
    isPaid: true,
    icon: <AssessmentIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 5,
    title: 'Pattern Recognition & Diagnostic Contrast',
    exam: 'PLAB 1',
    description:
      'Train your brain to distinguish similar presentations. Learn systematic comparison techniques for look-alike conditions that frequently appear in exams.',
    tags: ['Reasoning', 'Pattern Recognition', 'Diagnostics'],
    duration: '6 weeks',
    level: 'Advanced',
    enrolled: true,
    progress: 100,
    isPaid: true,
    icon: <CompareIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
  {
    id: 6,
    title: 'PLAB 1 Reasoning Essentials',
    exam: 'PLAB 1',
    description:
      'Comprehensive reasoning training specifically for PLAB 1 format. Focus on UK-specific guidelines, GMC standards, and examiner expectations.',
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
    exam: 'UKMLA',
    description:
      'Apply evidence-based principles to exam scenarios. Interpret research, guidelines, and best practices through the lens of reasoning.',
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
    exam: 'UKMLA',
    description:
      'Master the reasoning behind difficult conversations. Learn to structure consent discussions, break bad news, and manage challenging interactions.',
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
    exam: 'UKMLA',
    description:
      'Navigate the legal and ethical frameworks around capacity assessment and mental health legislation with practical reasoning frameworks.',
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
    exam: 'UKMLA',
    description:
      'Apply safeguarding principles and child protection procedures within a reasoning-first framework. Recognise red flags and know when and how to escalate appropriately.',
    tags: ['Ethics', 'Patient Safety', 'GMC'],
    duration: '4 weeks',
    level: 'Foundation',
    enrolled: false,
    progress: 0,
    isPaid: false,
    icon: <LocalHospitalIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} />,
  },
]

const DASHBOARD_COURSES_TOPIC_OPTIONS = ['all', 'Reasoning', 'Ethics', 'Patient Safety']
const DASHBOARD_COURSE_STATUS_FILTERS = [
  { id: 'all', label: 'All mocks exams', mobileLabel: 'All' },
  { id: 'ongoing', label: 'Ongoing mocks exams', mobileLabel: 'Ongoing' },
  { id: 'completed', label: 'Completed', mobileLabel: 'Completed' },
]

function DashboardCourseCard({ course }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [rulesOpen, setRulesOpen] = useState(false)

  const ctaConfig = {
    text: 'Continue Learning',
    icon: <PlayArrowIcon />,
    variant: 'contained',
  }

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
          opacity: course.enrolled ? 1 : 0,
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
          '& .course-card-icon-wrap': {
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          <Box
            className="course-card-icon-wrap"
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
            {course.icon}
          </Box>
          <Chip
            label={course.exam}
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
          {course.title}
        </Typography>

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
          {course.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
          {course.tags.map((tag, index) => (
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
              {course.duration}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '7px',
              bgcolor: alpha(getLevelColor(course.level), 0.1),
              border: '1px solid',
              borderColor: alpha(getLevelColor(course.level), 0.25),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: getLevelColor(course.level),
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {course.level}
            </Typography>
          </Box>
        </Box>

        {course.enrolled && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8125rem', fontWeight: 700 }}>
                  Your Progress
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: PAGE_PRIMARY, fontSize: '0.8125rem', fontWeight: 800 }}>
                {course.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={course.progress}
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

        <Button
          variant={ctaConfig.variant}
          fullWidth
          startIcon={ctaConfig.icon}
          onClick={() => setRulesOpen(true)}
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
                  Quick rules for this practice session.
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
              Please read these points carefully. They explain how your practice session will work.
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                Questions will appear one by one with a counter (e.g. 1/5, 2/5).
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                You can move back to previous questions, but once an answer is submitted it cannot be changed.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                Each answered question will update your lecture score percentage.
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                At the end of the lecture you will see your performance summary and a button to continue to the next lecture.
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
                We recommend attempting questions in exam-style conditions: avoid pausing mid-lecture and focus on reasoning, not memorising answers.
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
              onClick={() => {
                setRulesOpen(false)
                navigate('/user-dashboard/course-practice')
              }}
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
      </CardContent>
    </Card>
  )
}

function DashboardCoursesTab() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [examFilter, setExamFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [page, setPage] = useState(1)
  const examFilterScrollRef = useRef(null)
  const levelFilterScrollRef = useRef(null)
  const topicFilterScrollRef = useRef(null)

  const filteredCourses = useMemo(() => {
    return dashboardCoursesData.filter((course) => {
      const matchesSearch =
        !searchQuery.trim() ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesExam = examFilter === 'all' || examFilter === 'Both' || course.exam === examFilter
      const matchesLevel = levelFilter === 'all' || course.level === levelFilter
      const matchesTopic =
        topicFilter === 'all' || course.tags.some((tag) => tag.toLowerCase() === topicFilter.toLowerCase())

      const matchesStatus = (() => {
        if (statusFilter === 'all') return true
        if (statusFilter === 'ongoing') return course.enrolled && course.progress > 0 && course.progress < 100
        if (statusFilter === 'completed') return course.enrolled && course.progress >= 100
        return true
      })()

      return matchesSearch && matchesExam && matchesLevel && matchesTopic && matchesStatus
    })
  }, [searchQuery, examFilter, levelFilter, topicFilter, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, examFilter, levelFilter, topicFilter, statusFilter])

  const handleSearch = () => {
    setSearchQuery(searchInput.trim())
    setPage(1)
  }

  const handleReset = () => {
    setStatusFilter('all')
    setSearchInput('')
    setSearchQuery('')
    setExamFilter('all')
    setLevelFilter('all')
    setTopicFilter('all')
    setPage(1)
  }

  const COURSES_PER_PAGE = 6
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const paginatedCourses = useMemo(() => {
    const start = (safePage - 1) * COURSES_PER_PAGE
    return filteredCourses.slice(start, start + COURSES_PER_PAGE)
  }, [filteredCourses, safePage])

  const pillOptionSx = (selected) => ({
    px: 0.9,
    py: 0.35,
    borderRadius: '7px',
    border: '1px solid',
    borderColor: selected ? 'transparent' : alpha(theme.palette.grey[400], 0.55),
    bgcolor: selected ? PAGE_PRIMARY : alpha(theme.palette.grey[500], 0.06),
    color: selected ? '#fff !important' : theme.palette.text.secondary,
    fontWeight: 700,
    fontSize: '0.6875rem',
    lineHeight: 1.1,
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
      outline: `2px solid ${alpha(PAGE_PRIMARY, 0.28)}`,
      outlineOffset: 2,
    },
  })

  const filterBlockSx = {
    flex: '1 1 0',
    minWidth: 0,
    py: 1.5,
    px: 1.5,
    borderRadius: '7px',
    bgcolor: alpha(theme.palette.grey[500], 0.04),
    border: '1px solid',
    borderColor: alpha(theme.palette.grey[300], 0.4),
  }

  const examOptions = ['all', 'UKMLA', 'PLAB 1', 'Both']
  const levelOptions = ['all', 'Foundation', 'Core', 'Advanced']

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          position: 'relative',
        }}
      >
        <Box
          component="section"
          aria-labelledby="browse-mocks-exams-heading"
          sx={{
            py: { xs: 5, md: 7 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(
              PAGE_PRIMARY,
              0.02
            )} 50%, ${theme.palette.background.default} 100%)`,
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
            {/* Prominent status filter: All | Ongoing | Completed */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.14),
                bgcolor: alpha(PAGE_PRIMARY, 0.03),
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: 'text.secondary',
                  mb: 1.25,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.04em',
                }}
              >
                Filter by status
              </Typography>
              <ButtonGroup
                variant="outlined"
                size="medium"
                disableElevation
                sx={{
                  flexWrap: 'wrap',
                  gap: 1,
                  '& .MuiButton-root': {
                    textTransform: 'none',
                    fontWeight: 800,
                    borderRadius: '7px',
                    borderWidth: 2,
                    borderColor: alpha(PAGE_PRIMARY, 0.28),
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1, sm: 1.1 },
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    color: 'text.secondary',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: PAGE_PRIMARY,
                      bgcolor: alpha(PAGE_PRIMARY, 0.08),
                      color: PAGE_PRIMARY_DARK,
                    },
                  },
                }}
              >
                {DASHBOARD_COURSE_STATUS_FILTERS.map((tab) => {
                  const isActive = statusFilter === tab.id
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      sx={{
                        ...(isActive && {
                          bgcolor: PAGE_PRIMARY,
                          color: '#fff !important',
                          borderColor: PAGE_PRIMARY,
                          boxShadow: `0 8px 20px ${alpha(PAGE_PRIMARY, 0.28)}`,
                          '&:hover': {
                            bgcolor: PAGE_PRIMARY_DARK,
                            color: '#fff !important',
                            borderColor: PAGE_PRIMARY_DARK,
                          },
                        }),
                      }}
                    >
                      {isMobile ? tab.mobileLabel : tab.label}
                    </Button>
                  )
                })}
              </ButtonGroup>
            </Paper>

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
                    placeholder="Search mocks exams by title, topic, or focus area..."
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

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                }}
              >
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
                      Exam type
                    </Typography>
                  </Box>
                  <Box
                    ref={examFilterScrollRef}
                    onWheel={(e) => {
                      const el = examFilterScrollRef.current
                      if (!el) return
                      e.preventDefault()
                      el.scrollLeft += e.deltaY * 2
                    }}
                    sx={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      gap: 0.75,
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
                    {examOptions.map((value) => (
                      <Box
                        key={value}
                        component="button"
                        type="button"
                        onClick={() => setExamFilter(value)}
                        sx={{ ...pillOptionSx(examFilter === value), flexShrink: 0 }}
                      >
                        {value === 'all' ? 'All' : value}
                      </Box>
                    ))}
                  </Box>
                </Box>

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
                      gap: 0.75,
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
                    {levelOptions.map((value) => (
                      <Box
                        key={value}
                        component="button"
                        type="button"
                        onClick={() => setLevelFilter(value)}
                        sx={{ ...pillOptionSx(levelFilter === value), flexShrink: 0 }}
                      >
                        {value === 'all' ? 'All' : value}
                      </Box>
                    ))}
                  </Box>
                </Box>

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
                      gap: 0.75,
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
                    {DASHBOARD_COURSES_TOPIC_OPTIONS.map((value) => (
                      <Box
                        key={value}
                        component="button"
                        type="button"
                        onClick={() => setTopicFilter(value)}
                        sx={{ ...pillOptionSx(topicFilter === value), flexShrink: 0 }}
                      >
                        {value === 'all' ? 'All' : value}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

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
                {filteredCourses.length > 0
                  ? (() => {
                      const start = (safePage - 1) * COURSES_PER_PAGE + 1
                      const end = Math.min(safePage * COURSES_PER_PAGE, filteredCourses.length)
                      const total = filteredCourses.length
                      const range = start === end ? `${start}` : `${start}–${end}`
                      return `Showing ${range} of ${total} ${total === 1 ? 'mock exam' : 'mocks exams'}`
                    })()
                  : 'No mocks exams match your filters'}
              </Typography>
            </Box>

            {filteredCourses.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: { xs: 3, sm: 4 },
                  }}
                >
                  {paginatedCourses.map((course) => (
                    <Box key={course.id}>
                      <DashboardCourseCard course={course} />
                    </Box>
                  ))}
                </Box>

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
                  No mocks exams found
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
    </Box>
  )
}

function HistoryTab({ completedCourses }) {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: '7px',
        border: '1px solid',
        borderColor: alpha(PAGE_PRIMARY, 0.12),
        bgcolor: theme.palette.background.paper,
        boxShadow: `0 4px 20px ${alpha(PAGE_PRIMARY, 0.06)}`,
        minHeight: 320,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '7px',
            bgcolor: alpha(PAGE_PRIMARY, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HistoryRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Completed Mocks Exams
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {completedCourses.length} {completedCourses.length === 1 ? 'mock exam' : 'mocks exams'} completed
          </Typography>
        </Box>
      </Box>

      {completedCourses.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
          }}
        >
          {completedCourses.map((course) => (
            <Card
              key={course.id}
              elevation={0}
              sx={{
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.3),
                bgcolor: alpha(PAGE_PRIMARY, 0.04),
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(PAGE_PRIMARY, 0.12),
                      flexShrink: 0,
                    }}
                  >
                    {course.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Chip
                      label={course.exam}
                      size="small"
                      sx={{
                        borderRadius: '7px !important',
                        '&.MuiChip-root': { borderRadius: '7px' },
                        mb: 0.75,
                        fontWeight: 600,
                        fontSize: '0.6875rem',
                        height: 22,
                        bgcolor: alpha(PAGE_PRIMARY, 0.1),
                        color: PAGE_PRIMARY,
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.35 }}>
                      {course.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <CheckCircleRoundedIcon sx={{ fontSize: 18, color: PAGE_PRIMARY }} />
                      <Typography variant="caption" sx={{ color: PAGE_PRIMARY, fontWeight: 600 }}>
                        Completed ({course.progress}%)
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      to="/user-dashboard/course-details"
                      state={{ course: { id: course.id, title: course.title } }}
                      variant="outlined"
                      size="small"
                      startIcon={<InfoOutlinedIcon />}
                      sx={{
                        mt: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '7px',
                        borderWidth: 1.5,
                        py: 0.5,
                        px: 1.5,
                        borderColor: PAGE_PRIMARY,
                        color: PAGE_PRIMARY,
                        '&:hover': { borderWidth: 1.5, borderColor: PAGE_PRIMARY_DARK, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                      }}
                    >
                      Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            borderRadius: '7px',
            bgcolor: alpha(theme.palette.grey[500], 0.04),
            border: '1px dashed',
            borderColor: alpha(theme.palette.grey[400], 0.4),
          }}
        >
          <HistoryRoundedIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 1.5 }} />
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            No completed mocks exams yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Complete mocks exams to see them here.
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

function UserDashboard() {
  const theme = useTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeTab, setActiveTab] = useState('statistics')
  const [courseFilter, setCourseFilter] = useState('all')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (location.state?.tab === 'history') {
      setActiveTab('history')
    }
  }, [location.state?.tab])

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          maxWidth: 1000,
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          overflowX: 'hidden',
        }}
      >
        {/* Page title */}
        <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.35rem', sm: '1.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View your statistics, mocks exams, and activity history
          </Typography>
        </Box>

        {/* Main toggle: Statistics | Mocks Exams | History */}
        <Box
          sx={{
            mb: { xs: 2.5, sm: 3 },
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            flexWrap: 'wrap',
            px: 0,
          }}
        >
          <ButtonGroup
            variant="outlined"
            disableElevation
            sx={{
              borderRadius: '7px',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.25),
              bgcolor: alpha(PAGE_PRIMARY, 0.04),
              boxShadow: `0 2px 8px ${alpha(PAGE_PRIMARY, 0.08)}`,
              '& .MuiButton-root': {
                px: { xs: 2, sm: 3 },
                py: { xs: 1.25, sm: 1.5 },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                borderColor: 'transparent',
                borderRadius: 0,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:not(:last-of-type)': { borderRight: `1px solid ${alpha(PAGE_PRIMARY, 0.2)}` },
                '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.1), borderColor: 'transparent' },
              },
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.Icon
              const isActive = activeTab === tab.id
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  startIcon={<Icon sx={{ fontSize: 20, opacity: isActive ? 1 : 0.8 }} />}
                  sx={{
                    ...(isActive && {
                      bgcolor: PAGE_PRIMARY,
                      color: '#fff',
                      boxShadow: `0 2px 12px ${alpha(PAGE_PRIMARY, 0.4)}`,
                      '&:hover': {
                        bgcolor: PAGE_PRIMARY_DARK,
                        color: '#fff',
                        boxShadow: `0 4px 16px ${alpha(PAGE_PRIMARY, 0.45)}`,
                      },
                      '& .MuiSvgIcon-root': { color: 'inherit' },
                    }),
                    ...(!isActive && {
                      color: theme.palette.text.secondary,
                      '& .MuiSvgIcon-root': { color: PAGE_PRIMARY },
                    }),
                  }}
                >
                  {tab.label}
                </Button>
              )
            })}
          </ButtonGroup>
        </Box>

        {/* Statistics tab: dashboard cards + mock exam filter tabs + charts */}
        {activeTab === 'statistics' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
            {/* Stat cards: All, Active, Completed, New */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {statsCards.map((stat) => {
                const Icon = stat.Icon
                return (
                  <Card
                    key={stat.id}
                    elevation={0}
                    sx={{
                      flex: { xs: '1 1 calc(50% - 6px)', sm: '1 1 calc(25% - 12px)' },
                      minWidth: 0,
                      maxWidth: { xs: 'none', sm: 'calc(25% - 12px)' },
                      minHeight: { xs: 120, sm: 140 },
                      borderRadius: '7px',
                      bgcolor: theme.palette.background.paper,
                      border: '1px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.15),
                      boxShadow: `0 4px 16px ${alpha(PAGE_PRIMARY, 0.06)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.25s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: stat.gradient,
                      },
                      '&:hover': {
                        boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.12)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: stat.gradient,
                          color: 'white',
                          mb: 1.5,
                          boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.3)}`,
                        }}
                      >
                        <Icon sx={{ fontSize: 26 }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '1.75rem' }, lineHeight: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem' }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {stat.sub}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>

            {/* Mock exam type filter tabs: All | Active | Completed | New */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.12),
                bgcolor: alpha(PAGE_PRIMARY, 0.02),
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5, fontSize: '0.8125rem' }}>
                Filter by mock exam type
              </Typography>
              <ButtonGroup
                variant="outlined"
                size="small"
                disableElevation
                sx={{
                  flexWrap: 'wrap',
                  gap: 0.5,
                  '& .MuiButton-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    borderRadius: '7px',
                    borderColor: alpha(PAGE_PRIMARY, 0.3),
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: PAGE_PRIMARY,
                      bgcolor: alpha(PAGE_PRIMARY, 0.08),
                      color: PAGE_PRIMARY_DARK,
                    },
                  },
                }}
              >
                {COURSE_FILTER_TABS.map((tab) => {
                  const isFilterActive = courseFilter === tab.id
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setCourseFilter(tab.id)}
                      sx={{
                        ...(isFilterActive && {
                          bgcolor: PAGE_PRIMARY,
                          color: '#fff !important',
                          borderColor: PAGE_PRIMARY,
                          '&:hover': {
                            bgcolor: PAGE_PRIMARY_DARK,
                            color: '#fff !important',
                            borderColor: PAGE_PRIMARY_DARK,
                          },
                        }),
                      }}
                    >
                      {tab.label}
                    </Button>
                  )
                })}
              </ButtonGroup>
            </Paper>

            {/* Charts row: Bar chart + Pie chart */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              {/* Bar chart - progress by mock exam */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.12),
                  bgcolor: theme.palette.background.paper,
                  boxShadow: `0 4px 16px ${alpha(PAGE_PRIMARY, 0.06)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                    Progress by mock exam
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {progressBarData.map((item, idx) => (
                    <Box key={idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: PAGE_PRIMARY, fontWeight: 700, fontSize: '0.75rem' }}>
                          {item.value}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 10,
                          borderRadius: 1,
                          bgcolor: alpha(PAGE_PRIMARY, 0.12),
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${item.value}%`,
                            borderRadius: 1,
                            background: primaryGradient,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Pie chart - mock exam distribution */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.12),
                  bgcolor: theme.palette.background.paper,
                  boxShadow: `0 4px 16px ${alpha(PAGE_PRIMARY, 0.06)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BarChartRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                    Mock exam distribution
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: `conic-gradient(${pieData.map((d, i) => {
                        const start = pieData.slice(0, i).reduce((a, x) => a + x.value, 0)
                        return `${d.color} ${start}% ${start + d.value}%`
                      }).join(', ')})`,
                      boxShadow: `0 4px 16px ${alpha(PAGE_PRIMARY, 0.15)}`,
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {pieData.map((d, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: d.color }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {d.label}: {d.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

        {activeTab === 'courses' && <DashboardCoursesTab />}

        {/* History tab - completed mocks exams only, with Details button for all mocks exams */}
        {activeTab === 'history' && (
          <HistoryTab completedCourses={dashboardCoursesData.filter((c) => c.enrolled && c.progress >= 100)} />
        )}
      </Box>
      <Footer />
    </>
  )
}

export default UserDashboard
