import { useState, useEffect } from 'react'
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
  Chip,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

const inputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.5) },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: ADMIN_PRIMARY },
  },
  '& .MuiInputLabel-outlined': { color: theme.palette.text.secondary, fontWeight: 600, '&.Mui-focused': { color: ADMIN_PRIMARY } },
})

const selectSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.5) },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: ADMIN_PRIMARY },
  },
  '& .MuiInputLabel-outlined': { color: theme.palette.text.secondary, fontWeight: 600, '&.Mui-focused': { color: ADMIN_PRIMARY } },
})

const QUESTION_TYPE_OPTIONS = [
  { value: 'mcq', label: 'Multiple Choice (MCQ)', disabled: false },
  { value: 'shortAnswer', label: 'Short Answer (Future expansion)', disabled: true },
  { value: 'descriptive', label: 'Descriptive / Long Answer (Future expansion)', disabled: true },
  { value: 'trueFalse', label: 'True / False (Future expansion)', disabled: true },
  { value: 'fillInBlanks', label: 'Fill in the Blanks (Future expansion)', disabled: true },
]

const MCQ_LETTERS = ['A', 'B', 'C', 'D', 'E']

const AI_TUTOR_FIELDS = [
  { key: 'validation', snakeKey: 'validation', label: 'Validation' },
  { key: 'keyCluesIdentified', snakeKey: 'key_clues_identified', label: 'Key Clues Identified' },
  { key: 'missingOrMisweightedClues', snakeKey: 'missing_or_misweighted_clues', label: 'Missing or Mis-weighted Clues' },
  { key: 'examinerLogic', snakeKey: 'examiner_logic', label: 'Examiner Logic' },
  { key: 'optionByOptionElimination', snakeKey: 'option_by_option_elimination', label: 'Option-by-Option Elimination' },
  { key: 'examinerTrapAlert', snakeKey: 'examiner_trap_alert', label: 'Examiner Trap Alert' },
  { key: 'patternRecognitionLabel', snakeKey: 'pattern_recognition_label', label: 'Pattern Recognition Label' },
  { key: 'socraticFollowUpQuestion', snakeKey: 'socratic_follow_up_question', label: 'Socratic Follow-up Question' },
  { key: 'investigationInterpretation', snakeKey: 'investigation_interpretation', label: 'Investigation Interpretation' },
  { key: 'managementLadder', snakeKey: 'management_ladder', label: 'Management Ladder' },
  { key: 'guidelineJustification', snakeKey: 'guideline_justification', label: 'Guideline Justification' },
  { key: 'safetyNettingRedFlags', snakeKey: 'safety_netting_red_flags', label: 'Safety Netting & Red Flags' },
  { key: 'examSummaryBox', snakeKey: 'exam_summary_box', label: 'Exam Summary Box' },
  { key: 'oneScreenMemoryMap', snakeKey: 'one_screen_memory_map', label: 'One-screen Memory Map' },
]

const emptyAiTutor = () => AI_TUTOR_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
const aiTutorFromApi = (apiAiTutor) => {
  if (!apiAiTutor) return emptyAiTutor()
  return AI_TUTOR_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: apiAiTutor[f.snakeKey] || '' }), {})
}
const aiTutorToApi = (values) => {
  return AI_TUTOR_FIELDS.reduce((acc, f) => ({ ...acc, [f.snakeKey]: values[f.key] || null }), {})
}

function AdminAddMocksQuestion() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { showToast } = useToast()

  const { editQuestion } = location.state || {}
  const isEdit = !!editQuestion

  const BACK_URL = '/admin/courses/question-bank'

  const [step, setStep] = useState(1)

  // Dropdown data
  const [mocks, setMocks] = useState([])
  const [exams, setExams] = useState([])
  const [dropdownsLoading, setDropdownsLoading] = useState(false)
  const [examsLoading, setExamsLoading] = useState(false)

  // Form state
  const [mockId, setMockId] = useState(editQuestion?.mock_id ? String(editQuestion.mock_id) : '')
  const [examId, setExamId] = useState(editQuestion?.mock_exam_id ? String(editQuestion.mock_exam_id) : '')
  const [questionType, setQuestionType] = useState(editQuestion?.question_type || '')
  const [question, setQuestion] = useState(editQuestion?.question || '')
  const [answerDescription, setAnswerDescription] = useState(editQuestion?.answer_description || '')
  const [mcqOptions, setMcqOptions] = useState(() => {
    const base = { A: '', B: '', C: '', D: '', E: '' }
    if (editQuestion?.options?.length) {
      editQuestion.options.forEach((opt) => {
        const letter = (opt.option_letter || '').toString().toUpperCase()
        if (Object.prototype.hasOwnProperty.call(base, letter)) base[letter] = opt.option_text || ''
      })
    }
    return base
  })
  const [mcqCorrect, setMcqCorrect] = useState(() => {
    if (editQuestion?.options?.length) {
      const correct = editQuestion.options.find((o) => o.is_correct)
      if (correct?.option_letter) return correct.option_letter.toString().toUpperCase()
      if (editQuestion?.correct_option) return editQuestion.correct_option.toString().toUpperCase()
    }
    return editQuestion?.correct_option ? editQuestion.correct_option.toString().toUpperCase() : 'A'
  })
  const [aiTutorValues, setAiTutorValues] = useState(() => aiTutorFromApi(editQuestion?.ai_tutor))

  // UI state
  const [submitLoading, setSubmitLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }
  const firstError = (field) => (errors[field] ? (Array.isArray(errors[field]) ? errors[field][0] : errors[field]) : null)

  const fetchMocks = async () => {
    setDropdownsLoading(true)
    try {
      const { ok, data } = await apiClient('/mocks?per_page=100&apply_filters=1&status=Active', 'GET')
      if (ok && data?.success) setMocks(data.data?.mocks || [])
    } catch { /* silent */ } finally {
      setDropdownsLoading(false)
    }
  }

  const fetchExams = async (mid) => {
    if (!mid) { setExams([]); return }
    setExamsLoading(true)
    try {
      const { ok, data } = await apiClient(`/mock-exams?mock_id=${mid}&per_page=100`, 'GET')
      if (ok && data?.success) setExams(data.data?.mock_exams || [])
    } catch { /* silent */ } finally {
      setExamsLoading(false)
    }
  }

  useEffect(() => {
    fetchMocks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isEdit || !editQuestion?.id) return
    let cancelled = false
    const loadFullQuestion = async () => {
      try {
        const { ok, data } = await apiClient(`/mock-questions/${editQuestion.id}`, 'GET')
        if (!ok || !data?.success || cancelled) return
        const q = data.data?.question
        if (!q) return

        if (q.mock_id) setMockId(String(q.mock_id))
        if (q.mock_exam_id) setExamId(String(q.mock_exam_id))
        if (q.question_type) setQuestionType(q.question_type)
        if (q.question) setQuestion(q.question)
        if (q.answer_description) setAnswerDescription(q.answer_description)

        if (Array.isArray(q.options) && q.options.length > 0) {
          const nextOptions = { A: '', B: '', C: '', D: '', E: '' }
          q.options.forEach((opt) => {
            const letter = (opt.option_letter || '').toString().toUpperCase()
            if (Object.prototype.hasOwnProperty.call(nextOptions, letter)) {
              nextOptions[letter] = opt.option_text || ''
            }
          })
          setMcqOptions(nextOptions)
          const correctFromList = q.options.find((o) => o.is_correct)?.option_letter
          setMcqCorrect(correctFromList ? correctFromList.toString().toUpperCase() : (q.correct_option ? q.correct_option.toString().toUpperCase() : 'A'))
        } else if (q.correct_option) {
          setMcqCorrect(q.correct_option)
        }

        setAiTutorValues(aiTutorFromApi(q.ai_tutor))
      } catch {
        // Fail silently
      }
    }
    loadFullQuestion()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editQuestion?.id])

  useEffect(() => {
    if (mockId) {
      fetchExams(mockId)
      if (!isEdit || String(editQuestion?.mock_id) !== mockId) {
        setExamId('')
      }
    } else {
      setExams([])
      setExamId('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockId])

  const handleMcqOptionChange = (letter, value) => {
    setMcqOptions((prev) => ({ ...prev, [letter]: value }))
    clearError('options')
    clearError(`options.${letter}`)
  }

  const handleAiTutorChange = (key, value) => {
    setAiTutorValues((prev) => ({ ...prev, [key]: value }))
    const field = AI_TUTOR_FIELDS.find((f) => f.key === key)
    if (field) clearError(`ai_tutor.${field.snakeKey}`)
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!mockId) newErrors.mock_id = 'Mock exam is required.'
    if (!examId) newErrors.mock_exam_id = 'Exam is required.'
    if (!questionType) newErrors.question_type = 'Question type is required.'
    if (!question.trim()) newErrors.question = 'Question text is required.'
    if (questionType === 'mcq') {
      const missing = MCQ_LETTERS.filter((l) => !mcqOptions[l]?.trim())
      if (missing.length > 0) {
        newErrors.options = 'All 5 MCQ options (A–E) are required.'
      } else if (!mcqOptions[mcqCorrect]?.trim()) {
        newErrors.options = `The selected correct option (${mcqCorrect}) must have text.`
      }
    }
    if (!answerDescription.trim()) newErrors.answer_description = 'Answer description is required.'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return false }
    return true
  }

  const handleNext = () => {
    if (validateStep1()) { setStep(2); window.scrollTo(0, 0) }
  }

  const handleBackToGeneral = () => { setStep(1); window.scrollTo(0, 0) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitLoading) return

    const aiErrors = {}
    AI_TUTOR_FIELDS.forEach((field) => {
      const val = aiTutorValues[field.key]
      if (!val || !String(val).trim()) {
        aiErrors[`ai_tutor.${field.snakeKey}`] = `${field.label} is required.`
      }
    })
    if (Object.keys(aiErrors).length > 0) {
      setErrors(aiErrors)
      setStep(2)
      showToast('Please fill all AI-Tutor fields.', 'error')
      return
    }

    setSubmitLoading(true)
    setErrors({})

    const options = MCQ_LETTERS.map((l) => ({
      letter: l,
      text: (mcqOptions[l] || '').trim(),
      is_correct: l === mcqCorrect,
    }))

    const payload = {
      mock_id: Number(mockId),
      mock_exam_id: Number(examId),
      question_type: questionType,
      question: question.trim(),
      answer_description: answerDescription.trim(),
      correct_option: questionType === 'mcq' ? mcqCorrect : null,
      options: questionType === 'mcq' ? options : [],
      ai_tutor: aiTutorToApi(aiTutorValues),
    }

    try {
      const url = isEdit ? `/mock-questions/${editQuestion.id}` : '/mock-questions'
      const method = isEdit ? 'PUT' : 'POST'
      const { ok, data } = await apiClient(url, method, payload)

      if (!ok || !data?.success) {
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors)
          const firstFieldWithError = Object.keys(data.errors)[0]
          const step1Fields = ['mock_id', 'mock_exam_id', 'question_type', 'question', 'options', 'answer_description', 'correct_option']
          if (step1Fields.some((f) => firstFieldWithError.startsWith(f.split('.')[0]))) setStep(1)
        }
        showToast(data?.message || `Failed to ${isEdit ? 'update' : 'save'} question.`, 'error')
        return
      }

      showToast(isEdit ? 'Question updated successfully.' : 'Question created successfully.', 'success')
      navigate(BACK_URL)
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Box sx={{ ...keyframes, width: '100%', minWidth: 0, maxWidth: 1000, mx: 'auto', overflowX: 'hidden' }}>
      {/* Page header */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={() => navigate(BACK_URL)} size={isMobile ? 'medium' : 'large'} sx={{ color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08), borderRadius: '7px', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) } }} aria-label="Back to mock question bank">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {isEdit ? 'Edit Mock Question' : 'Add Mock Question'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {isEdit ? 'Update this mock exam question' : 'Create a new mock exam question'}
          </Typography>
        </Box>
      </Box>

      <Paper elevation={0} component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper, boxShadow: { xs: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`, sm: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.04)}` } }}>

        {/* Step 1: General question */}
        {step === 1 && (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY, mx: 'auto', mb: 1.5 }}>
                <QuizRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>General question</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Mock, exam, question type and answer</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip icon={<QuizRoundedIcon sx={{ fontSize: 18 }} />} label="Step 1: General question" size="small" sx={{ fontWeight: 700, borderRadius: '7px', cursor: 'default', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>→</Typography>
              <Chip icon={<SmartToyRoundedIcon sx={{ fontSize: 18 }} />} label="Step 2: AI-Tutor" size="small" disabled sx={{ fontWeight: 700, borderRadius: '7px', color: 'text.secondary' }} />
            </Box>

            {/* Mock & Exam row */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
              <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <SchoolRoundedIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: ADMIN_PRIMARY, fontSize: 22, pointerEvents: 'none' }} />
                <FormControl fullWidth required size="medium" error={!!firstError('mock_id')} sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
                  <InputLabel id="mock-label" shrink>Mock</InputLabel>
                  <Select
                    labelId="mock-label"
                    value={mockId}
                    label="Mock"
                    notched
                    onChange={(e) => { setMockId(e.target.value); clearError('mock_id') }}
                    disabled={dropdownsLoading}
                    endAdornment={dropdownsLoading ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: ADMIN_PRIMARY, fontSize: 18, mr: 1 }} /> : undefined}
                  >
                    {mocks.length === 0 && !dropdownsLoading && <MenuItem value="" disabled>No mocks available</MenuItem>}
                    {mocks.map((m) => <MenuItem key={m.id} value={String(m.id)}>{m.title}</MenuItem>)}
                  </Select>
                </FormControl>
                {firstError('mock_id') && <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', pl: 1.5 }}>{firstError('mock_id')}</Typography>}
              </Box>

              <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <AssignmentRoundedIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: ADMIN_PRIMARY, fontSize: 22, pointerEvents: 'none' }} />
                <FormControl fullWidth required size="medium" error={!!firstError('mock_exam_id')} sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
                  <InputLabel id="exam-label" shrink>Exam</InputLabel>
                  <Select
                    labelId="exam-label"
                    value={examId}
                    label="Exam"
                    notched
                    onChange={(e) => { setExamId(e.target.value); clearError('mock_exam_id') }}
                    disabled={!mockId || examsLoading}
                    endAdornment={examsLoading ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: ADMIN_PRIMARY, fontSize: 18, mr: 1 }} /> : undefined}
                  >
                    {!mockId && <MenuItem value="" disabled>Select a mock first</MenuItem>}
                    {mockId && exams.length === 0 && !examsLoading && <MenuItem value="" disabled>No exams available</MenuItem>}
                    {exams.map((ex) => <MenuItem key={ex.id} value={String(ex.id)}>Exam {ex.exam_no}</MenuItem>)}
                  </Select>
                </FormControl>
                {firstError('mock_exam_id') && <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', pl: 1.5 }}>{firstError('mock_exam_id')}</Typography>}
              </Box>
            </Box>

            {/* Question type */}
            <FormControl fullWidth required size="medium" error={!!firstError('question_type')} sx={{ ...selectSx(theme), mb: firstError('question_type') ? 0.5 : 2 }}>
              <InputLabel id="question-type-label" shrink>Question type</InputLabel>
              <Select labelId="question-type-label" value={questionType} label="Question type" notched onChange={(e) => { setQuestionType(e.target.value); clearError('question_type') }}>
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {firstError('question_type') && <Typography variant="caption" color="error" sx={{ mb: 1.5, display: 'block', pl: 1.5 }}>{firstError('question_type')}</Typography>}

            {/* Question text */}
            <TextField
              fullWidth
              required
              label="Question"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); clearError('question') }}
              error={!!firstError('question')}
              helperText={firstError('question')}
              placeholder="Enter the question text"
              variant="outlined"
              size="medium"
              minRows={2}
              maxRows={4}
              multiline
              sx={{ ...inputSx(theme), mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><TitleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} /></InputAdornment> }}
            />

            {/* MCQ options */}
            {questionType === 'mcq' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1.5 }}>Options (select the correct answer)</Typography>
                {firstError('options') && <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>{firstError('options')}</Typography>}
                {MCQ_LETTERS.map((letter) => (
                  <Box key={letter} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Radio checked={mcqCorrect === letter} onChange={() => setMcqCorrect(letter)} value={letter} name="mcq-correct" size="small" sx={{ color: ADMIN_PRIMARY, '&.Mui-checked': { color: ADMIN_PRIMARY }, flexShrink: 0 }} />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Option ${letter}`}
                      value={mcqOptions[letter] || ''}
                      onChange={(e) => handleMcqOptionChange(letter, e.target.value)}
                      sx={inputSx(theme)}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Answer Description */}
            <TextField
              fullWidth
              required
              label="Answer Description"
              value={answerDescription}
              onChange={(e) => { setAnswerDescription(e.target.value); clearError('answer_description') }}
              error={!!firstError('answer_description')}
              helperText={firstError('answer_description')}
              placeholder="Explain why the answer is correct (rationale)"
              variant="outlined"
              size="medium"
              multiline
              minRows={3}
              maxRows={8}
              sx={{ ...inputSx(theme), mb: 3, '& .MuiOutlinedInput-root': { alignItems: 'flex-start' } }}
              InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}><MenuBookRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} /></InputAdornment> }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={handleNext}
                endIcon={<NavigateNextRoundedIcon sx={{ fontSize: 22 }} />}
                sx={{ py: 1.5, px: 3, fontWeight: 700, fontSize: '1rem', textTransform: 'none', borderRadius: '7px', background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`, boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`, '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`, boxShadow: `0 6px 20px ${alpha(ADMIN_PRIMARY, 0.45)}` } }}
              >
                Next
              </Button>
            </Box>
          </>
        )}

        {/* Step 2: AI-Tutor */}
        {step === 2 && (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY, mx: 'auto', mb: 1.5 }}>
                <SmartToyRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>AI-Tutor section</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Guidance content for this question (shown to students after answering)</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip icon={<QuizRoundedIcon sx={{ fontSize: 18 }} />} label="Step 1: General question" size="small" onClick={handleBackToGeneral} sx={{ fontWeight: 700, borderRadius: '7px', cursor: 'pointer', color: 'text.secondary', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.08), color: ADMIN_PRIMARY } }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>→</Typography>
              <Chip icon={<SmartToyRoundedIcon sx={{ fontSize: 18 }} />} label="Step 2: AI-Tutor" size="small" sx={{ fontWeight: 700, borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
              {AI_TUTOR_FIELDS.map((field, idx) => (
                <Box key={field.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>{idx + 1}. {field.label}</Typography>
                  </Box>
                  {firstError(`ai_tutor.${field.snakeKey}`) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                      <Typography variant="caption" color="error">{firstError(`ai_tutor.${field.snakeKey}`)}</Typography>
                    </Box>
                  )}
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    value={aiTutorValues[field.key] || ''}
                    onChange={(e) => handleAiTutorChange(field.key, e.target.value)}
                    error={!!firstError(`ai_tutor.${field.snakeKey}`)}
                    sx={inputSx(theme)}
                  />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleBackToGeneral}
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 20 }} />}
                sx={{ borderColor: alpha(theme.palette.grey[400], 0.8), color: 'text.secondary', borderRadius: '7px', fontWeight: 600, px: 2.5, py: 1.25, textTransform: 'none', '&:hover': { borderColor: ADMIN_PRIMARY, color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.06) } }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitLoading}
                startIcon={submitLoading ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff', fontSize: 22 }} /> : <SaveRoundedIcon sx={{ fontSize: 22 }} />}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: '7px',
                  color: '#fff',
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                  boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`,
                  '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`, boxShadow: `0 6px 20px ${alpha(ADMIN_PRIMARY, 0.45)}`, color: '#fff' },
                  '&.Mui-disabled': { opacity: 0.9, color: '#fff', background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)` },
                }}
              >
                {submitLoading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update question' : 'Save question')}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default AdminAddMocksQuestion
