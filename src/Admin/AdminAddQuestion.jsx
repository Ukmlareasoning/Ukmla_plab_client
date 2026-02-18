import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Chip,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'

// Admin screen primary (#384D84 — no green)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

const inputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(ADMIN_PRIMARY, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: ADMIN_PRIMARY,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    '&.Mui-focused': { color: ADMIN_PRIMARY },
  },
})

const selectSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(ADMIN_PRIMARY, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: ADMIN_PRIMARY,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    '&.Mui-focused': { color: ADMIN_PRIMARY },
  },
})

const QUESTION_TYPE_OPTIONS = [
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
  { value: 'shortAnswer', label: 'Short Answer' },
  { value: 'descriptive', label: 'Descriptive / Long Answer' },
  { value: 'trueFalse', label: 'True / False' },
  { value: 'fillInBlanks', label: 'Fill in the Blanks' },
]

// Dummy options — replace with API data when available
const COURSE_OPTIONS = [
  'UKMLA Reasoning Foundation',
  'PLAB Ethics Core',
  'UKMLA Patient Safety Advanced',
  'MDCAT Reasoning',
  'UKMLA Reasoning Core',
]

const LECTURE_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1)

const MCQ_LETTERS = ['A', 'B', 'C', 'D']

const AI_TUTOR_FIELDS = [
  { key: 'validateStudentEffort', label: 'Validate student effort' },
  { key: 'keyClueFocusedOn', label: 'Identify key clue student focused on' },
  { key: 'missingOrMisweightedClue', label: 'Identify missing or misweighted clue' },
  { key: 'examinerLogic', label: 'Explain examiner logic' },
  { key: 'whyWrongOptionsWrong', label: 'Explain why each wrong option is wrong' },
  { key: 'commonExaminerTrap', label: 'Highlight the common examiner trap' },
  { key: 'patternLabel', label: 'Assign a pattern label' },
]

function AdminAddQuestion() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isScenarioQuestionBank = location.pathname.startsWith('/admin/scenarios/question-bank')
  const questionBankBackUrl = isScenarioQuestionBank ? '/admin/scenarios/question-bank' : '/admin/courses/question-bank'

  const [step, setStep] = useState(1) // 1 = General question, 2 = AI-Tutor section

  const [course, setCourse] = useState('')
  const [lecture, setLecture] = useState('')
  const [questionType, setQuestionType] = useState('')
  const [question, setQuestion] = useState('')
  const [answerDescription, setAnswerDescription] = useState('')

  // Answer by type
  const [mcqOptions, setMcqOptions] = useState({ A: '', B: '', C: '', D: '' })
  const [mcqCorrect, setMcqCorrect] = useState('A')
  const [trueFalseAnswer, setTrueFalseAnswer] = useState('')
  const [shortAnswer, setShortAnswer] = useState('')
  const [descriptiveAnswer, setDescriptiveAnswer] = useState('')
  const [fillInBlanksAnswer, setFillInBlanksAnswer] = useState('')

  // AI-Tutor section (step 2) — 7 fields
  const [aiTutorValues, setAiTutorValues] = useState(() =>
    AI_TUTOR_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
  )

  const handleMcqOptionChange = (letter, value) => {
    setMcqOptions((prev) => ({ ...prev, [letter]: value }))
  }

  const handleAiTutorChange = (key, value) => {
    setAiTutorValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleBackToGeneral = () => {
    setStep(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: submit to API — include general question + aiTutorValues
    navigate(questionBankBackUrl)
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
          onClick={() => navigate(questionBankBackUrl)}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) },
          }}
          aria-label={isScenarioQuestionBank ? 'Back to scenario question bank' : 'Back to question bank'}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {isScenarioQuestionBank ? 'Add Scenario Question' : 'Add Question'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {isScenarioQuestionBank ? 'Create a new scenario question' : 'Create a new question'}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          bgcolor: theme.palette.background.paper,
          boxShadow: { xs: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`, sm: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.04)}` },
        }}
      >
        {step === 1 && (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(ADMIN_PRIMARY, 0.1),
                  color: ADMIN_PRIMARY,
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <QuizRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                General question
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Course, exam, question type and answer
              </Typography>
            </Box>

            {/* Step 1 / Step 2 — after sub-title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                icon={<QuizRoundedIcon sx={{ fontSize: 18 }} />}
                label="Step 1: General question"
                size="small"
                color={step === 1 ? 'primary' : 'default'}
                onClick={step === 2 ? handleBackToGeneral : undefined}
                sx={{
                  fontWeight: 700,
                  borderRadius: '7px',
                  cursor: step === 2 ? 'pointer' : 'default',
                  ...(step === 1 ? { bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY } : { color: 'text.secondary' }),
                  ...(step === 2 && {
                    '&:hover': {
                      bgcolor: alpha(ADMIN_PRIMARY, 0.08),
                      color: ADMIN_PRIMARY,
                    },
                  }),
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>→</Typography>
              <Chip
                icon={<SmartToyRoundedIcon sx={{ fontSize: 18 }} />}
                label="Step 2: AI-Tutor"
                size="small"
                color={step === 2 ? 'primary' : 'default'}
                disabled={step === 1}
                sx={{
                  fontWeight: 700,
                  borderRadius: '7px',
                  ...(step === 2 ? { bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY } : { color: 'text.secondary' }),
                }}
              />
            </Box>

        {/* Course & Lecture — two columns on sm+ */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <SchoolRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="course-label" shrink>Course</InputLabel>
              <Select labelId="course-label" value={course} label="Course" onChange={(e) => setCourse(e.target.value)} notched>
                {COURSE_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <AssignmentRoundedIcon
              sx={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: ADMIN_PRIMARY,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="lecture-label" shrink>Exam</InputLabel>
              <Select labelId="lecture-label" value={lecture} label="Lecture" onChange={(e) => setLecture(e.target.value)} notched>
                {LECTURE_OPTIONS.map((n) => (
                  <MenuItem key={n} value={String(n)}>Exam {n}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Question type */}
        <FormControl fullWidth required size="medium" sx={{ ...selectSx(theme), mb: 2 }}>
          <InputLabel id="question-type-label" shrink>Question type</InputLabel>
          <Select
            labelId="question-type-label"
            value={questionType}
            label="Question type"
            onChange={(e) => setQuestionType(e.target.value)}
            notched
          >
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Question */}
        <TextField
          fullWidth
          required
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={questionType === 'fillInBlanks' ? 'e.g. The GMC states that doctors must make the _____ of patients their first concern.' : 'Enter the question text'}
          variant="outlined"
          size="medium"
          multiline={questionType === 'descriptive'}
          minRows={questionType === 'descriptive' ? 4 : 2}
          maxRows={questionType === 'descriptive' ? 10 : 4}
          sx={{
            ...inputSx(theme),
            mb: 2,
            '& .MuiOutlinedInput-root': questionType === 'descriptive' ? { alignItems: 'flex-start' } : {},
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={questionType === 'descriptive' ? { alignItems: 'flex-start', pt: 1.5 } : {}}>
                <TitleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Answer — based on type */}
        {questionType === 'mcq' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1.5 }}>Options (select correct answer)</Typography>
            {MCQ_LETTERS.map((letter) => (
              <Box key={letter} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Radio
                  checked={mcqCorrect === letter}
                  onChange={() => setMcqCorrect(letter)}
                  value={letter}
                  name="mcq-correct"
                  size="small"
                  sx={{ color: ADMIN_PRIMARY, '&.Mui-checked': { color: ADMIN_PRIMARY } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Option ${letter}`}
                  value={mcqOptions[letter]}
                  onChange={(e) => handleMcqOptionChange(letter, e.target.value)}
                  sx={inputSx(theme)}
                />
              </Box>
            ))}
          </Box>
        )}

        {questionType === 'trueFalse' && (
          <Box sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>Correct answer</FormLabel>
            <RadioGroup
              row
              value={trueFalseAnswer}
              onChange={(e) => setTrueFalseAnswer(e.target.value)}
              name="true-false-answer"
            >
              <FormControlLabel value="True" control={<Radio size="small" sx={{ color: ADMIN_PRIMARY, '&.Mui-checked': { color: ADMIN_PRIMARY } }} />} label="True" />
              <FormControlLabel value="False" control={<Radio size="small" sx={{ color: ADMIN_PRIMARY, '&.Mui-checked': { color: ADMIN_PRIMARY } }} />} label="False" />
            </RadioGroup>
          </Box>
        )}

        {(questionType === 'shortAnswer' || questionType === 'fillInBlanks') && (
          <TextField
            fullWidth
            required
            label={questionType === 'fillInBlanks' ? 'Answer (word/phrase for the blank)' : 'Answer'}
            value={questionType === 'fillInBlanks' ? fillInBlanksAnswer : shortAnswer}
            onChange={(e) => (questionType === 'fillInBlanks' ? setFillInBlanksAnswer(e.target.value) : setShortAnswer(e.target.value))}
            placeholder={questionType === 'fillInBlanks' ? 'e.g. care' : 'Enter the expected answer'}
            variant="outlined"
            size="medium"
            sx={{ ...inputSx(theme), mb: 2 }}
          />
        )}

        {questionType === 'descriptive' && (
          <TextField
            fullWidth
            required
            label="Answer"
            value={descriptiveAnswer}
            onChange={(e) => setDescriptiveAnswer(e.target.value)}
            placeholder="Enter the model answer / key points"
            variant="outlined"
            size="medium"
            multiline
            minRows={4}
            maxRows={10}
            sx={{ ...inputSx(theme), mb: 2, '& .MuiOutlinedInput-root': { alignItems: 'flex-start' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                  <DescriptionRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Answer Description — shown for all types */}
        <TextField
          fullWidth
          required
          label="Answer Description"
          value={answerDescription}
          onChange={(e) => setAnswerDescription(e.target.value)}
          placeholder="Explain why the answer is correct (rationale)"
          variant="outlined"
          size="medium"
          multiline
          minRows={3}
          maxRows={8}
          sx={{
            ...inputSx(theme),
            mb: 3,
            '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                <MenuBookRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="contained"
            size="large"
            onClick={handleNext}
            endIcon={<NavigateNextRoundedIcon sx={{ fontSize: 22 }} />}
            sx={{
              py: 1.5,
              px: 3,
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '7px',
              background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
              boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                boxShadow: `0 6px 20px ${alpha(ADMIN_PRIMARY, 0.45)}`,
              },
            }}
          >
            Next
          </Button>
        </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(ADMIN_PRIMARY, 0.1),
                  color: ADMIN_PRIMARY,
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <SmartToyRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                AI-Tutor section
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Guidance content for this question (shown to students after answering)
              </Typography>
            </Box>

            {/* Step 1 / Step 2 — after sub-title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                icon={<QuizRoundedIcon sx={{ fontSize: 18 }} />}
                label="Step 1: General question"
                size="small"
                color={step === 1 ? 'primary' : 'default'}
                onClick={handleBackToGeneral}
                sx={{
                  fontWeight: 700,
                  borderRadius: '7px',
                  cursor: 'pointer',
                  ...(step === 1 ? { bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY } : { color: 'text.secondary' }),
                  '&:hover': {
                    bgcolor: alpha(ADMIN_PRIMARY, 0.08),
                    color: ADMIN_PRIMARY,
                  },
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>→</Typography>
              <Chip
                icon={<SmartToyRoundedIcon sx={{ fontSize: 18 }} />}
                label="Step 2: AI-Tutor"
                size="small"
                color={step === 2 ? 'primary' : 'default'}
                sx={{
                  fontWeight: 700,
                  borderRadius: '7px',
                  ...(step === 2 ? { bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY } : { color: 'text.secondary' }),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {AI_TUTOR_FIELDS.map((field, idx) => (
                <TextField
                  key={field.key}
                  fullWidth
                  label={`${idx + 1}. ${field.label}`}
                  value={aiTutorValues[field.key]}
                  onChange={(e) => handleAiTutorChange(field.key, e.target.value)}
                  placeholder={`Enter text for: ${field.label}`}
                  variant="outlined"
                  multiline
                  minRows={3}
                  maxRows={8}
                  sx={{
                    ...inputSx(theme),
                    '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                        <SmartToyRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleBackToGeneral}
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 20 }} />}
                sx={{
                  borderColor: alpha(theme.palette.grey[400], 0.8),
                  color: 'text.secondary',
                  borderRadius: '7px',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1.25,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: ADMIN_PRIMARY,
                    color: ADMIN_PRIMARY,
                    bgcolor: alpha(ADMIN_PRIMARY, 0.06),
                  },
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveRoundedIcon sx={{ fontSize: 22 }} />}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: '7px',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(ADMIN_PRIMARY, 0.45)}`,
                  },
                }}
              >
                Save question
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default AdminAddQuestion
