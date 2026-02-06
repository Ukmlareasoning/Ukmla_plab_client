import { useMemo, useState } from 'react'
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
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

  const lectureNo = location.state?.lectureNo || 1
  const courseTitle = location.state?.courseTitle || 'Course practice'

  const questions = useMemo(() => buildLectureQuestions(lectureNo), [lectureNo])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [maxLockedIndex, setMaxLockedIndex] = useState(-1)
  const [viewMode, setViewMode] = useState('questions') // 'questions' | 'summary'
  const [percentage, setPercentage] = useState(0)

  const getScoreColor = (pct) =>
    pct >= 80 ? theme.palette.success.main : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

  const handleBack = () => {
    navigate('/user-dashboard/course-practice')
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
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
            }}
            aria-label="Back to lectures"
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
              Lecture {lectureNo} practice – questions appear one by one.
            </Typography>
          </Box>
        </Box>

        {/* Lecture score summary bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            bgcolor: alpha(theme.palette.primary.main, 0.04),
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
                borderRadius: 2,
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
                {viewMode === 'questions' ? 'Attempted questions' : 'Lecture score'}
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
              borderRadius: 1,
              bgcolor: alpha(theme.palette.grey[400], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
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
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.18),
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
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
              />
              <Chip
                label={`Question ${currentQuestionIndex + 1} / ${totalQuestions}`}
                size="small"
                sx={{
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
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectOption(opt.letter)}
                      disabled={isLocked}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        borderRadius: 2,
                        borderWidth: isSelected ? 2 : 1,
                        py: 1.5,
                        px: 1.5,
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.25,
                          bgcolor: isSelected ? theme.palette.common.white : alpha(theme.palette.grey[500], 0.12),
                          color: isSelected ? theme.palette.primary.main : 'text.secondary',
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
                      color={isSelected ? 'primary' : 'inherit'}
                      onClick={() => handleSelectOption(label)}
                      disabled={isLocked}
                      sx={{
                        minWidth: 120,
                        justifyContent: 'center',
                        textTransform: 'none',
                        borderRadius: 2,
                        borderWidth: isSelected ? 2 : 1,
                        py: 1.25,
                        px: 1.5,
                        fontWeight: 600,
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
                      borderRadius: 2,
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
                color="primary"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevQuestion}
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  justifyContent: 'flex-start',
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
                  color="primary"
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer || String(currentAnswer).trim() === ''}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    minWidth: isMobile ? 130 : 160,
                    px: isMobile ? 2 : 3,
                  }}
                  endIcon={<PlayArrowIcon sx={{ fontSize: 20 }} />}
                >
                  {currentQuestionIndex === totalQuestions - 1 ? 'Finish lecture' : 'Next question'}
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
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              bgcolor: alpha(theme.palette.primary.main, 0.03),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MenuBookRoundedIcon sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Lecture {lectureNo} performance
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
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.grey[400], 0.25),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
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
                You can repeat this lecture to strengthen weak areas, or go back to the lectures list and move to the
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
                  color="primary"
                  onClick={handleBack}
                  startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  Back to lectures
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<HistoryRoundedIcon sx={{ fontSize: 20 }} />}
                  onClick={() => navigate('/user-dashboard', { state: { tab: 'history' } })}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    width: isMobile ? '100%' : 'auto',
                  }}
                >
                  Details history
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
      <Footer />
    </>
  )
}

export default CoursePracticeDetails

