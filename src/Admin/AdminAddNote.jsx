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
import NoteRoundedIcon from '@mui/icons-material/NoteRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import TitleRoundedIcon from '@mui/icons-material/TitleRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import SummarizeIcon from '@mui/icons-material/Summarize'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'

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

const NOTE_TYPES = [
  { id: 1, name: 'Cardiology' },
  { id: 2, name: 'Respiratory' },
  { id: 3, name: 'Gynecology' },
  { id: 4, name: 'Neurology' },
  { id: 5, name: 'Gastroenterology' },
]

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard']
const IMPORTANCE_OPTIONS = ['Low', 'Medium', 'High']

function AdminAddNote() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [typeId, setTypeId] = useState('')
  const [summary, setSummary] = useState('')
  const [keyPointsText, setKeyPointsText] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [examImportanceLevel, setExamImportanceLevel] = useState('')
  const [tagsText, setTagsText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const key_points = keyPointsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const tags = tagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    // TODO: submit to API — payload: title, description, type_id: Number(typeId), summary, key_points, difficulty_level, exam_importance_level, tags
    console.log({ title, description, type_id: typeId, summary, key_points, difficulty_level: difficultyLevel, exam_importance_level: examImportanceLevel, tags })
    navigate('/admin/notes/notes')
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
          onClick={() => navigate('/admin/notes/notes')}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            color: ADMIN_PRIMARY,
            bgcolor: alpha(ADMIN_PRIMARY, 0.08),
            borderRadius: '7px',
            '&:hover': {
              bgcolor: alpha(ADMIN_PRIMARY, 0.15),
            },
          }}
          aria-label="Back to notes"
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
            Add Note
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            Create a new note
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
            <NoteRoundedIcon sx={{ fontSize: 28 }} />
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
            Add Note
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create a new note
          </Typography>
        </Box>

        <TextField
          fullWidth
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Acute Coronary Syndrome Management"
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
        />

        <TextField
          fullWidth
          required
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Comprehensive notes on..."
          variant="outlined"
          size="medium"
          multiline
          minRows={4}
          maxRows={8}
          sx={{
            ...inputSx(),
            mb: 2,
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

        <Box sx={{ position: 'relative', mb: 2 }}>
          <CategoryRoundedIcon
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
          <FormControl fullWidth required size="medium" sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
            <InputLabel id="add-note-type-label" shrink>Type</InputLabel>
            <Select
              labelId="add-note-type-label"
              value={typeId}
              label="Type"
              onChange={(e) => setTypeId(e.target.value)}
              notched
            >
              {NOTE_TYPES.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          required
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief summary of the note"
          variant="outlined"
          size="medium"
          multiline
          minRows={2}
          maxRows={4}
          sx={{
            ...inputSx(),
            mb: 2,
            '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                <SummarizeIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Key points"
          value={keyPointsText}
          onChange={(e) => setKeyPointsText(e.target.value)}
          placeholder="One key point per line"
          variant="outlined"
          size="medium"
          multiline
          minRows={4}
          maxRows={10}
          sx={{
            ...inputSx(),
            mb: 2,
            '& .MuiOutlinedInput-root': { alignItems: 'flex-start' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignItems: 'flex-start', pt: 1.5 }}>
                <FormatListBulletedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <SignalCellularAltIcon
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
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="add-note-difficulty-label" shrink>Difficulty level</InputLabel>
              <Select
                labelId="add-note-difficulty-label"
                value={difficultyLevel}
                label="Difficulty level"
                onChange={(e) => setDifficultyLevel(e.target.value)}
                notched
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <StarBorderIcon
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
            <FormControl fullWidth required size="medium" sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}>
              <InputLabel id="add-note-importance-label" shrink>Exam importance level</InputLabel>
              <Select
                labelId="add-note-importance-label"
                value={examImportanceLevel}
                label="Exam importance level"
                onChange={(e) => setExamImportanceLevel(e.target.value)}
                notched
              >
                {IMPORTANCE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Tags"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="Comma-separated (e.g. ACS, STEMI, Emergency)"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(), mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalOfferIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate('/admin/notes/notes')}
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
            Save Note
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddNote
