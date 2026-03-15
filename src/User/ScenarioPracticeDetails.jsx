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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Rating,
  Skeleton,
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
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded'
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import RuleRoundedIcon from '@mui/icons-material/RuleRounded'
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import UserDashboardLayout from './UserDashboardLayout'
import apiClient from '../server'

// Dummy data for AI response sections (match reference UI)
const AI_CORRECT_ANSWER_FEEDBACK = 'Excellent—this is correct and well-reasoned.'
const AI_OPTION_BREAKDOWN = [
  { letter: 'A', text: 'Thrombolysis only if PCI unavailable in time', correct: false },
  { letter: 'B', text: 'Primary PCI = first-line within 120 minutes', correct: true },
  { letter: 'C', text: 'Antiplatelets alone delay reperfusion', correct: false },
  { letter: 'D', text: 'Beta-blockers must not delay reperfusion', correct: false },
  { letter: 'E', text: 'Troponin not needed when ECG diagnostic', correct: false },
]
const AI_PEARL_TEXT = 'STEMI is a clinical + ECG diagnosis. Do NOT wait for troponins—activate primary PCI pathway immediately if within 12 hours of onset.'
const AI_AVOID_TRAPS = [
  'Waiting for troponin before acting',
  'Applying NSTEMI logic to STEMI',
  'Delaying transfer for serial ECGs when first ECG is diagnostic',
]
const AI_MANAGEMENT_STEPS = [
  'Loading dose: Aspirin 300mg + Ticagrelor 180mg',
  'Anticoagulation: Unfractionated heparin or Enoxaparin',
  'Urgent transfer for Primary PCI',
]
const AI_GUIDELINE_TEXT = 'NICE NG185: Offer immediate PPCI if presentation within 12 hours of symptom onset and PPCI can be delivered within 120 minutes.'

// AI Tutor explanation points — Lorem ipsum placeholders (replace with real content/API later)
const AI_TUTOR_POINTS = [
  { title: 'Validation', key: 'validation', icon: CheckCircleRoundedIcon },
  { title: 'Key Clues Identified', key: 'keyClues', icon: SearchRoundedIcon },
  { title: 'Missing or Mis-weighted Clues', key: 'missingClues', icon: VisibilityOffRoundedIcon },
  { title: 'Examiner Logic', key: 'examinerLogic', icon: PsychologyRoundedIcon },
  { title: 'Option-by-Option Elimination', key: 'optionElimination', icon: ListAltRoundedIcon },
  { title: 'Examiner Trap Alert', key: 'trapAlert', icon: WarningAmberRoundedIcon },
  { title: 'Pattern Recognition Label', key: 'patternLabel', icon: CategoryRoundedIcon },
  { title: 'Socratic Follow-up Question', key: 'socraticFollowUp', icon: QuestionAnswerRoundedIcon },
  { title: 'Investigation Interpretation', key: 'investigationInterpretation', icon: BiotechRoundedIcon },
  { title: 'Management Ladder', key: 'managementLadder', icon: AccountTreeRoundedIcon },
  { title: 'Guideline Justification', key: 'guidelineJustification', icon: RuleRoundedIcon },
  { title: 'Safety Netting & Red Flags', key: 'safetyNetting', icon: HealthAndSafetyRoundedIcon },
  { title: 'Exam Summary Box', key: 'examSummary', icon: InfoRoundedIcon },
  { title: 'One-Screen Memory Map', key: 'oneScreenMap', icon: MapRoundedIcon },
]

const AI_TUTOR_LOREM = {
  validation: '✅ Correct. This is a classic STEMI requiring immediate reperfusion.\n• You correctly identified the clinical emergency.\n• You prioritised time-critical management steps.\n• Excellent recognition of ST-elevation patterns.',
  keyClues: '🔍 Key Clues Identified:\n• 💥 Crushing central chest pain radiating to arm and jaw\n• 😰 Autonomic symptoms (diaphoresis, nausea)\n• 📈 ST elevation in contiguous inferior leads (II, III, aVF)\n• 📉 Reciprocal ST depression in lateral leads\n• ⏱️ Symptom onset within 12 hours',
  missingClues: '⚠️ Missing or Mis-weighted Clues:\n• ⏱️ The 90-minute window is crucial — reperfusion benefit is maximal early.\n• 🚫 No contraindications to PCI or thrombolysis were noted.\n• 🧬 Family history of early-onset IHD was a significant risk factor.',
  examinerLogic: '🧠 Examiner Logic (Pathophysiology):\nAcute plaque rupture with complete coronary artery occlusion causes transmural myocardial ischaemia, producing ST elevation. Rapid reperfusion limits infarct size and reduces mortality. The examiner is testing your ability to bridge clinical signs with emergency interventions.',
  optionElimination: '🍱 Option-by-Option Elimination:\n• A ❌ 💉 Thrombolysis only if PCI unavailable in time\n• B ✅ 🚑 Primary PCI = first-line within 120 minutes\n• C ❌ 💊 Antiplatelets alone delay reperfusion\n• D ❌ 💗 Beta-blockers must not delay reperfusion\n• E ❌ 🧪 Troponin not needed when ECG diagnostic',
  trapAlert: '🚩 Examiner Trap Alert:\n• 🛑 "Waiting for troponin before acting" is a common failure point.\n• 👉 STEMI is a clinical + ECG diagnosis, not biochemical.\n• 🚑 Transfer should not be delayed for serial ECGs if the first is diagnostic.',
  patternLabel: '🏷️ Pattern Recognition Label:\nThis follows the "Ischaemic Triad" pattern: Clinical Symptom + ECG Change + Risk Factors. Recognising this early prevents catastrophic delays in care.',
  socraticFollowUp: '❓ Socratic Follow-up Question:\nIf the patient was in a remote area and the nearest PCI centre was 3 hours away, how would your management ladder change?',
  investigationInterpretation: '🔬 Investigation Interpretation:\n• 📉 ST-Elevation: Suggests 100% occlusion of the Right Coronary Artery (RCA).\n• 🩸 Cardiac Enzymes: Likely to be elevated, but must not delay primary PCI.\n• 🩺 Echogram: May show regional wall motion abnormality in the inferior wall.',
  managementLadder: '🪜 Management Ladder:\n1. 💊 Loading Dose: Aspirin 300mg + Ticagrelor 180mg.\n2. 💉 Anticoagulation: Unfractionated heparin or Enoxaparin.\n3. 🚑 Definitive: Urgent transfer for Primary Percutaneous Coronary Intervention (PCI).',
  guidelineJustification: '📜 Guideline Justification:\nAccording to NICE Guidelines [NG185], patients with STEMI should be offered immediate PPCI if they present within 12 hours of symptom onset and PPCI can be delivered within 120 minutes.',
  safetyNetting: '🛡️ Safety Netting & Red Flags:\n• 🚨 Monitor for ventricular arrhythmias in the acute phase.\n• 🫁 Observe for signs of acute heart failure (basal crackles).\n• 🩺 Post-procedure: Educate on long-term lifestyle changes and dual antiplatelet therapy.',
  examSummary: '📦 Exam Summary Box:\n• 🚩 STEMI = ST Elevation or New LBBB.\n• ⏱️ Goal: Door-to-balloon time < 90 mins.\n• 💊 MONA: Morphine, Oxygen, Nitrates, Aspirin (Initial treatment).',
  oneScreenMap: '🗺️ One-Screen Memory Map:\nClinical Presentation ➡️ 12-Lead ECG ➡️ Diagnosis (STEMI) ➡️ Reperfusion Strategy (PCI vs Thrombolysis) ➡️ Secondary Prevention.',
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

function ScenarioPracticeDetails() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scenarioId = location.state?.scenarioId || null
  const examId = location.state?.examId || null
  const examNo = location.state?.examNo || 1
  const courseTitle = location.state?.courseTitle || 'Scenario exam practice'

  const [questions, setQuestions] = useState([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [maxLockedIndex, setMaxLockedIndex] = useState(-1)
  const [viewMode, setViewMode] = useState('questions')
  const [percentage, setPercentage] = useState(0)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [formStars, setFormStars] = useState(0)
  const [formComment, setFormComment] = useState('')
  const [showAiResponse, setShowAiResponse] = useState(false)

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

  // Load dynamic questions from public /scenario-questions API
  useEffect(() => {
    if (!scenarioId || !examId) {
      setQuestionsLoading(false)
      return
    }
    setQuestionsLoading(true)
    const loadQuestions = async () => {
      const params = new URLSearchParams()
      params.set('scenario_id', String(scenarioId))
      params.set('scenario_exam_id', String(examId))
      params.set('per_page', '200')
      try {
        const { ok, data } = await apiClient(`/scenario-questions?${params.toString()}`, 'GET')
        if (!ok || !data?.success) {
          setQuestions([])
          return
        }
        const list = data.data?.questions || []
        const snakeToCamel = (at) => {
          if (!at || typeof at !== 'object') return null
          return {
            validation: at.validation ?? '',
            keyClues: at.key_clues_identified ?? '',
            missingClues: at.missing_or_misweighted_clues ?? '',
            examinerLogic: at.examiner_logic ?? '',
            optionElimination: at.option_by_option_elimination ?? '',
            trapAlert: at.examiner_trap_alert ?? '',
            patternLabel: at.pattern_recognition_label ?? '',
            socraticFollowUp: at.socratic_follow_up_question ?? '',
            investigationInterpretation: at.investigation_interpretation ?? '',
            managementLadder: at.management_ladder ?? '',
            guidelineJustification: at.guideline_justification ?? '',
            safetyNetting: at.safety_netting_red_flags ?? '',
            examSummary: at.exam_summary_box ?? '',
            oneScreenMap: at.one_screen_memory_map ?? '',
          }
        }
        const mapped = list.map((q) => {
          const base = {
            id: q.id,
            questionType: q.question_type || 'mcq',
            text: q.question || '',
            placeholder: '',
            options: Array.isArray(q.options)
              ? q.options.map((o) => ({ letter: o.option_letter, text: o.option_text, isCorrect: o.is_correct }))
              : [],
            aiTutor: snakeToCamel(q.ai_tutor),
          }
          if (base.questionType === 'shortAnswer' || base.questionType === 'descriptive' || base.questionType === 'fillInBlanks') {
            base.placeholder = q.answer_description || 'Type your answer here...'
          }
          return base
        })
        setQuestions(mapped)
        setCurrentQuestionIndex(0)
        setAnswers(Array(mapped.length).fill(null))
        setMaxLockedIndex(-1)
        setPercentage(0)
        setShowAiResponse(false)
      } catch {
        setQuestions([])
      } finally {
        setQuestionsLoading(false)
      }
    }
    loadQuestions()
  }, [scenarioId, examId])

  const handleBack = () => {
    navigate('/user-dashboard/scenario-practice')
  }

  const recalcScoreFromAttempts = (lockedIdx) => {
    const attempted = Math.max(0, Math.min(questions.length, lockedIdx + 1))
    const pct = questions.length > 0 ? Math.round((attempted / questions.length) * 100) : 0
    setPercentage(pct)
  }

  const handleSelectOption = (letter) => {
    const qIndex = currentQuestionIndex
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

  const handleSubmitAnswer = () => {
    const qIndex = currentQuestionIndex
    if (!answers[qIndex]) return
    if (String(answers[qIndex]).trim() === '') return

    const nextLockedIndex = Math.max(maxLockedIndex, qIndex)
    setMaxLockedIndex(nextLockedIndex)
    recalcScoreFromAttempts(nextLockedIndex)
    setShowAiResponse(true)
  }

  const handleNextQuestion = () => {
    const qIndex = currentQuestionIndex
    setShowAiResponse(false)
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
    setShowAiResponse(false)
    setCurrentQuestionIndex((prev) => prev - 1)
  }

  const totalQuestions = questions.length
  const question = totalQuestions > 0 && currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions ? questions[currentQuestionIndex] : null
  const currentAnswer = question != null ? answers[currentQuestionIndex] : null
  const isLocked = question != null && currentQuestionIndex <= maxLockedIndex

  const currentAiTutor = question?.aiTutor ?? null

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 }, overflowX: 'hidden' }}>
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
            aria-label="Back to scenario exams"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {courseTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              Scenario exam {examNo} practice – questions appear one by one.
            </Typography>
          </Box>
        </Box>

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
            <Box sx={{ width: 56, height: 56, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(getScoreColor(percentage), 0.15) }}>
              <MenuBookRoundedIcon sx={{ fontSize: 32, color: getScoreColor(percentage) }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
                {viewMode === 'questions' ? 'Attempted questions' : 'Scenario exam score'}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: getScoreColor(percentage), fontSize: '1.75rem' }}>
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
              '& .MuiLinearProgress-bar': { borderRadius: '7px', bgcolor: getScoreColor(percentage) },
            }}
          />
        </Paper>

        {viewMode === 'questions' && questionsLoading && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.18), bgcolor: theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rounded" width={140} height={28} sx={{ borderRadius: '7px' }} />
              <Skeleton variant="rounded" width={120} height={28} sx={{ borderRadius: '7px' }} />
            </Box>
            <Skeleton variant="text" width="95%" sx={{ mb: 2, fontSize: '1.05rem' }} />
            <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.25, mb: 3 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: '7px' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: '7px' }} />
              <Skeleton variant="rounded" width={160} height={40} sx={{ borderRadius: '7px' }} />
            </Box>
          </Paper>
        )}
        {viewMode === 'questions' && !questionsLoading && questions.length === 0 && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.18), bgcolor: theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>No questions for this exam.</Typography>
            </Box>
          </Paper>
        )}
        {viewMode === 'questions' && !questionsLoading && question != null && (
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.18), bgcolor: theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip icon={<QuizRoundedIcon />} label={QUESTION_TYPE_LABELS[question.questionType] || 'Question'} size="small" sx={{ borderRadius: '7px !important', '&.MuiChip-root': { borderRadius: '7px' }, fontWeight: 700, fontSize: '0.75rem', bgcolor: PAGE_PRIMARY, color: '#fff' }} />
              <Chip label={`Question ${currentQuestionIndex + 1} / ${totalQuestions}`} size="small" sx={{ borderRadius: '7px !important', '&.MuiChip-root': { borderRadius: '7px' }, fontWeight: 700, fontSize: '0.75rem', bgcolor: alpha(theme.palette.grey[500], 0.08), color: 'text.secondary' }} />
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Attempted so far</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: getScoreColor(percentage) }}>{percentage}%</Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.05rem' }, mb: 2, lineHeight: 1.7 }}>
              {question.text}
            </Typography>
            {question.questionType === 'mcq' && question.options && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' }, gap: 1.25, mb: 3 }}>
                {question.options.map((opt, optIndex) => {
                  const isSelected = currentAnswer === opt.letter
                  const gridSpan = optIndex <= 2 ? 4 : 6
                  return (
                    <Button key={opt.letter} variant={isSelected ? 'contained' : 'outlined'} onClick={() => handleSelectOption(opt.letter)} disabled={isLocked}
                      sx={{ gridColumn: { xs: 'span 1', sm: `span ${gridSpan}` }, justifyContent: 'flex-start', textTransform: 'none', borderRadius: '7px', borderWidth: isSelected ? 2 : 1, py: 1.5, px: 1.5, fontWeight: 500, fontSize: '0.95rem', ...(isSelected ? { bgcolor: PAGE_PRIMARY, borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK, borderColor: PAGE_PRIMARY_DARK } } : {}) }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.25, bgcolor: isSelected ? '#fff' : alpha(theme.palette.grey[500], 0.12), color: isSelected ? PAGE_PRIMARY : 'text.secondary', fontWeight: 700 }}>{opt.letter}</Box>
                      <Typography component="span" sx={{ textAlign: 'left' }}>{opt.text}</Typography>
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
                    <Button key={label} variant={isSelected ? 'contained' : 'outlined'} onClick={() => handleSelectOption(label)} disabled={isLocked}
                      sx={{ minWidth: 120, justifyContent: 'center', textTransform: 'none', borderRadius: '7px', borderWidth: isSelected ? 2 : 1, py: 1.25, px: 1.5, fontWeight: 600, ...(isSelected ? { bgcolor: PAGE_PRIMARY, borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK, borderColor: PAGE_PRIMARY_DARK } } : {}) }}>
                      {label}
                    </Button>
                  )
                })}
              </Box>
            )}
            {(question.questionType === 'shortAnswer' || question.questionType === 'fillInBlanks' || question.questionType === 'descriptive') && (
              <Box sx={{ mb: 3 }}>
                <TextField fullWidth multiline={question.questionType === 'descriptive'} minRows={question.questionType === 'descriptive' ? 4 : 1} placeholder={question.placeholder} value={currentAnswer || ''} onChange={(e) => handleTextAnswerChange(e.target.value)} disabled={isLocked} sx={{ '& .MuiInputBase-root': { borderRadius: '7px', bgcolor: alpha(theme.palette.background.paper, 1) } }} />
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 1.25 }}>
              <Button variant="text" disabled={currentQuestionIndex === 0} onClick={handlePrevQuestion} startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '7px', justifyContent: 'flex-start', color: PAGE_PRIMARY, '&:hover': { bgcolor: alpha(PAGE_PRIMARY, 0.08) } }}>
                {isMobile ? 'Previous' : 'Previous question'}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                {!isLocked ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmitAnswer}
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
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNextQuestion}
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
                    {currentQuestionIndex === totalQuestions - 1 ? 'Finish scenario exam' : 'Next question'}
                  </Button>
                )}
              </Box>
            </Box>
            {isLocked && (
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LockIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Answer locked – you can review but not change it</Typography>
              </Box>
            )}

            {/* AI Tutor explanation — card matching reference UI (dark blue header, Correct Answer, Option breakdown, Exam Tips, points) */}
            {isLocked && showAiResponse && (
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alpha(PAGE_PRIMARY, 0.2),
                  overflow: 'hidden',
                  boxShadow: `0 4px 20px ${alpha(PAGE_PRIMARY, 0.08)}`,
                }}
              >
                {/* Dark blue header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                    bgcolor: PAGE_PRIMARY_DARK,
                    color: '#fff',
                  }}
                >
                  <PsychologyRoundedIcon sx={{ fontSize: 22 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    AI Clinical Reasoning Tutor
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: '#fff' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                    Detailed reasoning
                  </Typography>

                  {/* 14 AI Tutor points (dynamic from scenario_question_ai_tutor, shown in full at once) */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
                    {AI_TUTOR_POINTS.map((point, idx) => {
                      const headingText = `${idx + 1}. ${point.title}`
                      const bodyText = (currentAiTutor && currentAiTutor[point.key]) || AI_TUTOR_LOREM[point.key] || ''
                      const IconComp = point.icon
                      const isPositive = ['validation', 'keyClues', 'examinerLogic', 'managementLadder', 'guidelineJustification', 'safetyNetting', 'examSummary', 'oneScreenMap'].includes(point.key)
                      const isTrap = ['missingClues', 'trapAlert'].includes(point.key)
                      const hasContent = headingText || bodyText

                      if (!hasContent) return null

                      return (
                        <Box
                          key={point.key}
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: isTrap ? alpha(theme.palette.error.main, 0.2) : alpha(PAGE_PRIMARY, 0.12),
                            bgcolor: isTrap ? alpha(theme.palette.error.main, 0.04) : isPositive ? alpha(theme.palette.success.main, 0.04) : alpha(PAGE_PRIMARY, 0.03),
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: isTrap ? alpha(theme.palette.error.main, 0.12) : isPositive ? alpha(theme.palette.success.main, 0.12) : alpha(PAGE_PRIMARY, 0.1),
                                color: isTrap ? theme.palette.error.main : isPositive ? theme.palette.success.main : PAGE_PRIMARY,
                                flexShrink: 0,
                              }}
                            >
                              {isTrap ? <CancelRoundedIcon sx={{ fontSize: 18 }} /> : IconComp && <IconComp sx={{ fontSize: 18 }} />}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isTrap ? theme.palette.error.dark : PAGE_PRIMARY, mb: 0.5, fontSize: '0.8125rem', lineHeight: 1.4 }}>
                                {headingText}
                              </Typography>
                              {bodyText && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
                                  {bodyText}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Paper>
            )}
          </Paper>
        )}

        {viewMode === 'summary' && (
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.2), bgcolor: alpha(PAGE_PRIMARY, 0.03) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '7px', bgcolor: alpha(PAGE_PRIMARY, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MenuBookRoundedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Scenario exam {examNo} performance</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Review your score and choose what to do next.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>Final score</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: getScoreColor(percentage), lineHeight: 1 }}>{percentage}%</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <LinearProgress variant="determinate" value={percentage} sx={{ height: 10, borderRadius: '7px', bgcolor: alpha(theme.palette.grey[400], 0.25), '& .MuiLinearProgress-bar': { borderRadius: '7px', bgcolor: getScoreColor(percentage) } }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
                You can repeat this scenario exam to strengthen weak areas, or go back to the scenario exams list and move to the next topic.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1.5, flexWrap: isMobile ? 'nowrap' : 'wrap', width: isMobile ? '100%' : 'auto' }}>
                <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '7px', width: isMobile ? '100%' : 'auto', borderColor: PAGE_PRIMARY, color: PAGE_PRIMARY, '&:hover': { borderColor: PAGE_PRIMARY_DARK, bgcolor: alpha(PAGE_PRIMARY, 0.08) } }}>
                  Back to scenario exams
                </Button>
                <Button variant="contained" endIcon={<HistoryRoundedIcon sx={{ fontSize: 20 }} />} onClick={() => navigate('/user-dashboard/scenarios-history')} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '7px', width: isMobile ? '100%' : 'auto', bgcolor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK } }}>
                  Scenarios history
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Rating dialog — shown when user clicks Finish scenario exam on last question */}
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
                Rate this scenario exam
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                {courseTitle} – Scenario exam {examNo}
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
              name="scenario-rating"
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
              placeholder="Share your experience with this scenario exam..."
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

export default ScenarioPracticeDetails
