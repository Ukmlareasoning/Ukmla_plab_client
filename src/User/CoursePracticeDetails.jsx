import { useMemo, useState, useEffect, useRef } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Rating,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import LockIcon from '@mui/icons-material/Lock'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import UserDashboardLayout from './UserDashboardLayout'

// AI Tutor explanation points — same as ScenarioPracticeDetails (replace with API later)
const AI_TUTOR_POINTS = [
  { title: 'Validate student effort', key: 'validate' },
  { title: 'Identify key clue student focused on', key: 'keyClue' },
  { title: 'Identify missing or misweighted clue', key: 'missingClue' },
  { title: 'Explain examiner logic', key: 'examinerLogic' },
  { title: 'Explain why each wrong option is wrong', key: 'wrongOptions' },
  { title: 'Highlight the common examiner trap', key: 'trap' },
  { title: 'Assign a pattern label', key: 'pattern' },
]

const AI_TUTOR_LOREM = {
  validate: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Your approach showed good clinical reasoning.',
  keyClue: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. You correctly focused on the presenting symptom and timeline, which often points to the diagnosis.',
  missingClue: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. A key clue that was underused here is the family history and risk factors mentioned in the stem.',
  examinerLogic: 'Excepteur sint occaecat cupidatat non proident. Examiners often test recognition of red flags and first-line investigations in this scenario type.',
  wrongOptions: 'Sunt in culpa qui officia deserunt mollit anim id est laborum. Option A is plausible but not first-line; B is for a different presentation; C over-investigates; D omits the essential step.',
  trap: 'Cillum dolore eu fugiat nulla pariatur. The common trap here is to jump to a rare diagnosis when the common one fits; the stem is written to support the typical presentation.',
  pattern: 'Pattern label: Acute presentation / First-line investigation. This question fits the “recognise and act” pattern commonly seen in UKMLA.',
}

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'
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
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [formStars, setFormStars] = useState(0)
  const [formComment, setFormComment] = useState('')

  // AI Tutor typing: per-question, per-point word count (word-by-word reveal)
  const [aiRevealedWords, setAiRevealedWords] = useState(() => ({}))
  const WORDS_PER_TICK = 1
  const TYPING_INTERVAL_MS = 65

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

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

    const wasAlreadyLocked = qIndex <= maxLockedIndex
    const nextLockedIndex = Math.max(maxLockedIndex, qIndex)
    setMaxLockedIndex(nextLockedIndex)
    recalcScoreFromAttempts(nextLockedIndex)

    // First click: lock answer and show AI Tutor explanation (stay on same question)
    if (!wasAlreadyLocked) return
    // Second click: move to next question or finish
    if (qIndex < questions.length - 1) {
      setCurrentQuestionIndex(qIndex + 1)
    } else {
      setRatingDialogOpen(true)
    }
  }

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false)
    setFormStars(0)
    setFormComment('')
    setViewMode('summary')
  }

  const handleSubmitRating = () => {
    setRatingDialogOpen(false)
    setFormStars(0)
    setFormComment('')
    setViewMode('summary')
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex === 0) return
    setCurrentQuestionIndex((prev) => prev - 1)
  }

  const question = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const currentAnswer = answers[currentQuestionIndex]
  const isLocked = currentQuestionIndex <= maxLockedIndex

  // Combined heading + body word count per point (heading types first, then body)
  const getPointWordCount = (point, idx) => {
    const headingText = `${idx + 1}. ${point.title}`
    const bodyText = AI_TUTOR_LOREM[point.key] || ''
    const combined = (headingText + ' ' + bodyText).trim().split(/\s+/).filter(Boolean)
    return combined.length
  }

  // Word-by-word typing effect for AI Tutor when answer is locked
  const typingDoneRef = useRef(false)
  useEffect(() => {
    if (!isLocked) return
    typingDoneRef.current = false
    const qIdx = currentQuestionIndex
    setAiRevealedWords((prev) => {
      if (Array.isArray(prev[qIdx])) return prev
      return { ...prev, [qIdx]: [0, 0, 0, 0, 0, 0, 0] }
    })
    const timer = setInterval(() => {
      if (typingDoneRef.current) return
      setAiRevealedWords((prev) => {
        const arr = prev[qIdx] ? [...prev[qIdx]] : [0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < AI_TUTOR_POINTS.length; i++) {
          const maxWords = getPointWordCount(AI_TUTOR_POINTS[i], i)
          if (arr[i] < maxWords) {
            arr[i] = Math.min(arr[i] + WORDS_PER_TICK, maxWords)
            return { ...prev, [qIdx]: arr }
          }
        }
        typingDoneRef.current = true
        return prev
      })
    }, TYPING_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [isLocked, currentQuestionIndex])

  return (
    <UserDashboardLayout>
      <Box
        sx={{
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

            {/* AI Tutor explanation — shown after answer is submitted (same as ScenarioPracticeDetails) */}
            {isLocked && (
              <Box
                sx={{
                  mt: 3,
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.2),
                  bgcolor: alpha(PAGE_PRIMARY, 0.04),
                  '&::before': {
                    content: '""',
                    display: 'block',
                    height: 3,
                    width: 48,
                    borderRadius: 2,
                    bgcolor: PAGE_PRIMARY,
                    mb: 1.5,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(PAGE_PRIMARY, 0.12),
                      color: PAGE_PRIMARY,
                    }}
                  >
                    <SmartToyRoundedIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      AI Tutor
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Guidance for this question
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {AI_TUTOR_POINTS.map((point, idx) => {
                    const headingText = `${idx + 1}. ${point.title}`
                    const bodyText = AI_TUTOR_LOREM[point.key] || ''
                    const headingWords = headingText.trim().split(/\s+/).filter(Boolean)
                    const bodyWords = bodyText.trim().split(/\s+/).filter(Boolean)
                    const combinedWords = [...headingWords, ...bodyWords]
                    const headingWordCount = headingWords.length
                    const revealed = aiRevealedWords[currentQuestionIndex]?.[idx] ?? 0
                    const visibleWords = combinedWords.slice(0, revealed)
                    const headingVisible = visibleWords.slice(0, headingWordCount)
                    const bodyVisible = visibleWords.slice(headingWordCount)
                    const isStillTyping = revealed < combinedWords.length
                    return (
                      <Box
                        key={point.key}
                        sx={{
                          pl: { xs: 1.5, sm: 2 },
                          borderLeft: '3px solid',
                          borderColor: alpha(PAGE_PRIMARY, 0.35),
                          py: 0.5,
                        }}
                      >
                        {headingVisible.length > 0 && (
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: PAGE_PRIMARY, mb: bodyVisible.length ? 0.5 : 0, fontSize: '0.8125rem', lineHeight: 1.65 }}>
                            {headingVisible.join(' ')}
                            {isStillTyping && bodyVisible.length === 0 && (
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: 2,
                                  height: '1em',
                                  bgcolor: PAGE_PRIMARY,
                                  ml: 0.25,
                                  verticalAlign: 'text-bottom',
                                  animation: 'blink 1s step-end infinite',
                                  '@keyframes blink': { '50%': { opacity: 0 } },
                                }}
                              />
                            )}
                          </Typography>
                        )}
                        {bodyVisible.length > 0 && (
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                            {bodyVisible.join(' ')}
                            {isStillTyping && (
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: 2,
                                  height: '1em',
                                  bgcolor: PAGE_PRIMARY,
                                  ml: 0.25,
                                  verticalAlign: 'text-bottom',
                                  animation: 'blink 1s step-end infinite',
                                  '@keyframes blink': { '50%': { opacity: 0 } },
                                }}
                              />
                            )}
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Box>
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
                  onClick={() => navigate('/user-dashboard/history')}
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

      {/* Rating dialog — shown when user clicks Finish exam on last question */}
      <Dialog
        open={ratingDialogOpen}
        onClose={handleCloseRatingDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' },
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
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(PAGE_PRIMARY, 0.08)}`
              : `0 24px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px ${alpha(PAGE_PRIMARY, 0.06)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`,
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
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 3 },
            pb: 2,
            px: { xs: 2.5, sm: 3.5 },
            borderBottom: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.1),
            bgcolor: alpha(PAGE_PRIMARY, 0.02),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(PAGE_PRIMARY, 0.12),
                color: PAGE_PRIMARY,
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Rate this mock exam
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                {courseTitle} – Exam {lectureNo}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: { xs: 2.5, sm: 3.5 } }}>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmitRating() }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              Your rating (stars)
            </Typography>
            <Rating
              name="exam-rating"
              value={formStars}
              onChange={(_, v) => setFormStars(v ?? 0)}
              size="large"
              icon={<StarRoundedIcon sx={{ fontSize: 36 }} />}
              emptyIcon={<StarBorderRoundedIcon sx={{ fontSize: 36 }} />}
              sx={{ mb: 2, '& .MuiRating-iconFilled': { color: PAGE_PRIMARY }, '& .MuiRating-iconHover': { color: PAGE_PRIMARY_LIGHT } }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              Comment (optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your experience with this mock exam..."
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7px',
                  bgcolor: theme.palette.background.paper,
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(PAGE_PRIMARY, 0.5) },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PAGE_PRIMARY, borderWidth: 2 },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            pb: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: 2 },
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.grey[300], 0.5),
            bgcolor: theme.palette.grey[50],
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmitRating}
            sx={{
              bgcolor: PAGE_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              textTransform: 'none',
              px: 2,
              '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
            }}
          >
            Submit rating
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={handleCloseRatingDialog}
            startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '7px',
              px: 2,
              '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.06), color: PAGE_PRIMARY },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </UserDashboardLayout>
  )
}

export default CoursePracticeDetails

