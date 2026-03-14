import { useState, useMemo, useEffect } from 'react'
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
  Chip,
  Autocomplete,
  Switch,
  FormControlLabel,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import EuroRoundedIcon from '@mui/icons-material/EuroRounded'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'
import GavelIcon from '@mui/icons-material/Gavel'
import BarChartIcon from '@mui/icons-material/BarChart'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import TouchAppRoundedIcon from '@mui/icons-material/TouchAppRounded'
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import CodeRoundedIcon from '@mui/icons-material/CodeRounded'
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded'
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded'
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded'
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded'
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded'
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded'
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

const ICON_OPTIONS = [
  { value: 'psychology', label: 'Psychology (AI / Reasoning)', Icon: PsychologyIcon },
  { value: 'psychologyAlt', label: 'Psychology Alt', Icon: PsychologyAltRoundedIcon },
  { value: 'assignment', label: 'Assignment (Exams / Tasks)', Icon: AssignmentIcon },
  { value: 'timeline', label: 'Timeline (Plans / Progress)', Icon: TimelineIcon },
  { value: 'gavel', label: 'Gavel (Ethics / Rules)', Icon: GavelIcon },
  { value: 'barChart', label: 'Bar Chart (Analytics)', Icon: BarChartIcon },
  { value: 'analytics', label: 'Analytics', Icon: AnalyticsRoundedIcon },
  { value: 'groups', label: 'Groups (Peer / Collab)', Icon: GroupsIcon },
  { value: 'localHospital', label: 'Local Hospital (Clinical)', Icon: LocalHospitalIcon },
  { value: 'medicalServices', label: 'Medical Services', Icon: MedicalServicesRoundedIcon },
  { value: 'vaccines', label: 'Vaccines', Icon: VaccinesRoundedIcon },
  { value: 'monitorHeart', label: 'Monitor Heart', Icon: MonitorHeartRoundedIcon },
  { value: 'school', label: 'School / Education', Icon: SchoolRoundedIcon },
  { value: 'menuBook', label: 'Menu Book / Reading', Icon: MenuBookRoundedIcon },
  { value: 'libraryBooks', label: 'Library Books', Icon: LibraryBooksRoundedIcon },
  { value: 'quiz', label: 'Quiz / Assessment', Icon: QuizRoundedIcon },
  { value: 'support', label: 'Support / Help', Icon: SupportRoundedIcon },
  { value: 'campaign', label: 'Campaign / Outreach', Icon: CampaignRoundedIcon },
  { value: 'science', label: 'Science', Icon: ScienceRoundedIcon },
  { value: 'biotech', label: 'Biotech', Icon: BiotechRoundedIcon },
  { value: 'fitnessCenter', label: 'Fitness Center', Icon: FitnessCenterRoundedIcon },
  { value: 'selfImprovement', label: 'Self Improvement', Icon: SelfImprovementRoundedIcon },
  { value: 'star', label: 'Star / Featured', Icon: StarRoundedIcon },
  { value: 'emojiEvents', label: 'Achievements / Awards', Icon: EmojiEventsRoundedIcon },
  { value: 'speed', label: 'Speed / Performance', Icon: SpeedRoundedIcon },
  { value: 'touchApp', label: 'Touch / Interactive', Icon: TouchAppRoundedIcon },
  { value: 'recordVoiceOver', label: 'Voice / Speaking', Icon: RecordVoiceOverRoundedIcon },
  { value: 'translate', label: 'Translate / Language', Icon: TranslateRoundedIcon },
  { value: 'code', label: 'Code / Developer', Icon: CodeRoundedIcon },
  { value: 'calculate', label: 'Calculate / Numbers', Icon: CalculateRoundedIcon },
  { value: 'lightbulb', label: 'Lightbulb / Ideas', Icon: LightbulbRoundedIcon },
  { value: 'precisionManufacturing', label: 'Precision / Tools', Icon: PrecisionManufacturingRoundedIcon },
  { value: 'autoAwesome', label: 'Auto Awesome / AI', Icon: AutoAwesomeRoundedIcon },
  { value: 'workspacePremium', label: 'Workspace Premium', Icon: WorkspacePremiumRoundedIcon },
  { value: 'category', label: 'Category', Icon: CategoryRoundedIcon },
  { value: 'dashboardCustomize', label: 'Dashboard Customize', Icon: DashboardCustomizeRoundedIcon },
  { value: 'extension', label: 'Extension / Add-on', Icon: ExtensionRoundedIcon },
]

const DURATION_TYPE_OPTIONS = ['Week', 'Month']
const DURATION_VALUES = [1, 2, 4, 5, 6, 7, 8, 9, 10]
const PER_DAY_EXAMS_OPTIONS = [1, 2, 3]

function AdminAddCourse() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { showToast } = useToast()

  const editMock = location.state?.mock || null
  const isEdit = !!editMock

  // Dropdown data from API
  const [examTypes, setExamTypes] = useState([])
  const [difficultyLevels, setDifficultyLevels] = useState([])
  const [topicFocusOptions, setTopicFocusOptions] = useState([])
  const [dropdownsLoading, setDropdownsLoading] = useState(true)

  // Form state
  const [examTypeId, setExamTypeId] = useState(editMock?.exam_type_id ? String(editMock.exam_type_id) : '')
  const [difficultyLevelId, setDifficultyLevelId] = useState(editMock?.difficulty_level_id ? String(editMock.difficulty_level_id) : '')
  const [topicFocus, setTopicFocus] = useState(editMock?.topic_focuses || [])
  const [durationType, setDurationType] = useState(editMock?.duration_type || '')
  const [duration, setDuration] = useState(editMock?.duration ? String(editMock.duration) : '')
  const [perDayExams, setPerDayExams] = useState(editMock?.per_day_exams ? String(editMock.per_day_exams) : '')
  const [iconKey, setIconKey] = useState(editMock?.icon_key || '')
  const [courseTitle, setCourseTitle] = useState(editMock?.title || '')
  const [description, setDescription] = useState(editMock?.description || '')
  const [status, setStatus] = useState(editMock?.status === 'Active' || editMock?.status === 'Inactive' ? editMock.status : 'Active')
  // Pricing
  const [isPaid, setIsPaid] = useState(editMock?.is_paid ?? false)
  const [priceEur, setPriceEur] = useState(editMock?.price_eur != null ? String(editMock.price_eur) : '')

  // Field-level errors from server
  const [errors, setErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)

  const totalExams = useMemo(() => {
    if (!durationType || !duration || !perDayExams) return ''
    const d = Number(duration)
    const p = Number(perDayExams)
    const daysPerUnit = durationType === 'Week' ? 7 : 30
    return d * daysPerUnit * p
  }, [durationType, duration, perDayExams])

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      setDropdownsLoading(true)
      try {
        const [etRes, dlRes, tfRes] = await Promise.all([
          apiClient('/exam-types?apply_filters=1&status=Active&per_page=100', 'GET'),
          apiClient('/difficulty-levels?apply_filters=1&status=Active&per_page=100', 'GET'),
          apiClient('/topic-focuses?apply_filters=1&status=Active&per_page=100', 'GET'),
        ])
        if (etRes.ok && etRes.data?.success) setExamTypes(etRes.data.data?.exam_types || [])
        if (dlRes.ok && dlRes.data?.success) setDifficultyLevels(dlRes.data.data?.difficulty_levels || [])
        if (tfRes.ok && tfRes.data?.success) setTopicFocusOptions(tfRes.data.data?.topic_focuses || [])
      } catch { /* silently fail */ }
      finally { setDropdownsLoading(false) }
    }
    fetchDropdowns()
  }, [])

  const clearError = (field) => setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })

  const handleTopicChange = (_, newValue) => {
    setTopicFocus(newValue)
    clearError('topic_focus_ids')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitLoading) return

    setErrors({})
    setSubmitLoading(true)

    const payload = {
      exam_type_id: examTypeId || null,
      difficulty_level_id: difficultyLevelId || null,
      icon_key: iconKey || null,
      title: courseTitle.trim(),
      description: description.trim() || null,
      duration_type: durationType,
      duration: Number(duration),
      per_day_exams: Number(perDayExams),
      topic_focus_ids: topicFocus.map((t) => t.id),
      is_paid: isPaid,
      price_eur: isPaid ? (parseFloat(String(priceEur).replace(',', '.')) || null) : null,
      ...(isEdit && { status }),
    }

    try {
      const path = isEdit ? `/mocks/${editMock.id}` : '/mocks'
      const { ok, data } = await apiClient(path, 'POST', payload)

      if (!ok || !data?.success) {
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors)
        } else {
          showToast(data?.message || 'Unable to save mock exam. Please try again.', 'error')
        }
        return
      }

      showToast(isEdit ? 'Mock exam updated successfully.' : 'Mock exam created successfully.', 'success')
      navigate('/admin/courses/courses')
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setSubmitLoading(false)
    }
  }

  const firstError = (field) => {
    const e = errors[field]
    if (!e) return ''
    return Array.isArray(e) ? e[0] : e
  }

  return (
    <Box sx={{ ...keyframes, width: '100%', minWidth: 0, maxWidth: 1000, mx: 'auto', overflowX: 'hidden' }}>
      <Box sx={{ mb: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <IconButton
          onClick={() => navigate('/admin/courses/courses')}
          size={isMobile ? 'medium' : 'large'}
          sx={{ color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08), borderRadius: '7px', '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) } }}
          aria-label="Back to mocks exams"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {isEdit ? 'Edit Mock Exam' : 'Add Mock Exam'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {isEdit ? 'Update this mock exam' : 'Create a new mock exam'}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper, boxShadow: { xs: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`, sm: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.04)}` } }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY, mx: 'auto', mb: 1.5 }}>
            <SchoolRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {isEdit ? 'Edit Mock Exam' : 'Add Mock Exam'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {isEdit ? 'Update mock exam details' : 'Create a new mock exam'}
          </Typography>
        </Box>

        {/* Exam type & Difficulty level */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }} error={!!firstError('exam_type_id')}>
            <InputLabel id="exam-type-label" shrink>Exam type</InputLabel>
            <Select
              labelId="exam-type-label"
              value={examTypeId}
              label="Exam type"
              onChange={(e) => { setExamTypeId(e.target.value); clearError('exam_type_id') }}
              notched
              disabled={dropdownsLoading}
              startAdornment={dropdownsLoading ? <AutorenewIcon sx={{ ml: 1, mr: 0.5, color: ADMIN_PRIMARY, fontSize: 20, animation: 'spin 0.8s linear infinite' }} /> : null}
            >
              <MenuItem value=""><em>Select exam type</em></MenuItem>
              {examTypes.map((et) => <MenuItem key={et.id} value={String(et.id)}>{et.name}</MenuItem>)}
            </Select>
            {firstError('exam_type_id') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('exam_type_id')}</Typography>
              </Box>
            )}
          </FormControl>
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }} error={!!firstError('difficulty_level_id')}>
            <InputLabel id="difficulty-label" shrink>Difficulty level</InputLabel>
            <Select
              labelId="difficulty-label"
              value={difficultyLevelId}
              label="Difficulty level"
              onChange={(e) => { setDifficultyLevelId(e.target.value); clearError('difficulty_level_id') }}
              notched
              disabled={dropdownsLoading}
              startAdornment={dropdownsLoading ? <AutorenewIcon sx={{ ml: 1, mr: 0.5, color: ADMIN_PRIMARY, fontSize: 20, animation: 'spin 0.8s linear infinite' }} /> : null}
            >
              <MenuItem value=""><em>Select difficulty</em></MenuItem>
              {difficultyLevels.map((dl) => <MenuItem key={dl.id} value={String(dl.id)}>{dl.name}</MenuItem>)}
            </Select>
            {firstError('difficulty_level_id') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('difficulty_level_id')}</Typography>
              </Box>
            )}
          </FormControl>
        </Box>

        {/* Topic / focus */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            options={topicFocusOptions}
            getOptionLabel={(opt) => opt.name || ''}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            value={topicFocus}
            onChange={handleTopicChange}
            filterSelectedOptions
            loading={dropdownsLoading}
            disabled={dropdownsLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '7px', bgcolor: 'background.paper', minHeight: 56,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.5) },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: ADMIN_PRIMARY },
                ...(firstError('topic_focus_ids') && { '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.error.main } }),
              },
              '& .MuiInputLabel-outlined': { color: theme.palette.text.secondary, fontWeight: 600, '&.Mui-focused': { color: ADMIN_PRIMARY }, ...(firstError('topic_focus_ids') && { color: theme.palette.error.main }) },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Topic / focus"
                placeholder={topicFocus.length === 0 ? 'Search and select…' : ''}
                error={!!firstError('topic_focus_ids')}
                InputProps={{ ...params.InputProps, endAdornment: (<>{dropdownsLoading && <AutorenewIcon sx={{ color: ADMIN_PRIMARY, fontSize: 18, animation: 'spin 0.8s linear infinite' }} />}{params.InputProps.endAdornment}</>) }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={option.id} label={option.name} size="small" sx={{ height: 26, borderRadius: '7px' }} {...getTagProps({ index })} />
              ))
            }
          />
          {firstError('topic_focus_ids') && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
              <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
              <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('topic_focus_ids')}</Typography>
            </Box>
          )}
        </Box>

        {/* Duration */}
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1 }}>Duration</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }} error={!!firstError('duration_type')}>
            <InputLabel id="duration-type-label" shrink>Type</InputLabel>
            <Select labelId="duration-type-label" value={durationType} label="Type" onChange={(e) => { setDurationType(e.target.value); clearError('duration_type') }} notched>
              {DURATION_TYPE_OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
            {firstError('duration_type') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('duration_type')}</Typography>
              </Box>
            )}
          </FormControl>
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }} error={!!firstError('duration')}>
            <InputLabel id="duration-label" shrink>Duration</InputLabel>
            <Select labelId="duration-label" value={duration} label="Duration" onChange={(e) => { setDuration(e.target.value); clearError('duration') }} notched>
              {DURATION_VALUES.map((v) => <MenuItem key={v} value={String(v)}>{v}</MenuItem>)}
            </Select>
            {firstError('duration') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('duration')}</Typography>
              </Box>
            )}
          </FormControl>
        </Box>

        {/* Mock exams per day & total */}
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1 }}>Mock exams</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }} error={!!firstError('per_day_exams')}>
            <InputLabel id="per-day-label" shrink>Per day mock exams</InputLabel>
            <Select labelId="per-day-label" value={perDayExams} label="Per day mock exams" onChange={(e) => { setPerDayExams(e.target.value); clearError('per_day_exams') }} notched>
              {PER_DAY_EXAMS_OPTIONS.map((v) => <MenuItem key={v} value={String(v)}>{v}</MenuItem>)}
            </Select>
            {firstError('per_day_exams') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('per_day_exams')}</Typography>
              </Box>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Total mock exams"
            value={totalExams}
            variant="outlined"
            size="medium"
            InputProps={{ readOnly: true }}
            sx={{ ...inputSx(theme), '& .MuiInputBase-input': { color: 'text.primary', fontWeight: 600 } }}
          />
        </Box>

        {/* Pricing Model */}
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1 }}>Pricing model</Typography>
        <Box sx={{ mb: 2, p: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.15), bgcolor: alpha(ADMIN_PRIMARY, 0.02) }}>
          <FormControlLabel
            control={
              <Switch
                checked={isPaid}
                onChange={(e) => { setIsPaid(e.target.checked); if (!e.target.checked) setPriceEur(''); clearError('is_paid'); clearError('price_eur') }}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: ADMIN_PRIMARY }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ADMIN_PRIMARY } }}
              />
            }
            label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{isPaid ? 'Paid' : 'Free'}</Typography>}
          />
          {isPaid && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                label="Price (€)"
                value={priceEur}
                onChange={(e) => { setPriceEur(e.target.value); clearError('price_eur') }}
                placeholder="0.00"
                variant="outlined"
                size="medium"
                error={!!firstError('price_eur')}
                helperText={
                  firstError('price_eur') ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                      <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('price_eur')}</Typography>
                    </Box>
                  ) : null
                }
                sx={{ ...inputSx(theme), '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <InputAdornment position="start"><EuroRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} /></InputAdornment> }}
              />
            </Box>
          )}
        </Box>

        {/* Icon picker */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <SchoolRoundedIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: ADMIN_PRIMARY, fontSize: 22, pointerEvents: 'none' }} />
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 }, '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }} error={!!firstError('icon_key')}>
            <InputLabel id="icon-label" shrink>Icon</InputLabel>
            <Select labelId="icon-label" value={iconKey} label="Icon" onChange={(e) => { setIconKey(e.target.value); clearError('icon_key') }} notched>
              <MenuItem value=""><em>Select icon</em></MenuItem>
              {ICON_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <opt.Icon sx={{ color: ADMIN_PRIMARY, fontSize: 20 }} />{opt.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {firstError('icon_key') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, ml: 1.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('icon_key')}</Typography>
              </Box>
            )}
          </FormControl>
        </Box>

        {/* Mock exam title */}
        <TextField
          fullWidth
          label="Mock exam title"
          value={courseTitle}
          onChange={(e) => { setCourseTitle(e.target.value); clearError('title') }}
          placeholder="e.g. Full UKMLA Reasoning Mock Exam"
          variant="outlined"
          size="medium"
          error={!!firstError('title')}
          helperText={
            firstError('title') ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('title')}</Typography>
              </Box>
            ) : null
          }
          sx={{ ...inputSx(theme), mb: 2, '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><TitleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} /></InputAdornment> }}
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); clearError('description') }}
          placeholder="Brief description of the mock exam"
          variant="outlined"
          size="medium"
          multiline
          minRows={4}
          maxRows={8}
          error={!!firstError('description')}
          helperText={
            firstError('description') ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>{firstError('description')}</Typography>
              </Box>
            ) : null
          }
          sx={{ ...inputSx(theme), mb: isEdit ? 2 : 3, '& .MuiOutlinedInput-root': { alignItems: 'flex-start' }, '& .MuiInputLabel-outlined.Mui-error': { color: theme.palette.error.main } }}
          InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}><DescriptionRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} /></InputAdornment> }}
        />

        {/* Status (edit mode only) */}
        {isEdit && (
          <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), mb: 3 }}>
            <InputLabel id="status-label" shrink>Status</InputLabel>
            <Select labelId="status-label" value={status} label="Status" onChange={(e) => setStatus(e.target.value)} notched>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/courses/courses')}
            disabled={submitLoading}
            sx={{ borderColor: alpha(theme.palette.grey[400], 0.8), color: 'text.secondary', borderRadius: '7px', fontWeight: 600, px: 2.5, py: 1.25, textTransform: 'none', '&:hover': { borderColor: ADMIN_PRIMARY, color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.06) } }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitLoading}
            startIcon={submitLoading
              ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff' }} />
              : <SaveRoundedIcon sx={{ fontSize: 22 }} />}
            sx={{ py: 1.5, px: 3, fontWeight: 700, fontSize: '1rem', textTransform: 'none', borderRadius: '7px', background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`, boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`, '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_DARK} 0%, ${ADMIN_PRIMARY} 100%)`, boxShadow: `0 6px 20px ${alpha(ADMIN_PRIMARY, 0.45)}` }, '&.Mui-disabled': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`, color: '#fff', opacity: 0.85 } }}
          >
            {submitLoading ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Mock Exam' : 'Save Mock Exam')}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddCourse
