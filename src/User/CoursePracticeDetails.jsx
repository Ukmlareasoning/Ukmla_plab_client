import { useMemo, useState, useEffect } from 'react'
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
  TextField,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
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

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice (MCQ)',
  shortAnswer: 'Short Answer',
  descriptive: 'Descriptive / Long Answer',
  trueFalse: 'True / False',
  fillInBlanks: 'Fill in the Blanks',
}

const buildLectureQuestions = (lectureNo) => {
  // 5 sample questions covering all types (frontend only)
  return [
    {
      id: lectureNo * 10 + 1,
      questionType: 'mcq',
      text: 'A 45-year-old patient presents with sudden onset chest pain. What is the most appropriate initial investigation?',
      options: [
        { letter: 'A', text: 'ECG' },
        { letter: 'B', text: 'Chest X-ray' },
        { letter: 'C', text: 'CT pulmonary angiography' },
        { letter: 'D', text: 'Troponin only' },
      ],
    },
    {
      id: lectureNo * 10 + 2,
      questionType: 'shortAnswer',
      text: 'What are the four pillars of medical ethics?',
      placeholder: 'Type your short answer here...',
    },
    {
      id: lectureNo * 10 + 3,
      questionType: 'descriptive',
      text: 'Discuss the key steps you would take when obtaining informed consent for a procedure.',
      placeholder: 'Write a longer answer here...',
    },
    {
      id: lectureNo * 10 + 4,
      questionType: 'trueFalse',
      text: 'The GMC requires doctors to make the care of the patient their first concern.',
    },
    {
      id: lectureNo * 10 + 5,
      questionType: 'fillInBlanks',
      text: 'The GMC states that doctors must make the _____ of patients their first concern.',
      placeholder: 'Fill in the missing word...',
    },
  ]
}

function CoursePracticeDetails() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const lectureNo = location.state?.lectureNo || 1
  const courseTitle = location.state?.courseTitle || 'Mock exam practice'

  const questions = useMemo(() => buildLectureQuestions(lectureNo), [lectureNo])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [maxLockedIndex, setMaxLockedIndex] = useState(-1)
  const [viewMode, setViewMode] = useState('questions') // 'questions' | 'summary'
  const [percentage, setPercentage] = useState(0)

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

  const handleBack = () => {
    navigate('/user-dashboard/course-practice')
  }

  const activeTab = 'courses' // Mocks Exams active on this page
  const handleTabClick = (tabId) => {
    if (tabId === 'courses') return
    navigate('/user-dashboard', { state: { tab: tabId } })
  }

  const recalcScoreFromAttempts = (lockedIdx) => {
    // Frontend-only scoring: based on attempted/submitted questions.
    // A question is considered "attempted" when you click Next (it becomes locked).
    const attempted = Math.max(0, Math.min(questions.length, lockedIdx + 1))
    const pct = questions.length > 0 ? Math.round((attempted / questions.length) * 100) : 0
    setPercentage(pct)
  }

  const handleSelectOption = (letter) => {
    const qIndex = currentQuestionIndex

    // If this question is already locked, do not allow edits
    if (qIndex <= maxLockedIndex) return

    setAnswers((prev) => {
      const updated = [...prev]
      updated[qIndex] = letter
      return updated
    })
  }

  const handleTextAnswerChange = (value) => {
    const qIndex = currentQuestionIndex

    if (qIndex <= maxLockedIndex) return

    setAnswers((prev) => {
      const updated = [...prev]
      updated[qIndex] = value
      return updated
    })
  }

  const handleNextQuestion = () => {
    const qIndex = currentQuestionIndex

    if (!answers[qIndex]) return
    if (String(answers[qIndex]).trim() === '') return

    const nextLockedIndex = Math.max(maxLockedIndex, qIndex)
    setMaxLockedIndex(nextLockedIndex)
    recalcScoreFromAttempts(nextLockedIndex)

    if (qIndex < questions.length - 1) {
      setCurrentQuestionIndex(qIndex + 1)
    } else {
      setViewMode('summary')
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex === 0) return
    setCurrentQuestionIndex((prev) => prev - 1)
  }

  const question = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const currentAnswer = answers[currentQuestionIndex]
  const isLocked = currentQuestionIndex <= maxLockedIndex

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
        {/* Sidebar — same as CoursePractice, Mocks Exams active */}
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
            aria-label="Back to exams"
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
              Exam {lectureNo} practice – questions appear one by one.
            </Typography>
          </Box>
        </Box>

        {/* Exam score summary bar */}
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
                bgcolor: alpha(getScoreColor(percentage), 0.15),
              }}
            >
              <MenuBookRoundedIcon sx={{ fontSize: 32, color: getScoreColor(percentage) }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
                {viewMode === 'questions' ? 'Attempted questions' : 'Exam score'}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: getScoreColor(percentage),
                  fontSize: '1.75rem',
                }}
              >
                {percentage}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              width: { xs: '100%', sm: 200 },
              height: 10,
              borderRadius: '7px',
              bgcolor: alpha(theme.palette.grey[400], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: '7px',
                bgcolor: getScoreColor(percentage),
              },
            }}
          />
        </Paper>

        {viewMode === 'questions' && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.18),
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                icon={<QuizRoundedIcon />}
                label={QUESTION_TYPE_LABELS[question.questionType] || 'Question'}
                size="small"
                sx={{
                  borderRadius: '7px !important',
                  '&.MuiChip-root': { borderRadius: '7px' },
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  bgcolor: PAGE_PRIMARY,
                  color: '#fff',
                }}
              />
              <Chip
                label={`Question ${currentQuestionIndex + 1} / ${totalQuestions}`}
                size="small"
                sx={{
                  borderRadius: '7px !important',
                  '&.MuiChip-root': { borderRadius: '7px' },
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  color: 'text.secondary',
                }}
              />
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Attempted so far
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: getScoreColor(percentage) }}>
                  {percentage}%
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '1rem', sm: '1.05rem' },
                mb: 2,
                lineHeight: 1.7,
              }}
            >
              {question.text}
            </Typography>

            {/* Answer area varies by question type */}
            {question.questionType === 'mcq' && question.options && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.25,
                  mb: 3,
                }}
              >
                {question.options.map((opt) => {
                  const isSelected = currentAnswer === opt.letter
                  return (
                    <Button
                      key={opt.letter}
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => handleSelectOption(opt.letter)}
                      disabled={isLocked}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        borderRadius: '7px',
                        borderWidth: isSelected ? 2 : 1,
                        py: 1.5,
                        px: 1.5,
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        ...(isSelected ? { bgcolor: PAGE_PRIMARY, borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK, borderColor: PAGE_PRIMARY_DARK } } : {}),
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.25,
                          bgcolor: isSelected ? '#fff' : alpha(theme.palette.grey[500], 0.12),
                          color: isSelected ? PAGE_PRIMARY : 'text.secondary',
                          fontWeight: 700,
                        }}
                      >
                        {opt.letter}
                      </Box>
                      <Typography component="span" sx={{ textAlign: 'left' }}>
                        {opt.text}
                      </Typography>
                    </Button>
                  )
                })}
              </Box>
            )}

            {question.questionType === 'trueFalse' && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 3 }}>
                {['True', 'False'].map((label) => {
                  const isSelected = currentAnswer === label
                  return (
                    <Button
                      key={label}
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => handleSelectOption(label)}
                      disabled={isLocked}
                      sx={{
                        minWidth: 120,
                        justifyContent: 'center',
                        textTransform: 'none',
                        borderRadius: '7px',
                        borderWidth: isSelected ? 2 : 1,
                        py: 1.25,
                        px: 1.5,
                        fontWeight: 600,
                        ...(isSelected ? { bgcolor: PAGE_PRIMARY, borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK, borderColor: PAGE_PRIMARY_DARK } } : {}),
                      }}
                    >
                      {label}
                    </Button>
                  )
                })}
              </Box>
            )}

            {(question.questionType === 'shortAnswer' ||
              question.questionType === 'fillInBlanks' ||
              question.questionType === 'descriptive') && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline={question.questionType === 'descriptive'}
                  minRows={question.questionType === 'descriptive' ? 4 : 1}
                  placeholder={question.placeholder}
                  value={currentAnswer || ''}
                  onChange={(e) => handleTextAnswerChange(e.target.value)}
                  disabled={isLocked}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '7px',
                      bgcolor: alpha(theme.palette.background.paper, 1),
                    },
                  }}
                />
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'nowrap',
                gap: 1.25,
              }}
            >
              <Button
                variant="text"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevQuestion}
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '7px',
                  justifyContent: 'flex-start',
                  color: PAGE_PRIMARY,
                  '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                }}
              >
                {isMobile ? 'Previous' : 'Previous question'}
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: isMobile ? 'flex-end' : 'flex-start',
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer || String(currentAnswer).trim() === ''}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '7px',
                    minWidth: isMobile ? 130 : 160,
                    px: isMobile ? 2 : 3,
                    bgcolor: PAGE_PRIMARY,
                    '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                  }}
                  endIcon={<PlayArrowIcon sx={{ fontSize: 20 }} />}
                >
                  {currentQuestionIndex === totalQuestions - 1 ? 'Finish exam' : 'Next question'}
                </Button>
              </Box>
            </Box>
            {isLocked && (
              <Box
                sx={{
                  mt: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <LockIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Answer locked – you can review but not change it
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {viewMode === 'summary' && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.2),
              bgcolor: alpha(PAGE_PRIMARY, 0.03),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
                <MenuBookRoundedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Exam {lectureNo} performance
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Review your score and choose what to do next.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
                  Final score
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: getScoreColor(percentage),
                    lineHeight: 1,
                  }}
                >
                  {percentage}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 10,
                    borderRadius: '7px',
                    bgcolor: alpha(theme.palette.grey[400], 0.25),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: '7px',
                      bgcolor: getScoreColor(percentage),
                    },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
                You can repeat this exam to strengthen weak areas, or go back to the exams list and move to the
                next topic.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 1.5,
                  flexWrap: isMobile ? 'nowrap' : 'wrap',
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '7px',
                    width: isMobile ? '100%' : 'auto',
                    borderColor: PAGE_PRIMARY,
                    color: PAGE_PRIMARY,
                    '&:hover': { borderColor: PAGE_PRIMARY_DARK, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                  }}
                >
                  Back to exams
                </Button>
                <Button
                  variant="contained"
                  endIcon={<HistoryRoundedIcon sx={{ fontSize: 20 }} />}
                  onClick={() => navigate('/user-dashboard', { state: { tab: 'history' } })}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '7px',
                    width: isMobile ? '100%' : 'auto',
                    bgcolor: PAGE_PRIMARY,
                    '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                  }}
                >
                  Details history
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
        </Box>
      </Box>
      <Footer />
    </>
  )
}

export default CoursePracticeDetails

