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
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'

const buildPracticeCourse = (courseId) => {
  const baseTitle = 'Practice course'
  const titleSuffix = courseId ? ` – Course #${courseId}` : ''

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
      title: `Lecture ${lectureNo}`,
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
  const courseTitle = courseFromState?.title || 'Course practice'

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
          const isUnlocked = index === 0 // first lecture active, others disabled for now

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
                  Lecture {lecture.lectureNo}
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
              Work through lectures one by one and track your performance.
            </Typography>
          </Box>
        </Box>

        {/* Total course score */}
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
                Total course score
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

        {/* Lectures tabs and content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Lectures
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
              First lecture is active. Other lectures will unlock later.
            </Typography>
            {renderLectureTabs()}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  )
}

export default CoursePractice

