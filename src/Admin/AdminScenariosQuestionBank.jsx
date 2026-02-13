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
  DialogActions,
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
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Admin screen primary (#384D84 — no green/teal)
const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice (MCQ)',
  shortAnswer: 'Short Answer',
  descriptive: 'Descriptive / Long Answer',
  trueFalse: 'True / False',
  fillInBlanks: 'Fill in the Blanks',
}

// Dummy records: 5 rows, 1 per question type
const STATIC_QUESTIONS = [
  {
    id: 1,
    course: 'UKMLA Reasoning Foundation',
    lectureNo: 3,
    questionType: 'mcq',
    question: 'A 45-year-old patient presents with chest pain. Which of the following is the most appropriate initial investigation?',
    answer: 'A) ECG',
    answerDescription: 'ECG is the first-line investigation for acute chest pain to rule out STEMI and other acute coronary syndromes.',
    options: [
      { letter: 'A', text: 'ECG', correct: true },
      { letter: 'B', text: 'Chest X-ray', correct: false },
      { letter: 'C', text: 'Troponin only', correct: false },
      { letter: 'D', text: 'CT coronary angiography', correct: false },
    ],
  },
  {
    id: 2,
    course: 'PLAB Ethics Core',
    lectureNo: 7,
    questionType: 'shortAnswer',
    question: 'What are the four pillars of medical ethics?',
    answer: 'Autonomy, Beneficence, Non-maleficence, Justice.',
    answerDescription: 'These four principles form the foundation of ethical decision-making in clinical practice.',
  },
  {
    id: 3,
    course: 'UKMLA Patient Safety Advanced',
    lectureNo: 12,
    questionType: 'descriptive',
    question: 'Discuss the role of human factors in medication errors and suggest strategies to reduce them in a hospital setting.',
    answer: 'Human factors include fatigue, workload, communication gaps, and design of systems. Strategies: checklists, barcode scanning, double-checking high-risk drugs, incident reporting, and team training.',
    answerDescription: 'A descriptive answer covering systems approach and practical interventions aligned with NHS patient safety initiatives.',
  },
  {
    id: 4,
    course: 'MDCAT Reasoning',
    lectureNo: 1,
    questionType: 'trueFalse',
    question: 'In the UK, consent for treatment from a competent adult must always be in writing.',
    answer: 'False',
    answerDescription: 'Valid consent can be verbal or written; it must be informed and voluntary. Written consent is required for certain procedures but not all treatment.',
  },
  {
    id: 5,
    course: 'UKMLA Reasoning Core',
    lectureNo: 5,
    questionType: 'fillInBlanks',
    question: 'The GMC states that doctors must make the _____ of patients their first concern.',
    answer: 'care',
    answerDescription: 'Good Medical Practice (GMC) explicitly states that care of the patient must be the doctor’s first concern.',
  },
]

function AdminScenariosQuestionBank() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [questionTypeFilter, setQuestionTypeFilter] = useState('')
  const [questions, setQuestions] = useState(STATIC_QUESTIONS)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialog, setViewDialog] = useState({ open: false, row: null })

  const filtered = questions.filter((row) => {
    const matchSearch =
      !search ||
      row.course.toLowerCase().includes(search.toLowerCase()) ||
      row.question.toLowerCase().includes(search.toLowerCase())
    const matchType = !questionTypeFilter || row.questionType === questionTypeFilter
    return matchSearch && matchType
  })

  const totalRows = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const from = totalRows === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage + rowsPerPage, totalRows)

  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(0)
  }

  const handleSearch = () => {}
  const handleReset = () => {
    setSearch('')
    setQuestionTypeFilter('')
  }

  const handleViewOpen = (row) => setViewDialog({ open: true, row })
  const handleViewClose = () => setViewDialog({ open: false, row: null })

  const getQuestionTypeColor = (type) => {
    const map = {
      mcq: { bg: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK },
      shortAnswer: { bg: alpha(theme.palette.info.main, 0.12), color: theme.palette.info.dark },
      descriptive: { bg: alpha(ADMIN_PRIMARY_LIGHT, 0.15), color: ADMIN_PRIMARY },
      trueFalse: { bg: alpha(theme.palette.warning.main, 0.12), color: theme.palette.warning.dark },
      fillInBlanks: { bg: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark },
    }
    return map[type] || { bg: theme.palette.grey[200], color: theme.palette.grey[700] }
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 1400,
        mx: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <QuizRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Scenario Question Bank
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage questions for scenario exams
        </Typography>
      </Box>

      {/* Filters — single row */}
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
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
          <TextField
            size="small"
            placeholder="Search text"
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
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(ADMIN_PRIMARY, 0.3),
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: ADMIN_PRIMARY,
                  borderWidth: 2,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 100 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.grey[50],
                borderRadius: '7px',
              },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="question-type-label">Question type</InputLabel>
            <Select
              labelId="question-type-label"
              value={questionTypeFilter}
              label="Question type"
              onChange={(e) => setQuestionTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="mcq">{QUESTION_TYPE_LABELS.mcq}</MenuItem>
              <MenuItem value="shortAnswer">{QUESTION_TYPE_LABELS.shortAnswer}</MenuItem>
              <MenuItem value="descriptive">{QUESTION_TYPE_LABELS.descriptive}</MenuItem>
              <MenuItem value="trueFalse">{QUESTION_TYPE_LABELS.trueFalse}</MenuItem>
              <MenuItem value="fillInBlanks">{QUESTION_TYPE_LABELS.fillInBlanks}</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={handleSearch}
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
                '&:hover': {
                  borderColor: ADMIN_PRIMARY,
                  bgcolor: alpha(ADMIN_PRIMARY, 0.04),
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table section with Add Scenario Question in header */}
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
            Scenario question list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate('/admin/scenarios/question-bank/add')}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Scenario Question
          </Button>
        </Box>

        {/* Desktop: table */}
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
                  <TableCell>Scenario</TableCell>
                  <TableCell>Scenario exam</TableCell>
                  <TableCell>Question type</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row) => {
                  const typeStyle = getQuestionTypeColor(row.questionType)
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) },
                        '& .MuiTableCell-body': {
                          borderColor: theme.palette.grey[200],
                          py: 1.5,
                          fontSize: '0.875rem',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                          {row.course}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.lectureNo}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                            color: ADMIN_PRIMARY_DARK,
                            borderRadius: '7px',
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={QUESTION_TYPE_LABELS[row.questionType]}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: typeStyle.bg,
                            color: typeStyle.color,
                            borderRadius: '7px',
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View" placement="top" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleViewOpen(row)}
                            sx={{
                              color: theme.palette.info.main,
                              '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) },
                            }}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton
                            size="small"
                            sx={{
                              color: theme.palette.grey[600],
                              ml: 0.5,
                              '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
                            }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                          <IconButton
                            size="small"
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

        {/* Mobile/Tablet: card list */}
        {showAsCards && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 1.5 },
              p: { xs: 2, sm: 2 },
              pb: 2,
              overflowX: 'hidden',
            }}
          >
            {paginated.map((row) => {
              const typeStyle = getQuestionTypeColor(row.questionType)
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
                    ...(isMobile && {
                      boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}`,
                      '&:active': {
                        borderColor: ADMIN_PRIMARY,
                        boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.12)}`,
                      },
                    }),
                    '&:hover': {
                      borderColor: alpha(ADMIN_PRIMARY, 0.35),
                      boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}`,
                    },
                  }}
                >
                  {/* Top: scenario name — full width, up to 2 lines on mobile so it doesn’t truncate */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      noWrap
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        lineHeight: 1.3,
                        fontSize: { xs: '1rem', sm: '0.875rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {row.course}
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton
                          size="medium"
                          onClick={() => handleViewOpen(row)}
                          sx={{
                            color: theme.palette.info.main,
                            '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) },
                          }}
                        >
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="medium"
                          sx={{
                            color: theme.palette.grey[600],
                            '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) },
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                          size="medium"
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.15) },
                          }}
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  {/* Bottom row: Scenario exam + type chips; on mobile, View/Edit/Delete in footer */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 1 } }}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: { xs: 'none', sm: 'inline' },
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        Scenario exam
                      </Typography>
                      <Chip
                        label={row.lectureNo}
                        size="small"
                        sx={{
                          height: { xs: 28, sm: 26 },
                          fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                          fontWeight: 600,
                          bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                          color: ADMIN_PRIMARY_DARK,
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: { xs: 'none', sm: 'inline' },
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        Type
                      </Typography>
                      <Chip
                        label={QUESTION_TYPE_LABELS[row.questionType]}
                        size="small"
                        sx={{
                          height: { xs: 28, sm: 26 },
                          fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                          fontWeight: 600,
                          bgcolor: typeStyle.bg,
                          color: typeStyle.color,
                          borderRadius: '7px',
                          border: 'none',
                          maxWidth: '100%',
                          '& .MuiChip-label': {
                            whiteSpace: 'normal',
                            overflow: 'visible',
                            textOverflow: 'clip',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton
                          size="large"
                          onClick={() => handleViewOpen(row)}
                          sx={{
                            color: theme.palette.info.main,
                            bgcolor: alpha(theme.palette.info.main, 0.08),
                            '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) },
                          }}
                        >
                          <VisibilityRoundedIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton
                          size="large"
                          sx={{
                            color: theme.palette.grey[600],
                            bgcolor: theme.palette.grey[100],
                            '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) },
                          }}
                        >
                          <EditRoundedIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton
                          size="large"
                          sx={{
                            color: theme.palette.error.main,
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.15) },
                          }}
                        >
                          <DeleteRoundedIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              )
            })}
          </Box>
        )}

        {/* Pagination: compact on mobile, full on desktop */}
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
          {/* Row 1 on mobile: Rows per page + dropdown + count in one line */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              gap: { xs: 1, sm: 1.5 },
              width: { xs: '100%', sm: 'auto' },
              minWidth: 0,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                sx={{
                  height: { xs: 36, sm: 36 },
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  borderRadius: '7px',
                  bgcolor: theme.palette.background.paper,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.grey[300],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                    borderWidth: 2,
                  },
                }}
              >
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                flexShrink: 0,
              }}
            >
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>

          {/* Row 2 on mobile: Page X of Y + pagination on same line */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              gap: { xs: 1, sm: 1.5 },
              width: { xs: '100%', sm: 'auto' },
              minWidth: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>
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
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  borderRadius: '7px',
                  minWidth: 32,
                  height: 32,
                  color: ADMIN_PRIMARY,
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`,
                  color: '#fff',
                  boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`,
                  fontSize: '0.8125rem',
                  minWidth: 32,
                  height: 32,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})`,
                  },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': {
                  backgroundColor: alpha(ADMIN_PRIMARY, 0.1),
                  color: ADMIN_PRIMARY,
                },
                '& .MuiPaginationItem-icon': {
                  color: ADMIN_PRIMARY,
                  fontSize: 20,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* View Scenario Question dialog — style from AdminCoursesExamType */}
      <Dialog
        open={viewDialog.open}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          ...(isMobile && {
            '& .MuiDialog-container': {
              alignItems: 'flex-end',
              justifyContent: 'center',
            },
          }),
        }}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            ...(isMobile && { height: '90vh' }),
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '24px 24px 0 0' : '7px',
            border: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.25),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}`
              : `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '&::before': isMobile
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
                }
              : undefined,
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: alpha(theme.palette.common.black, 0.65),
              backdropFilter: 'blur(6px)',
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
              bgcolor: alpha(ADMIN_PRIMARY, 0.02),
              borderBottom: '1px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.1),
            }}
          >
            <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          sx={{
            flexShrink: 0,
            fontWeight: 700,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            py: 2,
            px: 3,
            pt: isMobile ? 2 : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                color: ADMIN_PRIMARY,
              }}
            >
              <QuizRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              View Scenario Question
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleViewClose}
            sx={{
              color: theme.palette.grey[600],
              flexShrink: 0,
              '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: 3,
            pt: 0,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {viewDialog.row && (
            <Box sx={{ pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                  Question
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                  {viewDialog.row.question}
                </Typography>
              </Box>

              {/* MCQ: show all 4 options (A/B/C/D) like Home.jsx sample */}
              {viewDialog.row.questionType === 'mcq' && viewDialog.row.options && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
                    Options
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 1.5,
                    }}
                  >
                    {viewDialog.row.options.map((opt) => (
                      <Box
                        key={opt.letter}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: '7px',
                          border: '2px solid',
                          borderColor: opt.correct ? ADMIN_PRIMARY : 'divider',
                          bgcolor: opt.correct ? alpha(ADMIN_PRIMARY, 0.08) : 'transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '7px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            bgcolor: opt.correct ? ADMIN_PRIMARY : 'action.hover',
                            color: opt.correct ? '#fff' : 'text.secondary',
                          }}
                        >
                          {opt.letter}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.primary',
                            fontWeight: opt.correct ? 600 : 500,
                            lineHeight: 1.5,
                            pt: 0.5,
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          }}
                        >
                          {opt.text}
                        </Typography>
                        {opt.correct && (
                          <CheckCircleIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22, ml: 'auto', flexShrink: 0, mt: 0.25 }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* True/False: show both options and highlight correct answer */}
              {viewDialog.row.questionType === 'trueFalse' && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
                    Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {['True', 'False'].map((opt) => {
                      const isCorrect = viewDialog.row.answer && viewDialog.row.answer.toLowerCase() === opt.toLowerCase()
                      return (
                        <Box
                          key={opt}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: '7px',
                            border: '2px solid',
                            borderColor: isCorrect ? ADMIN_PRIMARY : 'divider',
                            bgcolor: isCorrect ? alpha(ADMIN_PRIMARY, 0.08) : 'transparent',
                            flex: { xs: '1 1 100%', sm: '0 0 auto' },
                            minWidth: 120,
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '7px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              bgcolor: isCorrect ? ADMIN_PRIMARY : 'action.hover',
                              color: isCorrect ? '#fff' : 'text.secondary',
                            }}
                          >
                            {opt.charAt(0)}
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: isCorrect ? 600 : 500 }}>
                            {opt}
                          </Typography>
                          {isCorrect && (
                            <CheckCircleIcon sx={{ color: ADMIN_PRIMARY, fontSize: 22, ml: 'auto', flexShrink: 0 }} />
                          )}
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                  Answer
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, whiteSpace: 'pre-wrap' }}>
                  {viewDialog.row.answer}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                  Answer Description
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                  {viewDialog.row.answerDescription}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            flexShrink: 0,
            px: 3,
            py: 2.5,
            pt: 2,
            pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 },
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={handleViewClose}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminScenariosQuestionBank
