import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Rating,
  TextField,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import UserDashboardLayout from './UserDashboardLayout'

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

// Mock: course details with lectures and questions (attempt history with date, right/wrong)
const getCourseDetailsByCourseId = (courseId) => {
  const baseLectures = [
    {
      id: 1,
      lectureNo: 1,
      questions: [
        {
          id: 1,
          questionType: 'mcq',
          question: 'A 45-year-old patient presents with chest pain. Which of the following is the most appropriate initial investigation?',
          answer: 'A) ECG',
          answerDescription: 'ECG is the first-line investigation for acute chest pain to rule out STEMI.',
          attemptedDate: '2025-02-01 14:32',
          isCorrect: true,
          options: [
            { letter: 'A', text: 'ECG', correct: true },
            { letter: 'B', text: 'Chest X-ray', correct: false },
            { letter: 'C', text: 'Troponin only', correct: false },
            { letter: 'D', text: 'CT coronary angiography', correct: false },
          ],
        },
        {
          id: 2,
          questionType: 'mcq',
          question: 'A 60-year-old with elevated TSH. What is the most appropriate next step?',
          answer: 'B) Check serum free T4',
          answerDescription: 'Free T4 confirms hypothyroidism and helps distinguish primary from secondary causes.',
          attemptedDate: '2025-02-01 14:38',
          isCorrect: true,
          options: [
            { letter: 'A', text: 'Start levothyroxine immediately', correct: false },
            { letter: 'B', text: 'Check serum free T4 (and consider T3 if indicated)', correct: true },
            { letter: 'C', text: 'Order thyroid antibodies only', correct: false },
            { letter: 'D', text: 'MRI pituitary', correct: false },
          ],
        },
        {
          id: 3,
          questionType: 'shortAnswer',
          question: 'What are the four pillars of medical ethics?',
          answer: 'Autonomy, Beneficence, Non-maleficence, Justice.',
          answerDescription: 'These four principles form the foundation of ethical decision-making.',
          attemptedDate: '2025-02-01 14:42',
          isCorrect: true,
        },
        {
          id: 4,
          questionType: 'shortAnswer',
          question: 'Name the first-line investigation for suspected pulmonary embolism.',
          answer: 'CT pulmonary angiography (CTPA).',
          answerDescription: 'CTPA is the preferred imaging modality for PE.',
          attemptedDate: '2025-02-01 14:45',
          isCorrect: false,
        },
        {
          id: 5,
          questionType: 'descriptive',
          question: 'Discuss the role of human factors in medication errors.',
          answer: 'Human factors include fatigue, workload, communication gaps. Strategies: checklists, barcode scanning, double-checking.',
          answerDescription: 'A descriptive answer covering systems approach.',
          attemptedDate: '2025-02-01 14:52',
          isCorrect: true,
        },
      ],
    },
    {
      id: 2,
      lectureNo: 2,
      questions: [
        {
          id: 6,
          questionType: 'trueFalse',
          question: 'In the UK, consent for treatment from a competent adult must always be in writing.',
          answer: 'False',
          answerDescription: 'Valid consent can be verbal or written.',
          attemptedDate: '2025-02-03 09:15',
          isCorrect: true,
        },
        {
          id: 7,
          questionType: 'trueFalse',
          question: 'The GMC requires doctors to make the care of the patient their first concern.',
          answer: 'True',
          answerDescription: 'Good Medical Practice explicitly states this.',
          attemptedDate: '2025-02-03 09:18',
          isCorrect: true,
        },
        {
          id: 8,
          questionType: 'fillInBlanks',
          question: 'The GMC states that doctors must make the _____ of patients their first concern.',
          answer: 'care',
          answerDescription: 'Good Medical Practice (GMC) explicitly states this.',
          attemptedDate: '2025-02-03 09:22',
          isCorrect: true,
        },
        {
          id: 9,
          questionType: 'fillInBlanks',
          question: 'In hypothyroidism, TSH is typically _____ while free T4 is _____.',
          answer: 'elevated, low',
          answerDescription: 'Primary hypothyroidism shows raised TSH and low free T4.',
          attemptedDate: '2025-02-03 09:25',
          isCorrect: false,
        },
        {
          id: 10,
          questionType: 'descriptive',
          question: 'Outline the steps you would take when obtaining informed consent for a procedure.',
          answer: 'Explain the procedure, benefits, risks, alternatives; check capacity; ensure voluntary decision; document.',
          answerDescription: 'Consent must be informed, voluntary, and from a person with capacity.',
          attemptedDate: '2025-02-03 09:35',
          isCorrect: true,
        },
      ],
    },
  ]

  baseLectures.forEach((lec) => {
    const correct = lec.questions.filter((q) => q.isCorrect).length
    lec.percentage = Math.round((correct / lec.questions.length) * 100)
  })

  const totalCorrect = baseLectures.reduce((sum, lec) => sum + lec.questions.filter((q) => q.isCorrect).length, 0)
  const totalQuestions = baseLectures.reduce((sum, lec) => sum + lec.questions.length, 0)
  const coursePercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  return {
    courseTitle: 'Course Title',
    lectures: baseLectures,
    coursePercentage,
  }
}

function UserCourseDetails() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const course = location.state?.course || null
  const courseId = course?.id ?? location.state?.courseId
  const courseTitle = course?.title || location.state?.courseTitle || 'Course Details'

  const details = getCourseDetailsByCourseId(courseId)
  const lectures = details.lectures
  const coursePercentage = details.coursePercentage

  const [expanded, setExpanded] = useState(null)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [ratingDialogMode, setRatingDialogMode] = useState('rate')
  const [selectedExam, setSelectedExam] = useState(null) // { lectureId, lectureNo, courseTitle }
  const [formStars, setFormStars] = useState(0)
  const [formComment, setFormComment] = useState('')
  const initialStaticRatings = useMemo(() => {
    const obj = {}
    const exam2 = lectures.find((lec) => lec.lectureNo === 2)
    if (exam2) {
      obj[`${courseId}-${exam2.id}`] = {
        stars: 4,
        comment: 'Very helpful for exam preparation. Clear structure and good question mix.',
      }
    }
    return obj
  }, [courseId, lectures])
  const [savedRatings, setSavedRatings] = useState(initialStaticRatings)

  const handleBack = () => {
    navigate('/user-dashboard/history')
  }

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : null)
  }

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

  const ratingKey = (lecture) => `${courseId}-${lecture.id}`
  const getRatingForExam = (key) => savedRatings[key] ?? null

  const handleOpenRateThis = (lecture, e) => {
    e.stopPropagation()
    setSelectedExam({ lectureId: lecture.id, lectureNo: lecture.lectureNo, courseTitle })
    setRatingDialogMode('rate')
    const existing = savedRatings[ratingKey(lecture)]
    setFormStars(existing?.stars ?? 0)
    setFormComment(existing?.comment ?? '')
    setRatingDialogOpen(true)
  }

  const handleOpenViewRate = (lecture, e) => {
    e.stopPropagation()
    setSelectedExam({ lectureId: lecture.id, lectureNo: lecture.lectureNo, courseTitle })
    setRatingDialogMode('view')
    setRatingDialogOpen(true)
  }

  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false)
    setSelectedExam(null)
    setFormStars(0)
    setFormComment('')
  }

  const handleSubmitRating = () => {
    if (!selectedExam) return
    const key = `${courseId}-${selectedExam.lectureId}`
    setSavedRatings((prev) => ({
      ...prev,
      [key]: { stars: formStars, comment: formComment.trim() },
    }))
    handleCloseRatingDialog()
  }

  const buttonSx = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.75rem',
    borderRadius: '7px',
    py: 0.5,
    px: 1.25,
    borderColor: alpha(PAGE_PRIMARY, 0.5),
    color: PAGE_PRIMARY,
    whiteSpace: 'nowrap',
    '&:hover': { borderColor: PAGE_PRIMARY, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
  }

  return (
    <UserDashboardLayout>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          overflowX: 'hidden',
          maxWidth: 1000,
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* Page header with back button */}
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
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {courseTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              View mocks exams, questions, and your scores
            </Typography>
          </Box>
        </Box>

        {/* Total course percentage card */}
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
                bgcolor: alpha(getScoreColor(coursePercentage), 0.15),
              }}
            >
              <MenuBookRoundedIcon sx={{ fontSize: 32, color: getScoreColor(coursePercentage) }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
                Total course score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: getScoreColor(coursePercentage), fontSize: '1.75rem' }}>
                {coursePercentage}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={coursePercentage}
            sx={{
              width: { xs: '100%', sm: 200 },
              height: 10,
              borderRadius: '7px',
              bgcolor: alpha(theme.palette.grey[400], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: '7px',
                bgcolor: getScoreColor(coursePercentage),
              },
            }}
          />
        </Paper>

        {/* Lectures list */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
          Lectures
        </Typography>
        {lectures.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {lectures.map((lecture) => (
              <Accordion
                key={lecture.id}
                expanded={expanded === lecture.id}
                onChange={handleAccordionChange(lecture.id)}
                elevation={0}
                sx={{
                  borderRadius: '7px',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.15),
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: 0 },
                }}
              >
<AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: alpha(PAGE_PRIMARY, 0.04),
                    '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 },
                  }}
                >
                  <QuizRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 24 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Exam {lecture.lectureNo}
                  </Typography>
                  <Chip
                    label={`${lecture.questions.length} questions`}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: '0.75rem', bgcolor: alpha(PAGE_PRIMARY, 0.1), color: PAGE_PRIMARY_DARK, borderRadius: '7px !important', '&.MuiChip-root': { borderRadius: '7px' } }}
                  />
                  <Chip
                    label={`${lecture.percentage}%`}
                    size="small"
                    sx={{
                      borderRadius: '7px !important',
                      '&.MuiChip-root': { borderRadius: '7px' },
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      bgcolor: alpha(getScoreColor(lecture.percentage), 0.15),
                      color: getScoreColor(lecture.percentage),
                    }}
                  />
                  {lecture.percentage >= 80 && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                      {lecture.lectureNo === 1 && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<RateReviewOutlinedIcon sx={{ fontSize: 18 }} />}
                          onClick={(e) => handleOpenRateThis(lecture, e)}
                          sx={buttonSx}
                        >
                          Rate this
                        </Button>
                      )}
                      {lecture.lectureNo === 2 && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                          onClick={(e) => handleOpenViewRate(lecture, e)}
                          sx={buttonSx}
                        >
                          View rate
                        </Button>
                      )}
                    </Box>
                  )}
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List disablePadding>
                    {lecture.questions.map((q, index) => (
                      <ListItem
                        key={q.id}
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          py: 2,
                          px: 2.5,
                          borderBottom: index < lecture.questions.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          bgcolor: q.isCorrect ? alpha(PAGE_PRIMARY, 0.03) : alpha(theme.palette.error.main, 0.03),
                        }}
                      >
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Chip
                            label={QUESTION_TYPE_LABELS[q.questionType]}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: PAGE_PRIMARY, color: '#fff', height: 24, borderRadius: '7px !important', '&.MuiChip-root': { borderRadius: '7px' } }}
                          />
                          <Chip
                            label={`Q${index + 1}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.7rem', borderColor: 'divider', color: 'text.secondary', height: 24, borderRadius: '7px !important', '&.MuiChip-root': { borderRadius: '7px' } }}
                          />
                          <Chip
                            icon={q.isCorrect ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
                            label={q.isCorrect ? 'Correct' : 'Wrong'}
                            size="small"
                            color={q.isCorrect ? undefined : 'error'}
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 24,
                              borderRadius: '7px !important',
                              '&.MuiChip-root': { borderRadius: '7px' },
                              ...(q.isCorrect ? { bgcolor: PAGE_PRIMARY, color: '#fff', '& .MuiChip-icon': { color: '#fff' } } : {}),
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 'auto' }}>
                            {q.attemptedDate}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '1rem',
                            lineHeight: 1.7,
                            mb: 1.5,
                          }}
                        >
                          {q.question}
                        </Typography>
                        {/* MCQ options — all options with correct highlighted */}
                        {q.questionType === 'mcq' && q.options && (
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                              gap: 1.25,
                              mb: 1.5,
                            }}
                          >
                            {q.options.map((opt) => {
                              const showCorrect = opt.correct
                              return (
                                <Box
                                  key={opt.letter}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.25,
                                    p: { xs: 1.25, sm: 1.5 },
                                    borderRadius: '7px',
                                    border: '2px solid',
                                    borderColor: showCorrect ? PAGE_PRIMARY : 'divider',
                                    bgcolor: showCorrect ? alpha(PAGE_PRIMARY, 0.08) : 'transparent',
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
                                      flexShrink: 0,
                                      fontWeight: 700,
                                      fontSize: '0.8125rem',
                                      bgcolor: showCorrect ? PAGE_PRIMARY : 'action.hover',
                                      color: showCorrect ? '#fff' : 'text.secondary',
                                    }}
                                  >
                                    {opt.letter}
                                  </Box>
                                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: showCorrect ? 600 : 500, lineHeight: 1.5, pt: 0.25 }}>
                                    {opt.text}
                                  </Typography>
                                  {showCorrect && (
                                    <CheckCircleIcon sx={{ color: PAGE_PRIMARY, fontSize: 20, ml: 'auto', flexShrink: 0, mt: 0.25 }} />
                                  )}
                                </Box>
                              )
                            })}
                          </Box>
                        )}
                        {/* True/False options — both with correct highlighted */}
                        {q.questionType === 'trueFalse' && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 1.5 }}>
                            {['True', 'False'].map((opt) => {
                              const isCorrect = q.answer && q.answer.toLowerCase() === opt.toLowerCase()
                              return (
                                <Box
                                  key={opt}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.25,
                                    p: { xs: 1.25, sm: 1.5 },
                                    borderRadius: '7px',
                                    border: '2px solid',
                                    borderColor: isCorrect ? PAGE_PRIMARY : 'divider',
                                    bgcolor: isCorrect ? alpha(PAGE_PRIMARY, 0.08) : 'transparent',
                                    minWidth: 110,
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
                                      fontWeight: 700,
                                      fontSize: '0.8125rem',
                                      bgcolor: isCorrect ? PAGE_PRIMARY : 'action.hover',
                                      color: isCorrect ? '#fff' : 'text.secondary',
                                    }}
                                  >
                                    {opt.charAt(0)}
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: isCorrect ? 600 : 500 }}>
                                    {opt}
                                  </Typography>
                                  {isCorrect && <CheckCircleIcon sx={{ color: PAGE_PRIMARY, fontSize: 20 }} />}
                                </Box>
                              )
                            })}
                          </Box>
                        )}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: '7px',
                            border: '1px solid',
                            borderColor: alpha(PAGE_PRIMARY, 0.4),
                            bgcolor: alpha(PAGE_PRIMARY, 0.06),
                            borderLeft: '4px solid',
                            borderLeftColor: PAGE_PRIMARY,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Correct answer
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.6, mt: 0.5 }}>
                            {q.answer}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.6 }}>
                            {q.answerDescription}
                          </Typography>
                        </Paper>
                      </ListItem>
                    ))}
                  </List>
                  {/* Lecture percentage at end */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: '2px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.15),
                      bgcolor: alpha(PAGE_PRIMARY, 0.04),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Lecture {lecture.lectureNo} score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={lecture.percentage}
                        sx={{
                          width: 120,
                          height: 8,
                          borderRadius: '7px',
                          bgcolor: alpha(theme.palette.grey[400], 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: '7px',
                            bgcolor: getScoreColor(lecture.percentage),
                          },
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: getScoreColor(lecture.percentage), minWidth: 40 }}>
                        {lecture.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(PAGE_PRIMARY, 0.12),
              bgcolor: theme.palette.background.paper,
            }}
          >
            <QuizRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              No lectures or attempt history available for this course.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Rating dialog — Rate this (form) or View rate (display) */}
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
                {ratingDialogMode === 'rate' ? 'Rate this mock exam' : 'Your rating'}
              </Typography>
              {selectedExam && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                  {selectedExam.courseTitle} – Exam {selectedExam.lectureNo}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: { xs: 2.5, sm: 3.5 } }}>
          {ratingDialogMode === 'rate' ? (
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmitRating() }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Your rating (stars)
              </Typography>
              <Rating
                name="mock-rating"
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
          ) : (
            <Box>
              {selectedExam && getRatingForExam(`${courseId}-${selectedExam.lectureId}`) ? (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    Stars
                  </Typography>
                  <Rating
                    name="view-rating"
                    value={getRatingForExam(`${courseId}-${selectedExam.lectureId}`).stars}
                    readOnly
                    size="large"
                    icon={<StarRoundedIcon sx={{ fontSize: 36 }} />}
                    emptyIcon={<StarBorderRoundedIcon sx={{ fontSize: 36 }} />}
                    sx={{ mb: 2, '& .MuiRating-iconFilled': { color: PAGE_PRIMARY } }}
                  />
                  {getRatingForExam(`${courseId}-${selectedExam.lectureId}`).comment && (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                        Your comment
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {getRatingForExam(`${courseId}-${selectedExam.lectureId}`).comment}
                      </Typography>
                    </>
                  )}
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  You haven&apos;t rated this mock exam yet. Use &quot;Rate this&quot; to add your rating and comment.
                </Typography>
              )}
            </Box>
          )}
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
          {ratingDialogMode === 'rate' && (
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
          )}
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

export default UserCourseDetails
