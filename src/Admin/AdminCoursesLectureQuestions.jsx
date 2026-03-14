import { useState, useEffect } from 'react'
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
  Skeleton,
  Button,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import apiClient from '../server'

const ADMIN_PRIMARY = '#384D84'

const QUESTION_TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
]

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice (MCQ)',
  shortAnswer: 'Short Answer',
  descriptive: 'Descriptive / Long Answer',
  trueFalse: 'True / False',
  fillInBlanks: 'Fill in the Blanks',
}

const SKELETON_COUNT = 3

const selectSx = () => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
    bgcolor: 'background.paper',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.5) },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: ADMIN_PRIMARY },
  },
  '& .MuiInputLabel-outlined': { fontWeight: 600, '&.Mui-focused': { color: ADMIN_PRIMARY } },
})

function AdminCoursesLectureQuestions() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const courseTitle = location.state?.courseTitle || 'Mock exam'
  const lectureNo = location.state?.lectureNo ?? 1
  const lectureId = location.state?.lectureId
  const courseId = location.state?.courseId

  const [questionTypeFilter, setQuestionTypeFilter] = useState('')
  const [showAnswer, setShowAnswer] = useState(true)
  const [questions, setQuestions] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const fetchQuestions = async () => {
    if (!lectureId) return
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('mock_exam_id', String(lectureId))
    params.set('per_page', '100')
    if (questionTypeFilter) {
      params.set('apply_filters', '1')
      params.set('question_type', questionTypeFilter)
    }
    try {
      const { ok, data } = await apiClient(`/mock-questions?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : data?.message
        setListError(message || 'Unable to load questions.')
        return
      }
      setQuestions(data.data?.questions || [])
    } catch {
      setListError('Unable to reach server. Please try again.')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureId])

  const handleFilterChange = (value) => {
    setQuestionTypeFilter(value)
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('mock_exam_id', String(lectureId))
    params.set('per_page', '100')
    if (value) {
      params.set('apply_filters', '1')
      params.set('question_type', value)
    }
    apiClient(`/mock-questions?${params.toString()}`, 'GET').then(({ ok, data }) => {
      if (!ok || !data?.success) {
        setListError(data?.message || 'Unable to load questions.')
      } else {
        setQuestions(data.data?.questions || [])
      }
      setListLoading(false)
    }).catch(() => {
      setListError('Unable to reach server.')
      setListLoading(false)
    })
  }

  const handleBack = () => {
    navigate('/admin/courses/lectures', { state: { courseTitle, courseId } })
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: 1000, mx: 'auto', overflowX: 'hidden' }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <IconButton onClick={handleBack} size={isMobile ? 'medium' : 'large'} sx={{ color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08), borderRadius: '7px', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) } }} aria-label="Back to mock exams">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Mock Exam {lectureNo} – Questions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>{courseTitle}</Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
          <FormControl size="small" sx={{ ...selectSx(), minWidth: { xs: '100%', sm: 220 }, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <InputLabel id="question-type-filter-label">Question type</InputLabel>
            <Select labelId="question-type-filter-label" value={questionTypeFilter} label="Question type" onChange={(e) => handleFilterChange(e.target.value)}>
              {QUESTION_TYPE_OPTIONS.map((opt) => <MenuItem key={opt.value || 'all'} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>Answer:</Typography>
            <ToggleButtonGroup
              value={showAnswer}
              exclusive
              onChange={(_, value) => value != null && setShowAnswer(value)}
              size="small"
              sx={{ flex: { xs: 1, sm: '0 0 auto' }, width: { xs: '100%', sm: 'auto' }, '& .MuiToggleButton-root': { flex: { xs: 1, sm: '0 0 auto' }, px: 1.5, py: 0.75, borderRadius: '7px', textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', borderColor: theme.palette.grey[300], color: 'text.secondary', '&.Mui-selected': { bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY, borderColor: ADMIN_PRIMARY, '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.18) } } } }}
            >
              <ToggleButton value={true}><VisibilityRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />Show</ToggleButton>
              <ToggleButton value={false}><VisibilityOffRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} />Hide</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Button size="small" startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />} onClick={fetchQuestions} sx={{ ml: { xs: 0, sm: 'auto' }, color: ADMIN_PRIMARY, fontWeight: 600, borderRadius: '7px', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Error */}
      {listError && !listLoading && (
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2), bgcolor: alpha(theme.palette.error.main, 0.04), textAlign: 'center' }}>
          <Typography variant="body2" color="error">{listError}</Typography>
          <Button size="small" onClick={fetchQuestions} sx={{ mt: 1, color: ADMIN_PRIMARY }}>Retry</Button>
        </Paper>
      )}

      {/* Question cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {listLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <Paper key={`sk-${idx}`} elevation={0} sx={{ borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper, overflow: 'hidden', boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}` }}>
                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: '1px solid', borderColor: 'divider', background: `linear-gradient(135deg, ${alpha(ADMIN_PRIMARY, 0.06)} 0%, ${alpha(ADMIN_PRIMARY, 0.02)} 100%)` }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <Skeleton variant="rounded" width={120} height={28} sx={{ borderRadius: '7px' }} />
                    <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: '7px' }} />
                  </Box>
                  <Skeleton variant="text" width="80%" sx={{ fontSize: '1rem' }} />
                  <Skeleton variant="text" width="50%" sx={{ fontSize: '1rem' }} />
                </Box>
                <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' }, gap: 1.5 }}>
                  {Array.from({ length: 5 }).map((_, oi) => (
                    <Box key={oi} sx={{ gridColumn: { xs: 'span 1', sm: oi <= 2 ? 'span 4' : 'span 6' } }}>
                      <Skeleton variant="rounded" height={56} sx={{ borderRadius: '7px' }} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            ))
          : questions.length === 0 && !listError ? (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
                <ViewListRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">No questions found for this exam.</Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>Add questions from the Question Bank.</Typography>
              </Paper>
            )
          : questions.map((q, index) => (
              <Paper key={q.id} elevation={0} sx={{ borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper, overflow: 'hidden', boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}` }}>
                {/* Question header */}
                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: '1px solid', borderColor: 'divider', background: `linear-gradient(135deg, ${alpha(ADMIN_PRIMARY, 0.06)} 0%, ${alpha(ADMIN_PRIMARY, 0.02)} 100%)` }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Chip label={QUESTION_TYPE_LABELS[q.question_type] || q.question_type} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.04em', borderRadius: '7px', bgcolor: ADMIN_PRIMARY, color: '#fff', height: 28 }} />
                    <Chip label={`Question ${index + 1}`} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: '7px', borderColor: 'divider', color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.05rem' }, lineHeight: 1.7 }}>
                    {q.question}
                  </Typography>
                </Box>

                {/* MCQ options */}
                {q.question_type === 'mcq' && q.options?.length > 0 && (
                  <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' }, gap: 1.5 }}>
                    {q.options.map((opt, optIndex) => {
                      const showCorrect = showAnswer && opt.is_correct
                      const gridSpan = optIndex <= 2 ? 4 : 6
                      return (
                        <Box key={opt.option_letter} sx={{ gridColumn: { xs: 'span 1', sm: `span ${gridSpan}` }, display: 'flex', alignItems: 'flex-start', gap: 1.5, p: { xs: 1.5, sm: 2 }, borderRadius: '7px', border: '2px solid', borderColor: showCorrect ? ADMIN_PRIMARY : 'divider', bgcolor: showCorrect ? alpha(ADMIN_PRIMARY, 0.08) : 'transparent' }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.875rem', bgcolor: showCorrect ? ADMIN_PRIMARY : 'action.hover', color: showCorrect ? '#fff' : 'text.secondary' }}>
                            {opt.option_letter}
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: showCorrect ? 600 : 500, lineHeight: 1.5, pt: 0.5 }}>
                            {opt.option_text}
                          </Typography>
                          {showCorrect && <CheckCircleIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22, ml: 'auto', flexShrink: 0, mt: 0.25 }} />}
                        </Box>
                      )
                    })}
                  </Box>
                )}

                {/* Answer + description */}
                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderTop: q.question_type === 'mcq' ? '1px solid' : 'none', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-start' }, gap: 2, bgcolor: showAnswer ? alpha(ADMIN_PRIMARY, 0.04) : alpha(theme.palette.grey[500], 0.04), borderLeft: { xs: 'none', sm: '4px solid' }, borderLeftColor: showAnswer ? ADMIN_PRIMARY : 'divider' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: showAnswer ? alpha(ADMIN_PRIMARY, 0.15) : alpha(theme.palette.grey[500], 0.15), color: showAnswer ? ADMIN_PRIMARY : 'text.secondary' }}>
                    <CheckCircleIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ color: showAnswer ? ADMIN_PRIMARY : 'text.secondary', fontWeight: 700, mb: 0.5, fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Correct Answer
                    </Typography>
                    {showAnswer ? (
                      <>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.6, fontSize: { xs: '1rem', sm: '1.0625rem' } }}>
                          {q.answer || (q.correct_option ? `${q.correct_option}` : '—')}
                        </Typography>
                        {q.answer_description && (
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.25, lineHeight: 1.65, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                            {q.answer_description}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <>
                        <Box sx={{ mt: 0.5, minHeight: 28, borderBottom: '2px solid', borderColor: 'text.secondary', width: '100%', maxWidth: 400 }} />
                        <Box sx={{ mt: 2, minHeight: 48, borderBottom: '2px solid', borderColor: 'text.secondary', width: '100%' }} />
                      </>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
      </Box>

      {!listLoading && !listError && questions.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
          <QuizRoundedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">No questions match the selected type.</Typography>
        </Paper>
      )}
    </Box>
  )
}

export default AdminCoursesLectureQuestions
