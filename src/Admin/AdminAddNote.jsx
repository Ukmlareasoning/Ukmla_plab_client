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
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

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
    '&.Mui-error': { color: 'error.main' },
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
    '&.Mui-error': { color: 'error.main' },
  },
})

const IMPORTANCE_OPTIONS = ['Low', 'Medium', 'High']

function AdminAddNote() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const editingNote = location.state?.note || null
  const isEditMode = !!editingNote

  const [title, setTitle] = useState(editingNote?.title || '')
  const [description, setDescription] = useState(editingNote?.description || '')
  const [typeId, setTypeId] = useState(editingNote?.notes_type_id || '')
  const [summary, setSummary] = useState(editingNote?.summary || '')
  const [keyPointsText, setKeyPointsText] = useState(
    Array.isArray(editingNote?.key_points) ? editingNote.key_points.join('\n') : ''
  )
  const [difficultyLevel, setDifficultyLevel] = useState(editingNote?.difficulty_level_id || '')
  const [examImportanceLevel, setExamImportanceLevel] = useState(editingNote?.exam_importance_level || '')
  const [tagsText, setTagsText] = useState(
    Array.isArray(editingNote?.tags) ? editingNote.tags.join(', ') : ''
  )

  const [noteTypes, setNoteTypes] = useState([])
  const [difficultyLevels, setDifficultyLevels] = useState([])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [typesRes, diffRes] = await Promise.all([
          apiClient('/notes-types?per_page=1000&apply_filters=0', 'GET'),
          apiClient('/difficulty-levels?per_page=1000&apply_filters=0', 'GET'),
        ])

        if (typesRes.ok && typesRes.data?.success) {
          setNoteTypes(typesRes.data.data?.notes_types || [])
        }
        if (diffRes.ok && diffRes.data?.success) {
          setDifficultyLevels(diffRes.data.data?.difficulty_levels || [])
        }
      } catch {
        // ignore, form can still be used without options
      }
    }

    fetchMeta()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const payload = {
      title: title || '',
      description: description || '',
      notes_type_id: typeId || '',
      difficulty_level_id: difficultyLevel || '',
      summary: summary || '',
      key_points: keyPointsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      exam_importance_level: examImportanceLevel || '',
      tags: tagsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    setLoading(true)
    setErrors({})

    try {
      const url = isEditMode ? `/notes/${editingNote.id}` : '/notes'
      const method = 'POST'
      const { ok, data } = await apiClient(url, method, payload)

      if (!ok || !data?.success) {
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors)
        }
        const message =
          data?.message ||
          (data?.errors && typeof data.errors === 'object'
            ? Object.values(data.errors).flat().join(' ')
            : null)
        if (message) {
          showToast(message, 'error')
        }
        setLoading(false)
        return
      }

      showToast(
        isEditMode ? 'Note updated successfully.' : 'Note created successfully.',
        'success'
      )
      navigate('/admin/notes/notes')
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
      setLoading(false)
    }
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
            {isEditMode ? 'Edit Note' : 'Add Note'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            {isEditMode ? 'Update note details' : 'Create a new note'}
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
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
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
            {isEditMode ? 'Edit Note' : 'Add Note'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create a new note
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }))
            }
          }}
          placeholder="e.g. Acute Coronary Syndrome Management"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(), mb: 2 }}
          error={!!errors.title}
          helperText={
            errors.title ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{errors.title[0]}</Typography>
              </Box>
            ) : null
          }
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
          label="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }))
            }
          }}
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
          error={!!errors.description}
          helperText={
            errors.description ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{errors.description[0]}</Typography>
              </Box>
            ) : null
          }
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
          <FormControl
            fullWidth
            size="medium"
            error={!!errors.notes_type_id}
            sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
          >
            <InputLabel id="add-note-type-label" shrink>Type</InputLabel>
            <Select
              labelId="add-note-type-label"
              value={typeId}
              label="Type"
              onChange={(e) => {
                setTypeId(e.target.value)
                if (errors.notes_type_id) {
                  setErrors((prev) => ({ ...prev, notes_type_id: undefined }))
                }
              }}
              notched
            >
              {noteTypes.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
            {errors.notes_type_id && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'error.main',
                }}
              >
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                {errors.notes_type_id[0]}
              </Typography>
            )}
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Summary"
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value)
            if (errors.summary) {
              setErrors((prev) => ({ ...prev, summary: undefined }))
            }
          }}
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
          error={!!errors.summary}
          helperText={
            errors.summary ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{errors.summary[0]}</Typography>
              </Box>
            ) : null
          }
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
          onChange={(e) => {
            setKeyPointsText(e.target.value)
            if (errors.key_points) {
              setErrors((prev) => ({ ...prev, key_points: undefined }))
            }
          }}
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
          error={!!errors.key_points}
          helperText={
            errors.key_points ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{errors.key_points[0]}</Typography>
              </Box>
            ) : null
          }
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
            <FormControl
              fullWidth
              size="medium"
              error={!!errors.difficulty_level_id}
              sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
            >
              <InputLabel id="add-note-difficulty-label" shrink>Difficulty level</InputLabel>
              <Select
                labelId="add-note-difficulty-label"
                value={difficultyLevel}
                label="Difficulty level"
                onChange={(e) => {
                  setDifficultyLevel(e.target.value)
                  if (errors.difficulty_level_id) {
                    setErrors((prev) => ({ ...prev, difficulty_level_id: undefined }))
                  }
                }}
                notched
              >
                {difficultyLevels.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.difficulty_level_id && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'error.main',
                  }}
                >
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  {errors.difficulty_level_id[0]}
                </Typography>
              )}
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
            <FormControl
              fullWidth
              size="medium"
              error={!!errors.exam_importance_level}
              sx={{ ...selectSx(), '& .MuiOutlinedInput-root': { pl: 4.5 } }}
            >
              <InputLabel id="add-note-importance-label" shrink>Exam importance level</InputLabel>
              <Select
                labelId="add-note-importance-label"
                value={examImportanceLevel}
                label="Exam importance level"
                onChange={(e) => {
                  setExamImportanceLevel(e.target.value)
                  if (errors.exam_importance_level) {
                    setErrors((prev) => ({ ...prev, exam_importance_level: undefined }))
                  }
                }}
                notched
              >
                {IMPORTANCE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
              {errors.exam_importance_level && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'error.main',
                  }}
                >
                  <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  {errors.exam_importance_level[0]}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Tags"
          value={tagsText}
          onChange={(e) => {
            setTagsText(e.target.value)
            if (errors.tags) {
              setErrors((prev) => ({ ...prev, tags: undefined }))
            }
          }}
          placeholder="Comma-separated (e.g. ACS, STEMI, Emergency)"
          variant="outlined"
          size="medium"
          sx={{ ...inputSx(), mb: 3 }}
          error={!!errors.tags}
          helperText={
            errors.tags ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="caption">{errors.tags[0]}</Typography>
              </Box>
            ) : null
          }
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
            disabled={loading}
            startIcon={
              loading ? (
                <AutorenewIcon
                  sx={{
                    fontSize: 22,
                    animation: 'spin 0.8s linear infinite',
                    color: '#fff',
                  }}
                />
              ) : (
                <SaveRoundedIcon sx={{ fontSize: 22 }} />
              )
            }
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
              '&.Mui-disabled': {
                color: '#fff',
                background: `linear-gradient(135deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_DARK} 100%)`,
                boxShadow: `0 4px 14px ${alpha(ADMIN_PRIMARY, 0.4)}`,
                opacity: 1,
              },
            }}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Note' : 'Save Note'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminAddNote
