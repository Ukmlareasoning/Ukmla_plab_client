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

const buildLectureQuestions = (lectureNo) => {
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
        { letter: 'E', text: 'Echocardiogram' },
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

function ScenarioPracticeDetails() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const lectureNo = location.state?.lectureNo || 1
  const courseTitle = location.state?.courseTitle || 'Scenario exam practice'

  const questions = useMemo(() => buildLectureQuestions(lectureNo), [lectureNo])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [maxLockedIndex, setMaxLockedIndex] = useState(-1)
  const [viewMode, setViewMode] = useState('questions')
  const [percentage, setPercentage] = useState(0)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [formStars, setFormStars] = useState(0)
  const [formComment, setFormComment] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [showAiResponse, setShowAiResponse] = useState(false)

  // AI Tutor typing: per-question, per-point word count (word-by-word reveal)
  const [aiRevealedWords, setAiRevealedWords] = useState(() => ({}))
  const WORDS_PER_TICK = 1
  const TYPING_INTERVAL_MS = 65

  const getScoreColor = (pct) =>
    pct >= 80 ? PAGE_PRIMARY : pct >= 60 ? theme.palette.warning.main : theme.palette.error.main

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
    setIsAiTyping(true)
    setShowAiResponse(true)
  }

  const handleSkipAiResponse = () => {
    setIsAiTyping(false)
    setShowAiResponse(false)
    // To immediately show full text when skipping
    const qIdx = currentQuestionIndex
    setAiRevealedWords((prev) => {
      const arr = [...(prev[qIdx] || Array(AI_TUTOR_POINTS.length).fill(0))]
      for (let i = 0; i < AI_TUTOR_POINTS.length; i++) {
        arr[i] = getPointWordCount(AI_TUTOR_POINTS[i], i)
      }
      return { ...prev, [qIdx]: arr }
    })
    typingDoneRef.current = true
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

  const question = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const currentAnswer = answers[currentQuestionIndex]
  const isLocked = currentQuestionIndex <= maxLockedIndex

  // Combined heading + body word count per point (heading types first, then body)
  const getPointWordCount = (point, idx) => {
    const headingText = `${idx + 1}. ${point.title}`
    const bodyText = AI_TUTOR_LOREM[point.key] || ''
    const combined = (headingText + ' ' + bodyText).trim().split(' ').filter(Boolean)
    return combined.length
  }

  // Word-by-word typing effect for AI Tutor when answer is locked (heading + body per point)
  const typingDoneRef = useRef(false)
  useEffect(() => {
    if (!isLocked) return
    typingDoneRef.current = false
    const qIdx = currentQuestionIndex
    setAiRevealedWords((prev) => {
      if (Array.isArray(prev[qIdx])) return prev
      return { ...prev, [qIdx]: Array(AI_TUTOR_POINTS.length).fill(0) }
    })
    const timer = setInterval(() => {
      if (typingDoneRef.current) return
      setAiRevealedWords((prev) => {
        const arr = prev[qIdx] ? [...prev[qIdx]] : Array(AI_TUTOR_POINTS.length).fill(0)
        for (let i = 0; i < AI_TUTOR_POINTS.length; i++) {
          const maxWords = getPointWordCount(AI_TUTOR_POINTS[i], i)
          if (arr[i] < maxWords) {
            arr[i] = Math.min(arr[i] + WORDS_PER_TICK, maxWords)
            return { ...prev, [qIdx]: arr }
          }
        }
        setIsAiTyping(false)
        typingDoneRef.current = true
        return prev
      })
    }, TYPING_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [isLocked, currentQuestionIndex])

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
              Scenario exam {lectureNo} practice – questions appear one by one.
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

        {viewMode === 'questions' && (
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
                {isLocked && isAiTyping && (
                  <Button
                    variant="outlined"
                    onClick={handleSkipAiResponse}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '7px',
                      borderColor: PAGE_PRIMARY,
                      color: PAGE_PRIMARY,
                      '&:hover': { borderColor: PAGE_PRIMARY_DARK, bgcolor: alpha(PAGE_PRIMARY, 0.08) },
                    }}
                  >
                    Skip AI Response
                  </Button>
                )}

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
                    disabled={isAiTyping}
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
                  {/* Correct Answer Selected — green block */}
                  <Box
                    sx={{
                      mb: 2.5,
                      p: 2,
                      borderRadius: '10px',
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                      border: '1px solid',
                      borderColor: alpha(theme.palette.success.main, 0.3),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <CheckCircleRoundedIcon sx={{ color: theme.palette.success.main, fontSize: 28, mt: 0.25 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                          Correct Answer Selected
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                          {AI_CORRECT_ANSWER_FEEDBACK}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                          {['STEMI', 'Ischaemic chest pain', 'Clear ST elevation', 'Symptoms < 12 hours'].map((tag) => (
                            <Chip key={tag} label={tag} size="small" sx={{ height: 24, borderRadius: '6px', fontSize: '0.7rem', bgcolor: alpha(theme.palette.info.main, 0.12), color: theme.palette.info.dark }} />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Option-by-Option Breakdown */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: PAGE_PRIMARY, mb: 1.25, fontSize: '0.875rem' }}>
                    Option-by-Option Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2.5 }}>
                    {AI_OPTION_BREAKDOWN.map((opt) => (
                      <Box
                        key={opt.letter}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          py: 0.75,
                          px: 1.25,
                          borderRadius: '8px',
                          bgcolor: opt.correct ? alpha(theme.palette.success.main, 0.06) : alpha(theme.palette.grey[500], 0.06),
                          border: '1px solid',
                          borderColor: opt.correct ? alpha(theme.palette.success.main, 0.25) : 'transparent',
                        }}
                      >
                        {opt.correct ? (
                          <CheckCircleRoundedIcon sx={{ color: theme.palette.success.main, fontSize: 20, flexShrink: 0 }} />
                        ) : (
                          <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: theme.palette.error.main, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                            {opt.letter}
                          </Box>
                        )}
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: opt.correct ? 600 : 400 }}>
                          {opt.letter}: {opt.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Exam Tips & Review — Correct, PEARL, Avoid Traps */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: alpha(PAGE_PRIMARY, 0.15),
                      bgcolor: alpha(PAGE_PRIMARY, 0.02),
                      mb: 2.5,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}>
                      Exam Tips & Review
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                      <CheckCircleRoundedIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Correct answer: Gold standard if available rapidly.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        py: 1.25,
                        px: 1.5,
                        borderRadius: '8px',
                        bgcolor: alpha(theme.palette.warning.main, 0.12),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.warning.main, 0.35),
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        mb: 1.25,
                      }}
                    >
                      <BoltRoundedIcon sx={{ color: theme.palette.warning.dark, fontSize: 20, mt: 0.25, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.warning.dark, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          UKMLA PEARL
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, mt: 0.25 }}>
                          {AI_PEARL_TEXT}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', mb: 0.75 }}>
                      Avoid These Traps
                    </Typography>
                    {AI_AVOID_TRAPS.map((trap) => (
                      <Box key={trap} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                        <CancelRoundedIcon sx={{ color: theme.palette.error.main, fontSize: 18, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{trap}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Management Ladder */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: PAGE_PRIMARY, mb: 1.25, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <AccountTreeRoundedIcon sx={{ fontSize: 18 }} />
                      Immediate / First-Line
                    </Typography>
                    {AI_MANAGEMENT_STEPS.map((step) => (
                      <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 0.5 }}>
                        <CheckCircleRoundedIcon sx={{ color: theme.palette.success.main, fontSize: 20, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>{step}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Guideline Justification */}
                  <Box
                    sx={{
                      py: 1.25,
                      px: 1.5,
                      borderRadius: '8px',
                      bgcolor: alpha(PAGE_PRIMARY, 0.06),
                      borderLeft: '4px solid',
                      borderLeftColor: PAGE_PRIMARY,
                      mb: 2.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: PAGE_PRIMARY, display: 'block', mb: 0.5 }}>
                      Guideline Justification
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      {AI_GUIDELINE_TEXT}
                    </Typography>
                  </Box>

                  {/* Divider line before detailed points */}
                  <Box sx={{ borderTop: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.12), pt: 2, mt: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                      Detailed reasoning
                    </Typography>
                  </Box>

                  {/* 14–15 AI Tutor points (existing typing effect) */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
                    {AI_TUTOR_POINTS.map((point, idx) => {
                      const headingText = `${idx + 1}. ${point.title}`
                      const bodyText = AI_TUTOR_LOREM[point.key] || ''
                      const headingWords = headingText.trim().split(' ').filter(Boolean)
                      const bodyWords = bodyText.trim().split(' ').filter(Boolean)
                      const combinedWords = [...headingWords, ...bodyWords]
                      const headingWordCount = headingWords.length
                      const revealed = aiRevealedWords[currentQuestionIndex]?.[idx] ?? 0
                      const visibleWords = combinedWords.slice(0, revealed)
                      const headingVisible = visibleWords.slice(0, headingWordCount)
                      const bodyVisible = visibleWords.slice(headingWordCount)
                      const isStillTyping = revealed < combinedWords.length
                      const IconComp = point.icon
                      const isPositive = ['validation', 'keyClues', 'examinerLogic', 'managementLadder', 'guidelineJustification', 'safetyNetting', 'examSummary', 'oneScreenMap'].includes(point.key)
                      const isTrap = ['missingClues', 'trapAlert'].includes(point.key)

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
                              {headingVisible.length > 0 && (
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isTrap ? theme.palette.error.dark : PAGE_PRIMARY, mb: 0.5, fontSize: '0.8125rem', lineHeight: 1.4 }}>
                                  {headingVisible.join(' ')}
                                  {isStillTyping && bodyVisible.length === 0 && (
                                    <Box component="span" sx={{ display: 'inline-block', width: 2, height: '1em', bgcolor: PAGE_PRIMARY, ml: 0.25, verticalAlign: 'middle', animation: 'blink 1s step-end infinite', '@keyframes blink': { '50%': { opacity: 0 } } }} />
                                  )}
                                </Typography>
                              )}
                              {bodyVisible.length > 0 && (
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
                                  {bodyVisible.join(' ')}
                                  {isStillTyping && (
                                    <Box component="span" sx={{ display: 'inline-block', width: 2, height: '1em', bgcolor: PAGE_PRIMARY, ml: 0.25, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
                                  )}
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
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Scenario exam {lectureNo} performance</Typography>
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
                {courseTitle} – Scenario exam {lectureNo}
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
