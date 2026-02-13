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
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import NoteRoundedIcon from '@mui/icons-material/NoteRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CategoryIcon from '@mui/icons-material/Category'
import SummarizeIcon from '@mui/icons-material/Summarize'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LabelIcon from '@mui/icons-material/Label'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

const TYPES_DATA = [
  { id: 1, name: 'Cardiology', status: 'Active' },
  { id: 2, name: 'Respiratory', status: 'Active' },
  { id: 3, name: 'Gynecology', status: 'Active' },
  { id: 4, name: 'Neurology', status: 'Active' },
  { id: 5, name: 'Gastroenterology', status: 'Active' },
]

const NOTES_DATA = [
  {
    id: 1,
    title: 'Acute Coronary Syndrome Management',
    description: 'Comprehensive notes on ACS presentation, diagnosis, and immediate management strategies for UKMLA/PLAB 1.',
    type_id: 1,
    summary: 'ACS includes STEMI and NSTEMI. Key is rapid diagnosis and intervention.',
    key_points: [
      'ECG changes: ST elevation (STEMI) vs ST depression/T wave inversion (NSTEMI)',
      'Troponin elevation confirms MI',
      'MONA: Morphine, Oxygen, Nitrates, Aspirin',
      'PCI within 120 minutes for STEMI',
    ],
    difficulty_level: 'Hard',
    exam_importance_level: 'High',
    tags: ['ACS', 'STEMI', 'NSTEMI', 'Emergency', 'Cardiology'],
    status: 'Active',
    created_at: '2025-01-15',
  },
  {
    id: 2,
    title: 'Asthma Exacerbation Protocol',
    description: 'Step-by-step approach to assessing and managing acute asthma exacerbations in emergency settings.',
    type_id: 2,
    summary: 'Assess severity, provide oxygen, bronchodilators, and steroids. Escalate if needed.',
    key_points: [
      'Assess severity: mild, moderate, severe, life-threatening',
      'Salbutamol nebulizer + ipratropium',
      'Oral/IV corticosteroids',
      'Monitor peak flow and oxygen saturation',
    ],
    difficulty_level: 'Medium',
    exam_importance_level: 'High',
    tags: ['Asthma', 'Emergency', 'Respiratory', 'PLAB'],
    status: 'Active',
    created_at: '2025-01-18',
  },
  {
    id: 3,
    title: 'Ovarian Cyst Complications',
    description: 'Understanding ovarian cyst torsion and rupture: clinical features, diagnosis, and management.',
    type_id: 3,
    summary: 'Torsion = sudden pain + mass. Rupture = sudden pain + peritonism. US confirms. Surgery if needed.',
    key_points: [
      'Torsion: sudden severe pain, nausea, vomiting',
      'Ultrasound shows enlarged ovary with reduced blood flow',
      'Emergency laparoscopy for torsion',
      'Rupture: peritoneal signs, free fluid on US',
    ],
    difficulty_level: 'Medium',
    exam_importance_level: 'Medium',
    tags: ['Gynecology', 'Ovarian Cyst', 'Torsion', 'Emergency'],
    status: 'Active',
    created_at: '2025-01-20',
  },
  {
    id: 4,
    title: 'Ischemic Stroke Management',
    description: 'Rapid assessment and treatment of acute ischemic stroke including thrombolysis criteria.',
    type_id: 4,
    summary: 'Time is brain. CT to exclude hemorrhage, thrombolysis within 4.5 hours, thrombectomy if large vessel.',
    key_points: [
      'FAST assessment: Face, Arms, Speech, Time',
      'CT head to exclude hemorrhage',
      'Thrombolysis with alteplase if within 4.5 hours and no contraindications',
      'Thrombectomy for large vessel occlusion',
    ],
    difficulty_level: 'Hard',
    exam_importance_level: 'High',
    tags: ['Stroke', 'Neurology', 'Emergency', 'Thrombolysis'],
    status: 'Active',
    created_at: '2025-01-22',
  },
  {
    id: 5,
    title: 'Peptic Ulcer Disease',
    description: 'Pathophysiology, diagnosis, and treatment of gastric and duodenal ulcers.',
    type_id: 5,
    summary: 'H. pylori and NSAIDs are main causes. PPIs heal ulcers. Eradication therapy for H. pylori.',
    key_points: [
      'Epigastric pain, worse with food (gastric) or improved with food (duodenal)',
      'Endoscopy for diagnosis',
      'H. pylori testing: urea breath test, stool antigen',
      'Triple therapy: PPI + amoxicillin + clarithromycin',
    ],
    difficulty_level: 'Easy',
    exam_importance_level: 'Medium',
    tags: ['GI', 'Peptic Ulcer', 'H. pylori', 'PPI'],
    status: 'Inactive',
    created_at: '2025-01-25',
  },
]

function DetailRow({ label, value, icon }) {
  const theme = useTheme()
  if (value == null || value === '') return null
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: { xs: 1, sm: 1.5 },
        mb: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: '8px',
        bgcolor: alpha(theme.palette.grey[100], 0.5),
        border: '1px solid',
        borderColor: alpha(theme.palette.grey[300], 0.4),
        textAlign: { xs: 'center', sm: 'left' },
      }}
    >
      {icon && (
        <Box
          sx={{
            width: { xs: 40, sm: 36 },
            height: { xs: 40, sm: 36 },
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: alpha(ADMIN_PRIMARY, 0.1),
            color: ADMIN_PRIMARY,
            alignSelf: { xs: 'center', sm: 'flex-start' },
            '& .MuiSvgIcon-root': { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1, width: '100%' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
          {label}
        </Typography>
        {typeof value === 'string' && (
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {value}
          </Typography>
        )}
        {Array.isArray(value) && (
          <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 0.5, lineHeight: 1.5, fontSize: '0.875rem' } }}>
            {value.map((item, idx) => (
              <li key={idx}>
                <Typography variant="body2" component="span" sx={{ color: 'text.primary' }}>
                  {item}
                </Typography>
              </li>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function NoteViewCard({ note, typeName }) {
  const theme = useTheme()
  const difficultyColor =
    note.difficulty_level === 'Hard'
      ? theme.palette.error.main
      : note.difficulty_level === 'Medium'
        ? theme.palette.warning.main
        : theme.palette.success.main
  const importanceColor =
    note.exam_importance_level === 'High'
      ? theme.palette.error.main
      : note.exam_importance_level === 'Medium'
        ? theme.palette.warning.main
        : theme.palette.info.main

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          label={typeName}
          size="small"
          sx={{ borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY, fontWeight: 600, fontSize: '0.75rem', height: 28 }}
        />
        <Chip
          icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
          label={note.status}
          size="small"
          sx={{ borderRadius: '7px', bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark, fontWeight: 600, height: 28, '& .MuiChip-icon': { fontSize: 14 } }}
        />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
        {note.title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <DetailRow label="Description" value={note.description} icon={<DescriptionOutlinedIcon sx={{ fontSize: 20 }} />} />
      <DetailRow label="Type / Specialty" value={typeName} icon={<CategoryIcon sx={{ fontSize: 20 }} />} />
      <DetailRow label="Summary" value={note.summary} icon={<SummarizeIcon sx={{ fontSize: 20 }} />} />
      <DetailRow label="Key Points" value={note.key_points} icon={<FormatListBulletedIcon sx={{ fontSize: 20 }} />} />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, mb: 2 }}>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <SignalCellularAltIcon sx={{ fontSize: 18, color: difficultyColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
              Difficulty
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {note.difficulty_level}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <StarBorderIcon sx={{ fontSize: 18, color: importanceColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>
              Importance
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {note.exam_importance_level}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', bgcolor: alpha(theme.palette.grey[100], 0.5), border: '1px solid', borderColor: alpha(theme.palette.grey[300], 0.4) }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.75 }}>
          Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {note.tags.map((tag, idx) => (
            <Chip
              key={idx}
              icon={<LabelIcon sx={{ fontSize: 12 }} />}
              label={tag}
              size="small"
              sx={{ borderRadius: '7px', bgcolor: alpha(ADMIN_PRIMARY, 0.1), color: 'text.primary', fontWeight: 500, height: 24, fontSize: '0.75rem', '& .MuiChip-icon': { fontSize: 12 } }}
            />
          ))}
        </Box>
      </Box>
      <DetailRow
        label="Created At"
        value={new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
        icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />}
      />
    </Box>
  )
}

function AdminNotes() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [notes, setNotes] = useState(NOTES_DATA)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewNote, setViewNote] = useState(null)

  const filtered = notes.filter((row) => {
    const matchSearch = !search || row.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || row.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRows = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const from = totalRows === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage + rowsPerPage, totalRows)

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(0)
  }

  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
  }

  const handleView = (note) => setViewNote(note)
  const handleViewClose = () => setViewNote(null)

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (viewNote?.id === id) handleViewClose()
  }

  const getTypeName = (typeId) => TYPES_DATA.find((t) => t.id === typeId)?.name || 'General'

  const badgeChip = (label, colorBg, colorText) => (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '7px',
        bgcolor: colorBg,
        color: colorText,
        border: 'none',
      }}
    />
  )

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <NoteRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Notes
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage notes
        </Typography>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <TextField
            size="small"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 140px', md: '1 1 180px' },
              minWidth: { xs: 0, sm: 120 },
              maxWidth: { sm: 200, md: 240 },
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.grey[50],
                borderRadius: '7px',
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.3) },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 120 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
              fullWidth
              sx={{
                bgcolor: ADMIN_PRIMARY,
                borderRadius: '7px',
                px: { xs: 2, sm: 1.5 },
                py: 1,
                fontWeight: 600,
                fontSize: '0.8125rem',
                flex: { xs: 1, sm: '0 0 auto' },
                minWidth: { sm: 'auto' },
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleReset}
              fullWidth
              sx={{
                borderColor: theme.palette.grey[300],
                color: 'text.primary',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                px: { xs: 2, sm: 1.5 },
                py: 1,
                flex: { xs: 1, sm: '0 0 auto' },
                minWidth: { sm: 'auto' },
                whiteSpace: 'nowrap',
                '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '7px',
          border: '1px solid',
          borderColor: alpha(ADMIN_PRIMARY, 0.12),
          overflow: 'hidden',
          overflowX: { xs: 'hidden', md: 'visible' },
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: theme.palette.grey[200],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Note list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate('/admin/notes/add')}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Note
          </Button>
        </Box>

        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: alpha(ADMIN_PRIMARY, 0.06),
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      color: 'text.primary',
                      borderColor: theme.palette.grey[200],
                      py: 1.5,
                      fontSize: '0.8125rem',
                    },
                  }}
                >
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Importance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row) => {
                  const typeName = getTypeName(row.type_id)
                  const diffColor = row.difficulty_level === 'Hard' ? theme.palette.error.main : row.difficulty_level === 'Medium' ? theme.palette.warning.main : theme.palette.success.main
                  const impColor = row.exam_importance_level === 'High' ? theme.palette.error.main : row.exam_importance_level === 'Medium' ? theme.palette.warning.main : theme.palette.info.main
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
                        '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {row.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {badgeChip(typeName, alpha(ADMIN_PRIMARY, 0.12), ADMIN_PRIMARY)}
                      </TableCell>
                      <TableCell>
                        {badgeChip(row.difficulty_level, alpha(diffColor, 0.12), diffColor)}
                      </TableCell>
                      <TableCell>
                        {badgeChip(row.exam_importance_level, alpha(impColor, 0.12), impColor)}
                      </TableCell>
                      <TableCell>
                        {badgeChip(
                          row.status,
                          row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                          row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600]
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View" placement="top" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleView(row)}
                            sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton
                            size="small"
                            component="a"
                            href="#"
                            sx={{ color: theme.palette.grey[600], ml: 0.5, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.id)}
                            sx={{
                              color: theme.palette.error.main,
                              ml: 0.5,
                              '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) },
                            }}
                          >
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showAsCards && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 1.5 }, p: { xs: 2, sm: 2 }, pb: 2, overflowX: 'hidden' }}>
            {paginated.map((row) => {
              const typeName = getTypeName(row.type_id)
              const diffColor = row.difficulty_level === 'Hard' ? theme.palette.error.main : row.difficulty_level === 'Medium' ? theme.palette.warning.main : theme.palette.success.main
              const impColor = row.exam_importance_level === 'High' ? theme.palette.error.main : row.exam_importance_level === 'Medium' ? theme.palette.warning.main : theme.palette.info.main
              return (
                <Paper
                  key={row.id}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 2 },
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: { xs: alpha(ADMIN_PRIMARY, 0.2), sm: theme.palette.grey[200] },
                    bgcolor: theme.palette.background.paper,
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.35), boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}` },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', sm: '0.875rem' }, mb: 1 }}>
                        {row.title}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {badgeChip(typeName, alpha(ADMIN_PRIMARY, 0.12), ADMIN_PRIMARY)}
                        {badgeChip(row.difficulty_level, alpha(diffColor, 0.12), diffColor)}
                        {badgeChip(row.exam_importance_level, alpha(impColor, 0.12), impColor)}
                        {badgeChip(
                          row.status,
                          row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                          row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[600]
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton
                          size={isMobile ? 'large' : 'medium'}
                          onClick={() => handleView(row)}
                          sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}
                        >
                          <VisibilityRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size={isMobile ? 'large' : 'medium'}
                          component="a"
                          href="#"
                          sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}
                        >
                          <EditRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                          size={isMobile ? 'large' : 'medium'}
                          onClick={() => handleDelete(row.id)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.15) },
                          }}
                        >
                          <DeleteRoundedIcon fontSize={isMobile ? 'medium' : 'small'} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              )
            })}
          </Box>
        )}

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 2 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.75, sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.grey[200],
            bgcolor: alpha(ADMIN_PRIMARY, 0.02),
            borderRadius: { xs: '0 0 7px 7px', sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  height: 36,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '7px',
                  bgcolor: theme.palette.background.paper,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 },
                }}
              >
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                Page {page + 1} of {totalPages}
              </Typography>
            </Box>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              size="small"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: '0.8125rem', borderRadius: '7px', minWidth: 32, height: 32, color: ADMIN_PRIMARY },
                '& .MuiPaginationItem-page.Mui-selected': {
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`,
                  color: '#fff',
                  boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`,
                  fontSize: '0.8125rem',
                  minWidth: 32,
                  height: 32,
                  '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY },
                '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY, fontSize: 20 },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* View note dialog */}
      <Dialog
        open={!!viewNote}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        slotProps={{
          backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' } },
        }}
        PaperProps={{
          sx: {
            margin: 2,
            maxHeight: 'calc(100vh - 32px)',
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.25),
            boxShadow: `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY }}>
              <DescriptionOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Note details
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleViewClose} sx={{ color: theme.palette.grey[600], flexShrink: 0, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2, overflow: 'auto' }}>
          {viewNote && <NoteViewCard note={viewNote} typeName={getTypeName(viewNote.type_id)} />}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default AdminNotes
