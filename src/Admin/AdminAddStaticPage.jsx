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
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded'
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
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import CookieRoundedIcon from '@mui/icons-material/CookieRounded'
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded'
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded'
import LiveHelpRoundedIcon from '@mui/icons-material/LiveHelpRounded'
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

// Admin screen primary (#384D84 — no green)
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
  { value: 'handyman', label: 'How It Works', Icon: HandymanRoundedIcon },
  { value: 'policy', label: 'Privacy Policy', Icon: PolicyRoundedIcon },
  { value: 'gavel', label: 'Terms Of Service', Icon: GavelIcon },
  { value: 'cookie', label: 'Cookie Policy', Icon: CookieRoundedIcon },
  { value: 'helpCenter', label: 'Help Center', Icon: HelpCenterRoundedIcon },
  { value: 'liveHelp', label: 'FAQs', Icon: LiveHelpRoundedIcon },
  { value: 'psychology', label: 'Psychology', Icon: PsychologyIcon },
  { value: 'assignment', label: 'Assignment', Icon: AssignmentIcon },
  { value: 'timeline', label: 'Timeline', Icon: TimelineIcon },
  { value: 'barChart', label: 'Bar Chart', Icon: BarChartIcon },
  { value: 'groups', label: 'Groups', Icon: GroupsIcon },
  { value: 'localHospital', label: 'Local Hospital', Icon: LocalHospitalIcon },
  { value: 'school', label: 'School', Icon: SchoolRoundedIcon },
  { value: 'menuBook', label: 'Menu Book', Icon: MenuBookRoundedIcon },
  { value: 'quiz', label: 'Quiz', Icon: QuizRoundedIcon },
  { value: 'support', label: 'Support', Icon: SupportRoundedIcon },
]

const PAGE_OPTIONS = ['How It Works', 'Privacy Policy', 'Terms Of Service', 'Cookie Policy', 'Help Center', 'FAQs']

function AdminAddStaticPage() {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { showToast } = useToast()

  const editingPage = location.state?.page || null
  const isEditMode = !!editingPage?.id

  const [iconKey, setIconKey] = useState('')
  const [pageType, setPageType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [iconError, setIconError] = useState('')
  const [pageError, setPageError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingPage) {
      setIconKey(editingPage.icon_key || '')
      setPageType(editingPage.page || '')
      setTitle(editingPage.title || '')
      setDescription(editingPage.description || '')
    }
  }, [editingPage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    // Clear previous errors before new request
    setIconError('')
    setPageError('')
    setTitleError('')
    setDescriptionError('')

    setLoading(true)

    const payload = {
      icon_key: iconKey || null,
      page: pageType,
      title,
      description,
    }

    const method = 'POST'
    const path = isEditMode ? `/static-pages/${editingPage.id}` : '/static-pages'

    try {
      const { ok, data } = await apiClient(path, method, payload)
      if (!ok || !data?.success) {
        const errors = data?.errors || {}
        if (errors.icon_key) {
          const msg = Array.isArray(errors.icon_key) ? errors.icon_key[0] : errors.icon_key
          if (msg) setIconError(String(msg))
        }
        if (errors.page) {
          const msg = Array.isArray(errors.page) ? errors.page[0] : errors.page
          if (msg) setPageError(String(msg))
        }
        if (errors.title) {
          const msg = Array.isArray(errors.title) ? errors.title[0] : errors.title
          if (msg) setTitleError(String(msg))
        }
        if (errors.description) {
          const msg = Array.isArray(errors.description) ? errors.description[0] : errors.description
          if (msg) setDescriptionError(String(msg))
        }
        if (!errors.icon_key && !errors.page && !errors.title && !errors.description) {
          const serverMessage =
            data?.errors && typeof data.errors === 'object'
              ? Object.values(data.errors).flat().join(' ')
              : data?.message
          setTitleError(serverMessage || 'Unable to save static page. Please try again.')
        }
        return
      }

      showToast(
        isEditMode ? 'Static page updated successfully.' : 'Static page added successfully.',
        'success',
      )
      navigate('/admin/static-pages')
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
          onClick={() => navigate('/admin/static-pages')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': {
              bgcolor: alpha(ADMIN_PRIMARY, 0.15),
            },
          }}
          aria-label="Back to static pages"
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
            {isEditMode ? 'Edit Static Page' : 'Add Static Page'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Create a new static page
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
            <ArticleRoundedIcon sx={{ fontSize: 28 }} />
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
            {isEditMode ? 'Edit Static Page' : 'Add Static Page'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create a new platform static page
          </Typography>
        </Box>

        {/* Icon & Page — two columns on sm+ */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <ArticleRoundedIcon
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
            <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="add-static-icon-label" shrink>Icon</InputLabel>
              <Select
                labelId="add-static-icon-label"
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
            <FormControl fullWidth size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="add-static-page-label" shrink>Page</InputLabel>
              <Select
                labelId="add-static-page-label"
                value={pageType}
                label="Page"
                onChange={(e) => {
                  setPageType(e.target.value)
                  if (pageError) setPageError('')
                }}
                notched
              >
                {PAGE_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
              {pageError && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
                  <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                    {pageError}
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
          placeholder="e.g. Privacy Policy"
          variant="outlined"
          color="primary"
          size="medium"
          sx={{ ...inputSx(theme), mb: 2 }}
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
          placeholder="Page content / description"
          variant="outlined"
          color="primary"
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

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/static-pages')}
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
                color: '#fff',
              },
              color: '#fff',
              '&.Mui-disabled': {
                color: '#fff',
                background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                opacity: 1,
              },
            }}
          >
            {loading ? (isEditMode ? 'Saving…' : 'Saving…') : 'Save Page'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddStaticPage
