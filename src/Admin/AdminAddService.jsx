import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import LabelRoundedIcon from '@mui/icons-material/LabelRounded'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'
import GavelIcon from '@mui/icons-material/Gavel'
import BarChartIcon from '@mui/icons-material/BarChart'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
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
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

// Admin primary (#384D84 — no green)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

// Local keyframes for spinner animation
const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

const inputSx = () => ({
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
    color: 'text.secondary',
    fontWeight: 600,
    '&.Mui-focused': { color: ADMIN_PRIMARY },
  },
})

const selectSx = () => ({
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
    color: 'text.secondary',
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

const BADGE_OPTIONS = ['Premium', 'Standard', 'Focused', 'Collab']

function AdminAddService() {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { showToast } = useToast()

  const editingService = location.state?.service || null
  const isEditMode = !!editingService?.id

  const [iconKey, setIconKey] = useState('')
  const [badge, setBadge] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [iconError, setIconError] = useState('')
  const [badgeError, setBadgeError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingService) {
      setIconKey(editingService.icon_key || '')
      setBadge(editingService.badge || '')
      setTitle(editingService.title || '')
      setDescription(editingService.description || '')
    }
  }, [editingService])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setIconError('')
    setBadgeError('')
    setTitleError('')
    setDescriptionError('')

    setLoading(true)

    const payload = {
      icon_key: iconKey || null,
      badge,
      title,
      description,
    }

    const method = 'POST'
    const path = isEditMode ? `/services/${editingService.id}` : '/services'

    try {
      const { ok, data } = await apiClient(path, method, payload)
      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.icon_key) {
          const msg = Array.isArray(errors.icon_key) ? errors.icon_key[0] : errors.icon_key
          if (msg) setIconError(String(msg))
        }
        if (errors.badge) {
          const msg = Array.isArray(errors.badge) ? errors.badge[0] : errors.badge
          if (msg) setBadgeError(String(msg))
        }
        if (errors.title) {
          const msg = Array.isArray(errors.title) ? errors.title[0] : errors.title
          if (msg) setTitleError(String(msg))
        }
        if (errors.description) {
          const msg = Array.isArray(errors.description) ? errors.description[0] : errors.description
          if (msg) setDescriptionError(String(msg))
        }
        if (!errors.icon_key && !errors.badge && !errors.title && !errors.description) {
          const serverMessage =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setTitleError(serverMessage || 'Unable to save service. Please try again.')
        }
        return
      }

      showToast(
        isEditMode ? 'Service updated successfully.' : 'Service added successfully.',
        'success',
      )
      navigate('/admin/services')
    } catch {
      setTitleError('Unable to reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        ...keyframes,
        width: '100%',
        minWidth: 0,
        maxWidth: 1000,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Header with Back + title — same as AdminAddUser */}
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
          onClick={() => navigate('/admin/services')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': {
              bgcolor: alpha(ADMIN_PRIMARY, 0.15),
            },
          }}
          aria-label="Back to services"
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {isEditMode ? 'Edit Service' : 'Add Service'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {isEditMode ? 'Update an existing platform service' : 'Create a new platform service'}
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
        {/* Centered section title — form style unchanged */}
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
            <DesignServicesRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            {isEditMode ? 'Edit Service' : 'Add Service'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {isEditMode ? 'Update an existing platform service' : 'Create a new platform service'}
          </Typography>
        </Box>

        {/* Icon & Badge — two columns on sm+ */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <DesignServicesRoundedIcon
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
            <FormControl
              fullWidth
              size="medium"
              sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
              error={!!iconError}
            >
              <InputLabel id="add-service-icon-label" shrink>Icon</InputLabel>
              <Select
                labelId="add-service-icon-label"
                value={iconKey}
                label="Icon"
                onChange={(e) => {
                  setIconKey(e.target.value)
                  if (iconError) setIconError('')
                }}
                notched
              >
                {ICON_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <opt.Icon sx={{ color: ADMIN_PRIMARY, fontSize: 20 }} />
                      {opt.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {iconError && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                  <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                    {iconError}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Box>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <LabelRoundedIcon
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
            <FormControl
              fullWidth
              size="medium"
              sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
              error={!!badgeError}
            >
              <InputLabel id="add-service-badge-label" shrink>Badge</InputLabel>
              <Select
                labelId="add-service-badge-label"
                value={badge}
                label="Badge"
                onChange={(e) => {
                  setBadge(e.target.value)
                  if (badgeError) setBadgeError('')
                }}
                notched
              >
                {BADGE_OPTIONS.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
              {badgeError && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                  <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                    {badgeError}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError) setTitleError('')
          }}
          placeholder="e.g. AI Reasoning Booster"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(), mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          error={!!titleError}
          helperText={
            titleError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                  {titleError}
                </Typography>
              </Box>
            ) : (
              ''
            )
          }
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (descriptionError) setDescriptionError('')
          }}
          placeholder="Brief description of the service"
          variant="outlined"
          size="medium"
          multiline
          minRows={4}
          maxRows={8}
          sx={{
            ...inputSx(),
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
          error={!!descriptionError}
          helperText={
            descriptionError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                  {descriptionError}
                </Typography>
              </Box>
            ) : (
              ''
            )
          }
        />

        {/* Actions — primary gradient button like SignIn */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/services')}
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
            startIcon={
              loading ? (
                <AutorenewIcon
                  sx={{
                    animation: 'spin 0.8s linear infinite',
                    color: '#fff',
                  }}
                />
              ) : (
                <SaveRoundedIcon sx={{ fontSize: 22 }} />
              )
            }
            disabled={loading}
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
              color: '#fff',
              '&.Mui-disabled': {
                color: '#fff',
                background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                opacity: 1,
              },
            }}
          >
            {loading ? (isEditMode ? 'Saving…' : 'Saving…') : 'Save Service'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddService
