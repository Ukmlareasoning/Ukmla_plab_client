import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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
  OutlinedInput,
  Chip,
  Autocomplete,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
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

const EXAM_TYPE_OPTIONS = ['UKMLA', 'PLAB', 'MDCAT']
const DIFFICULTY_OPTIONS = ['Foundation', 'Core', 'Advanced']
const TOPIC_OPTIONS = ['Reasoning', 'Ethics', 'Patient Safety']
const DURATION_TYPE_OPTIONS = ['Week', 'Month']
const DURATION_VALUES = [1, 2, 4, 5, 6, 7, 8, 9, 10]
const PER_DAY_LECTURES_OPTIONS = [1, 2, 3]

function AdminAddCourse() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [examType, setExamType] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [topicFocus, setTopicFocus] = useState([])
  const [durationType, setDurationType] = useState('')
  const [duration, setDuration] = useState('')
  const [perDayLectures, setPerDayLectures] = useState('')
  const [iconKey, setIconKey] = useState('')
  const [courseTitle, setCourseTitle] = useState('')
  const [description, setDescription] = useState('')

  const totalLectures = useMemo(() => {
    if (!durationType || !duration || !perDayLectures) return ''
    const d = Number(duration)
    const p = Number(perDayLectures)
    const daysPerUnit = durationType === 'Week' ? 7 : 30
    return d * daysPerUnit * p
  }, [durationType, duration, perDayLectures])

  const handleTopicChange = (_event, newValue) => {
    setTopicFocus(newValue)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: submit to API
    navigate('/admin/courses/courses')
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
          onClick={() => navigate('/admin/courses/courses')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.15) },
          }}
          aria-label="Back to mocks exams"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Add Mock Exam
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Create a new mock exam
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
            <SchoolRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography component="h1" variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Add Mock Exam
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create a new mock exam
          </Typography>
        </Box>

        {/* Exam type & Difficulty level — two columns on sm+ */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth required size="medium" sx={selectSx(theme)}>
            <InputLabel id="exam-type-label" shrink>Exam type</InputLabel>
            <Select labelId="exam-type-label" value={examType} label="Exam type" onChange={(e) => setExamType(e.target.value)} notched>
              {EXAM_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required size="medium" sx={selectSx(theme)}>
            <InputLabel id="difficulty-label" shrink>Difficulty level</InputLabel>
            <Select labelId="difficulty-label" value={difficultyLevel} label="Difficulty level" onChange={(e) => setDifficultyLevel(e.target.value)} notched>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Topic / focus — searchable multi-select with remove (X) on each chip */}
        <Autocomplete
          multiple
          options={TOPIC_OPTIONS}
          value={topicFocus}
          onChange={handleTopicChange}
          filterSelectedOptions
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '7px',
              bgcolor: 'background.paper',
              minHeight: 56,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(ADMIN_PRIMARY, 0.5),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: ADMIN_PRIMARY,
              },
            },
            '& .MuiInputLabel-outlined': {
              color: theme.palette.text.secondary,
              fontWeight: 600,
              '&.Mui-focused': { color: ADMIN_PRIMARY },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Topic / focus"
              placeholder={topicFocus.length === 0 ? 'Search and select…' : ''}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option}
                label={option}
                size="small"
                sx={{ height: 26, borderRadius: '7px' }}
                {...getTagProps({ index })}
              />
            ))
          }
        />

        {/* Duration: Type & Duration */}
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1 }}>Duration</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth required size="medium" sx={selectSx(theme)}>
            <InputLabel id="duration-type-label" shrink>Type</InputLabel>
            <Select labelId="duration-type-label" value={durationType} label="Type" onChange={(e) => setDurationType(e.target.value)} notched>
              {DURATION_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required size="medium" sx={selectSx(theme)}>
            <InputLabel id="duration-label" shrink>Duration</InputLabel>
            <Select labelId="duration-label" value={duration} label="Duration" onChange={(e) => setDuration(e.target.value)} notched>
              {DURATION_VALUES.map((v) => (
                <MenuItem key={v} value={String(v)}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Exams: Per day & Total (read-only) */}
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1 }}>Exams</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
          <FormControl fullWidth required size="medium" sx={selectSx(theme)}>
            <InputLabel id="per-day-label" shrink>Per day exams</InputLabel>
            <Select labelId="per-day-label" value={perDayLectures} label="Per day exams" onChange={(e) => setPerDayLectures(e.target.value)} notched>
              {PER_DAY_LECTURES_OPTIONS.map((v) => (
                <MenuItem key={v} value={String(v)}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Total exams"
            value={totalLectures}
            variant="outlined"
            size="medium"
            InputProps={{ readOnly: true }}
            sx={{ ...inputSx(theme), '& .MuiInputBase-input': { color: 'text.primary', fontWeight: 600 } }}
          />
        </Box>

        {/* Icon */}
        <Box sx={{ position: 'relative', mb: 2 }}>
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
            <InputLabel id="icon-label" shrink>Icon</InputLabel>
            <Select labelId="icon-label" value={iconKey} label="Icon" onChange={(e) => setIconKey(e.target.value)} notched>
              {ICON_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <opt.Icon sx={{ color: ADMIN_PRIMARY, fontSize: 20 }} />
                    {opt.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          required
          label="Mock exam title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="e.g. Full UKMLA Reasoning Mock Exam"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(theme), mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
        />

        <TextField
          fullWidth
          required
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the mock exam"
          variant="outlined"
          size="medium"
          multiline
          minRows={4}
          maxRows={8}
          sx={{
            ...inputSx(theme),
            mb: 3,
            '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                <DescriptionRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/courses/courses')}
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
            Cancel
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
            Save Mock Exam
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddCourse
