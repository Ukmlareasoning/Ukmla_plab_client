import { useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const SIDEBAR_BG = '#1e3a5f'
const SIDEBAR_ACTIVE_BG = 'rgba(255,255,255,0.12)'

const TABS = [
  { id: 'statistics', label: 'Statistics', Icon: BarChartRoundedIcon },
  { id: 'courses', label: 'Mocks Exams', Icon: MenuBookRoundedIcon },
  { id: 'history', label: 'History', Icon: HistoryRoundedIcon },
]

const buildPracticeCourse = (courseId) => {
  const baseTitle = 'Practice mock exam'
  const titleSuffix = courseId ? ` – Mock exam #${courseId}` : ''

  const lectures = Array.from({ length: 5 }, (_, index) => {
    const lectureNo = index + 1
    const questions = [
      {
        id: lectureNo * 10 + 1,
        text: 'A 28-year-old patient presents with a 3-day history of fever and cough. What is the most appropriate first-line investigation?',
        options: [
          { letter: 'A', text: 'Full blood count', correct: false },
          { letter: 'B', text: 'Chest X-ray', correct: true },
          { letter: 'C', text: 'CT chest', correct: false },
          { letter: 'D', text: 'Sputum culture only', correct: false },
        ],
      },
      {
        id: lectureNo * 10 + 2,
        text: 'Which of the following best describes the GMC’s primary duty of a doctor?',
        options: [
          { letter: 'A', text: 'To follow hospital policy at all times', correct: false },
          { letter: 'B', text: 'To avoid complaints from patients', correct: false },
          { letter: 'C', text: 'To make the care of the patient their first concern', correct: true },
          { letter: 'D', text: 'To protect colleagues from criticism', correct: false },
        ],
      },
      {
        id: lectureNo * 10 + 3,
        text: 'A patient refuses a recommended treatment but has capacity. What is the most appropriate next step?',
        options: [
          { letter: 'A', text: 'Proceed anyway in the patient’s best interests', correct: false },
          { letter: 'B', text: 'Respect the decision and document the discussion', correct: true },
          { letter: 'C', text: 'Ask a relative to consent on their behalf', correct: false },
          { letter: 'D', text: 'Detain the patient under the Mental Health Act', correct: false },
        ],
      },
    ]

    return {
      id: lectureNo,
      lectureNo,
      title: `Exam ${lectureNo}`,
      questions,
    }
  })

  return {
    courseTitle: `${baseTitle}${titleSuffix}`,
    lectures,
  }
}

function CoursePractice() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const courseFromState = location.state?.course
  const courseId = courseFromState?.id
  const courseTitle = courseFromState?.title || 'Mock exam practice'

  const courseData = useMemo(() => buildPracticeCourse(courseId), [courseId])
  const lectures = courseData.lectures

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

  // Static total score for now (UI only)
  const totalCoursePercentage = 0

  const handleBack = () => {
    navigate('/user-dashboard', { state: { tab: 'courses' } })
  }

  const handleStartLecture = (index) => {
    const lecture = lectures[index]
    navigate('/user-dashboard/course-practice/details', {
      state: {
        lectureNo: lecture.lectureNo,
        courseTitle,
      },
    })
  }

  const renderLectureTabs = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {lectures.map((lecture, index) => {
          const isUnlocked = index === 0 // first exam active, others disabled for now

          return (
            <Paper
              key={lecture.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                opacity: isUnlocked ? 1 : 0.6,
                cursor: isUnlocked ? 'pointer' : 'default',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.16),
                bgcolor: alpha(PAGE_PRIMARY, 0.02),
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(PAGE_PRIMARY, 0.1),
                  flexShrink: 0,
                }}
              >
                <QuizRoundedIcon sx={{ color: PAGE_PRIMARY }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Exam {lecture.lectureNo}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {lecture.questions.length} questions
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={0}
                      sx={{
                        height: 8,
                        borderRadius: '7px',
                        bgcolor: alpha(theme.palette.grey[400], 0.2),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: '7px',
                          bgcolor: getScoreColor(0),
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: getScoreColor(0), minWidth: 40, textAlign: 'right' }}
                  >
                    0%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={isUnlocked ? <PlayArrowIcon /> : <LockIcon />}
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && handleStartLecture(index)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '7px',
                    bgcolor: isUnlocked ? PAGE_PRIMARY : undefined,
                    '&:hover': isUnlocked ? { bgcolor: PAGE_PRIMARY_DARK } : undefined,
                  }}
                >
                  {isUnlocked ? 'Start' : 'Locked'}
                </Button>
              </Box>
            </Paper>
          )
        })}
      </Box>
    )
  }


  const activeTab = 'courses'
  const handleTabClick = (tabId) => {
    if (tabId === 'courses') return
    navigate('/user-dashboard', { state: { tab: tabId } })
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: 'calc(100vh - 120px)',
          overflowX: 'hidden',
        }}
      >
        {/* Sidebar — same as UserDashboard, Mocks Exams active */}
        <Box
          component="nav"
          aria-label="Dashboard navigation"
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            gap: 0,
            width: { xs: '100%', md: 220 },
            minHeight: { xs: 'auto', md: '100%' },
            bgcolor: SIDEBAR_BG,
            background: { md: `linear-gradient(180deg, #243b55 0%, ${SIDEBAR_BG} 50%, #182d47 100%)` },
            borderRight: { xs: 'none', md: '1px solid rgba(255,255,255,0.06)' },
            overflowX: { xs: 'auto', md: 'visible' },
            overflowY: { xs: 'visible', md: 'auto' },
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: { xs: 0, md: 6 }, height: { xs: 6, md: 0 } },
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.Icon
            const isActive = activeTab === tab.id
            return (
              <Box
                key={tab.id}
                component="button"
                type="button"
                onClick={() => handleTabClick(tab.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  width: { xs: 'auto', md: '100%' },
                  minWidth: { xs: 140, md: 'auto' },
                  flex: { xs: '1 1 0', md: 'none' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  px: { xs: 2, md: 2.5 },
                  py: { xs: 1.25, md: 1.5 },
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                  bgcolor: isActive ? SIDEBAR_ACTIVE_BG : 'transparent',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: { xs: '0.8125rem', md: '0.9375rem' },
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                  '&::before': isActive ? { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '0 4px 4px 0' } : {},
                  '&:hover': { bgcolor: isActive ? SIDEBAR_ACTIVE_BG : 'rgba(255,255,255,0.08)', color: '#ffffff' },
                  '&:focus-visible': { outline: '2px solid rgba(255,255,255,0.5)', outlineOffset: 2 },
                }}
              >
                <Icon sx={{ fontSize: { xs: 22, md: 24 }, color: 'inherit', opacity: isActive ? 1 : 0.85, flexShrink: 0 }} />
                <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 'inherit', color: 'inherit', whiteSpace: 'nowrap' }}>
                  {tab.label}
                </Typography>
              </Box>
            )
          })}
        </Box>

        {/* Main content area */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: 1000,
            mx: 'auto',
            width: '100%',
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
            overflowX: 'hidden',
          }}
        >
        {/* Page header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <IconButton
            onClick={handleBack}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              borderRadius: '7px',
              color: PAGE_PRIMARY,
              bgcolor: alpha(PAGE_PRIMARY, 0.08),
              '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.15) },
            }}
            aria-label="Back to dashboard"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {courseTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Work through exams one by one and track your performance.
            </Typography>
          </Box>
        </Box>

        {/* Total mock exam score */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.2),
            bgcolor: alpha(PAGE_PRIMARY, 0.04),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(getScoreColor(totalCoursePercentage), 0.15),
              }}
            >
              <MenuBookRoundedIcon sx={{ fontSize: 32, color: getScoreColor(totalCoursePercentage) }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
                Total mock exam score
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: getScoreColor(totalCoursePercentage),
                  fontSize: '1.75rem',
                }}
              >
                {totalCoursePercentage}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={totalCoursePercentage}
            sx={{
              width: { xs: '100%', sm: 200 },
              height: 10,
              borderRadius: '7px',
              bgcolor: alpha(theme.palette.grey[400], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: '7px',
                bgcolor: getScoreColor(totalCoursePercentage),
              },
            }}
          />
        </Paper>

        {/* Exams tabs and content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Exams
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
              First exam is active. Other exams will unlock later.
            </Typography>
            {renderLectureTabs()}
          </Box>
        </Box>
        </Box>
      </Box>
      <Footer />
    </>
  )
}

export default CoursePractice

