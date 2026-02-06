import { useState } from 'react'
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
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

  const course = location.state?.course || null
  const courseId = course?.id ?? location.state?.courseId
  const courseTitle = course?.title || location.state?.courseTitle || 'Course Details'

  const details = getCourseDetailsByCourseId(courseId)
  const lectures = details.lectures
  const coursePercentage = details.coursePercentage

  const [expanded, setExpanded] = useState(null)

  const handleBack = () => {
    navigate('/user-dashboard', { state: { tab: 'history' } })
  }

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : null)
  }

  const getScoreColor = (pct) =>
    pct >= 80 ? theme.palette.success.main : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

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
        {/* Page header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <IconButton
            onClick={handleBack}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
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
              View lectures, questions, and your scores
            </Typography>
          </Box>
        </Box>

        {/* Total course percentage card */}
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
              borderRadius: 1,
              bgcolor: alpha(theme.palette.grey[400], 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
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
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: 0 },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 },
                }}
                >
                  <QuizRoundedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Lecture {lecture.lectureNo}
                  </Typography>
                  <Chip
                    label={`${lecture.questions.length} questions`}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: '0.75rem', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.dark' }}
                  />
                  <Chip
                    label={`${lecture.percentage}%`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      bgcolor: alpha(getScoreColor(lecture.percentage), 0.15),
                      color: getScoreColor(lecture.percentage),
                      ml: 'auto',
                    }}
                  />
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
                          bgcolor: q.isCorrect ? alpha(theme.palette.success.main, 0.03) : alpha(theme.palette.error.main, 0.03),
                        }}
                      >
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Chip
                            label={QUESTION_TYPE_LABELS[q.questionType]}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: theme.palette.primary.main, color: 'primary.contrastText', height: 24 }}
                          />
                          <Chip
                            label={`Q${index + 1}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.7rem', borderColor: 'divider', color: 'text.secondary', height: 24 }}
                          />
                          <Chip
                            icon={q.isCorrect ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
                            label={q.isCorrect ? 'Correct' : 'Wrong'}
                            size="small"
                            color={q.isCorrect ? 'success' : 'error'}
                            sx={{ fontWeight: 700, fontSize: '0.7rem', height: 24 }}
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
                                    borderRadius: 1.5,
                                    border: '2px solid',
                                    borderColor: showCorrect ? 'success.main' : 'divider',
                                    bgcolor: showCorrect ? alpha(theme.palette.success.main, 0.08) : 'transparent',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 1.25,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                      fontWeight: 700,
                                      fontSize: '0.8125rem',
                                      bgcolor: showCorrect ? 'success.main' : 'action.hover',
                                      color: showCorrect ? 'success.contrastText' : 'text.secondary',
                                    }}
                                  >
                                    {opt.letter}
                                  </Box>
                                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: showCorrect ? 600 : 500, lineHeight: 1.5, pt: 0.25 }}>
                                    {opt.text}
                                  </Typography>
                                  {showCorrect && (
                                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20, ml: 'auto', flexShrink: 0, mt: 0.25 }} />
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
                                    borderRadius: 1.5,
                                    border: '2px solid',
                                    borderColor: isCorrect ? 'success.main' : 'divider',
                                    bgcolor: isCorrect ? alpha(theme.palette.success.main, 0.08) : 'transparent',
                                    minWidth: 110,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 1.25,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 700,
                                      fontSize: '0.8125rem',
                                      bgcolor: isCorrect ? 'success.main' : 'action.hover',
                                      color: isCorrect ? 'success.contrastText' : 'text.secondary',
                                    }}
                                  >
                                    {opt.charAt(0)}
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: isCorrect ? 600 : 500 }}>
                                    {opt}
                                  </Typography>
                                  {isCorrect && <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />}
                                </Box>
                              )
                            })}
                          </Box>
                        )}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.4),
                            bgcolor: alpha(theme.palette.success.main, 0.06),
                            borderLeft: '4px solid',
                            borderLeftColor: 'success.main',
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
                      borderColor: alpha(theme.palette.primary.main, 0.15),
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
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
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.grey[400], 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
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
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.12),
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
      <Footer />
    </>
  )
}

export default UserCourseDetails
