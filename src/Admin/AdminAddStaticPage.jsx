import { useState } from 'react'
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

const inputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    '&.Mui-focused': { color: theme.palette.primary.main },
  },
})

const selectSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    '&.Mui-focused': { color: theme.palette.primary.main },
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
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [iconKey, setIconKey] = useState('')
  const [pageType, setPageType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: submit to API
    navigate('/admin/static-pages')
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
          onClick={() => navigate('/admin/static-pages')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
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
            Add Static Page
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
          borderRadius: { xs: 2.5, sm: 3 },
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
          bgcolor: theme.palette.background.paper,
          boxShadow: { xs: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`, sm: `0 4px 20px ${alpha(theme.palette.primary.main, 0.04)}` },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
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
            Add Static Page
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
                color: 'primary.main',
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="add-static-icon-label" shrink>Icon</InputLabel>
              <Select
                labelId="add-static-icon-label"
                value={iconKey}
                label="Icon"
                onChange={(e) => setIconKey(e.target.value)}
                notched
              >
                {ICON_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <opt.Icon sx={{ color: 'primary.main', fontSize: 20 }} />
                      {opt.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
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
                color: 'primary.main',
                fontSize: 22,
                pointerEvents: 'none',
              }}
            />
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(theme), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="add-static-page-label" shrink>Page</InputLabel>
              <Select
                labelId="add-static-page-label"
                value={pageType}
                label="Page"
                onChange={(e) => setPageType(e.target.value)}
                notched
              >
                {PAGE_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TextField
          fullWidth
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Privacy Policy"
          variant="outlined"
          color="primary"
          size="medium"
          sx={{ ...inputSx(theme), mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
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
                <DescriptionRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/static-pages')}
            sx={{
              borderColor: alpha(theme.palette.grey[400], 0.8),
              color: 'text.secondary',
              borderRadius: 2,
              fontWeight: 600,
              px: 2.5,
              py: 1.25,
              textTransform: 'none',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
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
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
              },
            }}
          >
            Save Page
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddStaticPage
