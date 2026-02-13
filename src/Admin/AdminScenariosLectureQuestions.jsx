import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Admin primary (#384D84 — no green)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

const QUESTION_TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
  { value: 'shortAnswer', label: 'Short Answer' },
  { value: 'descriptive', label: 'Descriptive / Long Answer' },
  { value: 'trueFalse', label: 'True / False' },
  { value: 'fillInBlanks', label: 'Fill in the Blanks' },
]

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice (MCQ)',
  shortAnswer: 'Short Answer',
  descriptive: 'Descriptive / Long Answer',
  trueFalse: 'True / False',
  fillInBlanks: 'Fill in the Blanks',
}

// 10 questions: 2 per type (dummy data)
const LECTURE_QUESTIONS = [
  {
    id: 1,
    questionType: 'mcq',
    question: 'A 45-year-old patient presents with chest pain. Which of the following is the most appropriate initial investigation?',
    answer: 'A) ECG',
    answerDescription: 'ECG is the first-line investigation for acute chest pain to rule out STEMI and other acute coronary syndromes.',
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
    answerDescription: 'These four principles form the foundation of ethical decision-making in clinical practice.',
  },
  {
    id: 4,
    questionType: 'shortAnswer',
    question: 'Name the first-line investigation for suspected pulmonary embolism.',
    answer: 'CT pulmonary angiography (CTPA).',
    answerDescription: 'CTPA is the preferred imaging modality for PE when clinically suspected and D-dimer is positive.',
  },
  {
    id: 5,
    questionType: 'descriptive',
    question: 'Discuss the role of human factors in medication errors and suggest strategies to reduce them in a hospital setting.',
    answer: 'Human factors include fatigue, workload, communication gaps, and design of systems. Strategies: checklists, barcode scanning, double-checking high-risk drugs, incident reporting, and team training.',
    answerDescription: 'A descriptive answer covering systems approach and practical interventions aligned with NHS patient safety initiatives.',
  },
  {
    id: 6,
    questionType: 'descriptive',
    question: 'Outline the steps you would take when obtaining informed consent for a procedure.',
    answer: 'Explain the procedure, benefits, risks, alternatives; check capacity; ensure voluntary decision; document discussion and consent.',
    answerDescription: 'Consent must be informed, voluntary, and from a person with capacity; documentation is essential.',
  },
  {
    id: 7,
    questionType: 'trueFalse',
    question: 'In the UK, consent for treatment from a competent adult must always be in writing.',
    answer: 'False',
    answerDescription: 'Valid consent can be verbal or written; it must be informed and voluntary. Written consent is required for certain procedures but not all treatment.',
  },
  {
    id: 8,
    questionType: 'trueFalse',
    question: 'The GMC requires doctors to make the care of the patient their first concern.',
    answer: 'True',
    answerDescription: 'Good Medical Practice explicitly states that care of the patient must be the doctor\'s first concern.',
  },
  {
    id: 9,
    questionType: 'fillInBlanks',
    question: 'The GMC states that doctors must make the _____ of patients their first concern.',
    answer: 'care',
    answerDescription: 'Good Medical Practice (GMC) explicitly states that care of the patient must be the doctor\'s first concern.',
  },
  {
    id: 10,
    questionType: 'fillInBlanks',
    question: 'In hypothyroidism, TSH is typically _____ while free T4 is _____.',
    answer: 'elevated, low',
    answerDescription: 'Primary hypothyroidism shows raised TSH and low free T4; the pituitary responds by increasing TSH.',
  },
]

const selectSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.5) },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: ADMIN_PRIMARY },
  },
  '& .MuiInputLabel-outlined': { fontWeight: 600, '&.Mui-focused': { color: ADMIN_PRIMARY } },
})

function AdminScenariosLectureQuestions() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const courseTitle = location.state?.courseTitle || 'Scenario'
  const lectureNo = location.state?.lectureNo ?? 1
  const lectureId = location.state?.lectureId

  const [questionTypeFilter, setQuestionTypeFilter] = useState('')
  const [showAnswer, setShowAnswer] = useState(true)

  const filtered = LECTURE_QUESTIONS.filter((q) => !questionTypeFilter || q.questionType === questionTypeFilter)

  const handleBack = () => {
    navigate('/admin/scenarios/lectures', { state: { courseTitle } })
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 1000,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          mb: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <IconButton
          onClick={handleBack}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) },
          }}
          aria-label="Back to scenario exams"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Scenario Exam {lectureNo} – Questions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {courseTitle}
          </Typography>
        </Box>
      </Box>

      {/* Filters: Question type + Show/Hide Answer */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
          }}
        >
          <FormControl
            size="small"
            sx={{
              ...selectSx(),
              minWidth: { xs: '100%', sm: 220 },
              width: { xs: '100%', sm: 'auto' },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
            }}
          >
            <InputLabel id="question-type-filter-label">Question type</InputLabel>
            <Select
              labelId="question-type-filter-label"
              value={questionTypeFilter}
              label="Question type"
              onChange={(e) => setQuestionTypeFilter(e.target.value)}
            >
              {QUESTION_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>
              Answer:
            </Typography>
            <ToggleButtonGroup
              value={showAnswer}
              exclusive
              onChange={(_, value) => value != null && setShowAnswer(value)}
              size="small"
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
                width: { xs: '100%', sm: 'auto' },
                '& .MuiToggleButton-root': {
                  flex: { xs: 1, sm: '0 0 auto' },
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '7px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  borderColor: theme.palette.grey[300],
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                    color: ADMIN_PRIMARY,
                    borderColor: ADMIN_PRIMARY,
                    '&:hover': {
                      bgcolor: alpha(ADMIN_PRIMARY, 0.18),
                    },
                  },
                },
              }}
            >
              <ToggleButton value={true}>
                <VisibilityRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Show
              </ToggleButton>
              <ToggleButton value={false}>
                <VisibilityOffRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Hide
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Paper>

      {/* Question cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filtered.map((q, index) => (
          <Paper
            key={q.id}
            elevation={0}
            sx={{
              borderRadius: '7px',
              border: '1px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.12),
              bgcolor: theme.palette.background.paper,
              overflow: 'hidden',
              boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`,
            }}
          >
            {/* Question header */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: `linear-gradient(135deg, ${alpha(ADMIN_PRIMARY, 0.06)} 0%, ${alpha(ADMIN_PRIMARY, 0.02)} 100%)`,
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Chip
                  label={QUESTION_TYPE_LABELS[q.questionType]}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.04em',
                    borderRadius: '7px',
                    bgcolor: ADMIN_PRIMARY,
                    color: '#fff',
                    height: 28,
                  }}
                />
                <Chip
                  label={`Question ${index + 1}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: '7px', borderColor: 'divider', color: 'text.secondary' }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.05rem' },
                  lineHeight: 1.7,
                }}
              >
                {q.question}
              </Typography>
            </Box>

            {/* MCQ options — when Hide answer, no correct highlight */}
            {q.questionType === 'mcq' && q.options && (
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                {q.options.map((opt) => {
                  const showCorrect = showAnswer && opt.correct
                  return (
                    <Box
                      key={opt.letter}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: '7px',
                        border: '2px solid',
                        borderColor: showCorrect ? ADMIN_PRIMARY : 'divider',
                        bgcolor: showCorrect ? alpha(ADMIN_PRIMARY, 0.08) : 'transparent',
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          bgcolor: showCorrect ? ADMIN_PRIMARY : 'action.hover',
                          color: showCorrect ? '#fff' : 'text.secondary',
                        }}
                      >
                        {opt.letter}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: showCorrect ? 600 : 500, lineHeight: 1.5, pt: 0.5 }}>
                        {opt.text}
                      </Typography>
                      {showCorrect && (
                        <CheckCircleIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22, ml: 'auto', flexShrink: 0, mt: 0.25 }} />
                      )}
                    </Box>
                  )
                })}
              </Box>
            )}

            {/* True/False options — when Hide answer, no correct highlight */}
            {q.questionType === 'trueFalse' && (
              <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {['True', 'False'].map((opt) => {
                  const isCorrect = showAnswer && q.answer && q.answer.toLowerCase() === opt.toLowerCase()
                  return (
                    <Box
                      key={opt}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: '7px',
                        border: '2px solid',
                        borderColor: isCorrect ? ADMIN_PRIMARY : 'divider',
                        bgcolor: isCorrect ? alpha(ADMIN_PRIMARY, 0.08) : 'transparent',
                        minWidth: 120,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          bgcolor: isCorrect ? ADMIN_PRIMARY : 'action.hover',
                          color: isCorrect ? '#fff' : 'text.secondary',
                        }}
                      >
                        {opt.charAt(0)}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: isCorrect ? 600 : 500 }}>
                        {opt}
                      </Typography>
                      {isCorrect && <CheckCircleIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />}
                    </Box>
                  )
                })}
              </Box>
            )}

            {/* Answer + Answer Description — when Hide answer, show underlined blank (question-paper style) */}
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderTop: q.questionType === 'mcq' || q.questionType === 'trueFalse' ? '1px solid' : 'none',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'flex-start' },
                gap: 2,
                bgcolor: showAnswer ? alpha(ADMIN_PRIMARY, 0.04) : alpha(theme.palette.grey[500], 0.04),
                borderLeft: { xs: 'none', sm: '4px solid' },
                borderLeftColor: showAnswer ? ADMIN_PRIMARY : 'divider',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  bgcolor: showAnswer ? alpha(ADMIN_PRIMARY, 0.15) : alpha(theme.palette.grey[500], 0.15),
                  color: showAnswer ? ADMIN_PRIMARY : 'text.secondary',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: showAnswer ? ADMIN_PRIMARY : 'text.secondary',
                    fontWeight: 700,
                    mb: 0.5,
                    fontSize: '0.8rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Correct Answer
                </Typography>
                {showAnswer ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        lineHeight: 1.6,
                        fontSize: { xs: '1rem', sm: '1.0625rem' },
                      }}
                    >
                      {q.answer}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mt: 1.25,
                        lineHeight: 1.65,
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      }}
                    >
                      {q.answerDescription}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        mt: 0.5,
                        minHeight: 28,
                        borderBottom: '2px solid',
                        borderColor: 'text.secondary',
                        width: '100%',
                        maxWidth: 400,
                      }}
                    />
                    <Box
                      sx={{
                        mt: 2,
                        minHeight: 48,
                        borderBottom: '2px solid',
                        borderColor: 'text.secondary',
                        width: '100%',
                      }}
                    />
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {filtered.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.12),
            bgcolor: theme.palette.background.paper,
          }}
        >
          <QuizRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            No questions match the selected type.
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default AdminScenariosLectureQuestions
