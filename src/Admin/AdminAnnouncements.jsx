import { useState } from 'react'
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
  Slide,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 50]

// Format: 1 January 2026 12:15 PM
function formatCreated(dateStr) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  const day = d.getDate()
  const month = d.toLocaleString('en-GB', { month: 'long' })
  const year = d.getFullYear()
  const h = d.getHours()
  const m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  const time = `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
  return `${day} ${month} ${year} ${time}`
}

// Static announcements (mock)
const STATIC_ANNOUNCEMENTS = [
  { id: 1, title: 'New UKMLA reasoning scenarios added', type: 'scenario', description: 'We’ve added 12 new scenario-based questions to the Ethics & GMC section. Check them out in Scenarios.', created: '2026-01-15T14:15:00', status: 'Active' },
  { id: 2, title: 'New mock exam: Data Interpretation & Examiner Traps', type: 'mock', description: 'A new mock exam is now available in Mocks Exams. Covers ECG, blood gas, and lab interpretation.', created: '2026-01-14T10:30:00', status: 'Active' },
  { id: 3, title: 'Scenarios update: Patient Safety & Red-Flag Thinking', type: 'scenario', description: 'Additional practice scenarios for red-flag thinking are live in the Scenarios section.', created: '2026-01-12T09:00:00', status: 'Active' },
  { id: 4, title: 'PLAB 1 mock format update (2025)', type: 'mock', description: 'Summary of the latest GMC PLAB 1 format and how our mocks align with it.', created: '2026-01-10T16:45:00', status: 'Inactive' },
  { id: 5, title: 'Ethics & GMC scenarios expansion', type: 'scenario', description: 'New ethics and GMC decision-making scenarios have been added for UKMLA preparation.', created: '2026-01-08T11:20:00', status: 'Active' },
]

function AdminAnnouncements() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [announcements, setAnnouncements] = useState(STATIC_ANNOUNCEMENTS)
  const [viewDialog, setViewDialog] = useState({ open: false, row: null })
  const [addDialog, setAddDialog] = useState({ open: false, title: '', description: '' })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredRows = announcements.filter((row) => {
    const matchSearch = !search || row.title.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || row.type === typeFilter
    return matchSearch && matchType
  })

  const totalRows = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
    setTypeFilter('')
  }

  const handleViewOpen = (row) => setViewDialog({ open: true, row })
  const handleViewClose = () => setViewDialog({ open: false, row: null })

  const handleAddDialogOpen = () => setAddDialog({ open: true, title: '', description: '' })
  const handleAddDialogClose = () => setAddDialog({ open: false, title: '', description: '' })
  const handleAddAnnouncement = () => {
    if (!addDialog.title.trim()) return
    const now = new Date()
    const createdStr = now.toISOString().slice(0, 16).replace('T', 'T') // ISO for consistency
    setAnnouncements((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((a) => a.id)) + 1,
        title: addDialog.title.trim(),
        type: 'scenario',
        description: addDialog.description.trim() || '—',
        created: now.toISOString(),
        status: 'Active',
      },
    ])
    handleAddDialogClose()
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <CampaignRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Announcements
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage announcements for Scenarios and Mocks
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
              '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' },
              '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
            }}
          >
            <InputLabel id="type-label">Type</InputLabel>
            <Select labelId="type-label" value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="scenario">Scenario</MenuItem>
              <MenuItem value="mock">Mock</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
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
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '0.8125rem', sm: '1rem' },
            }}
          >
            Announcement list
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            onClick={handleAddDialogOpen}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              py: { xs: 0.75, sm: 1 },
              px: { xs: 1.5, sm: 2 },
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add Announcement
          </Button>
        </Box>

        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(ADMIN_PRIMARY, 0.06), '& .MuiTableCell-head': { fontWeight: 700, color: 'text.primary', borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.8125rem' } }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) }, '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' } }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                        {row.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.type === 'scenario' ? 'Scenario' : 'Mock'}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: row.type === 'scenario' ? alpha(ADMIN_PRIMARY_LIGHT, 0.15) : alpha(ADMIN_PRIMARY, 0.12),
                          color: row.type === 'scenario' ? ADMIN_PRIMARY_LIGHT : ADMIN_PRIMARY_DARK,
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatCreated(row.created)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                          color: row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[700],
                          borderRadius: '7px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton size="small" sx={{ color: theme.palette.grey[600], ml: 0.5, '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" placement="top" arrow>
                        <IconButton size="small" sx={{ color: theme.palette.error.main, ml: 0.5, '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) } }}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showAsCards && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              p: { xs: 2, sm: 2 },
              pb: 2,
              overflowX: 'hidden',
            }}
          >
            {paginatedRows.map((row) => (
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
                {/* Top row: title + actions (actions on sm+ only; on mobile they go to footer) */}
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
                    {row.title}
                  </Typography>
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                    <Tooltip title="View" placement="top" arrow>
                      <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton size="small" sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton size="small" sx={{ color: theme.palette.error.main, '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.12) } }}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {/* Bottom row: Type, Created, Status chips; on mobile, View/Edit/Delete in footer */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={row.type === 'scenario' ? 'Scenario' : 'Mock'}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        bgcolor: row.type === 'scenario' ? alpha(ADMIN_PRIMARY_LIGHT, 0.15) : alpha(ADMIN_PRIMARY, 0.12),
                        color: row.type === 'scenario' ? ADMIN_PRIMARY_LIGHT : ADMIN_PRIMARY_DARK,
                        borderRadius: '7px',
                        border: 'none',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.8125rem', sm: '0.75rem' } }}>
                      {formatCreated(row.created)}
                    </Typography>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        height: { xs: 28, sm: 26 },
                        fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                        fontWeight: 600,
                        bgcolor: row.status === 'Active' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.grey[500], 0.12),
                        color: row.status === 'Active' ? theme.palette.success.dark : theme.palette.grey[700],
                        borderRadius: '7px',
                        border: 'none',
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
            ))}
          </Box>
        )}

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.75, sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.grey[200],
            bgcolor: alpha(ADMIN_PRIMARY, 0.02),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}>
              Rows per page
            </Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72 }}>
              <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ height: 36, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', bgcolor: theme.palette.background.paper }}>
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}>
              {totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
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
                  '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY },
                '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* View dialog — SignIn-style */}
      <Dialog
        open={viewDialog.open}
        onClose={handleViewClose}
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
            borderColor: alpha(ADMIN_PRIMARY, 0.15),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile
              ? `0 -8px 32px rgba(15, 23, 42, 0.2), 0 -4px 16px ${alpha(ADMIN_PRIMARY, 0.08)}`
              : `0 24px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px ${alpha(ADMIN_PRIMARY, 0.06)}`,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)`,
            },
          },
        }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle
          component="div"
          sx={{
            pt: { xs: 2.5, sm: 4 },
            pb: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid',
            borderColor: alpha(ADMIN_PRIMARY, 0.1),
            bgcolor: alpha(ADMIN_PRIMARY, 0.02),
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: alpha(ADMIN_PRIMARY, 0.12),
              color: ADMIN_PRIMARY,
              border: '2px solid',
              borderColor: alpha(ADMIN_PRIMARY, 0.2),
              boxShadow: `0 4px 12px ${alpha(ADMIN_PRIMARY, 0.2)}`,
            }}
          >
            <DescriptionRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              {viewDialog.row?.title || 'Announcement'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9375rem' }}>
              {viewDialog.row ? `${viewDialog.row.type === 'scenario' ? 'Scenario' : 'Mock'} · ${formatCreated(viewDialog.row.created)}` : ''}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, pb: 2.5, px: { xs: 2.5, sm: 3.5 }, minHeight: 120 }}>
          {viewDialog.row && (
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {viewDialog.row.description}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: theme.palette.grey[300],
            bgcolor: theme.palette.grey[50],
          }}
        >
          <Button
            onClick={handleViewClose}
            startIcon={<CloseOutlinedIcon sx={{ fontSize: 20 }} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              borderRadius: '7px',
              px: 2,
              '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.06), color: ADMIN_PRIMARY },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Announcement dialog — style matched to AdminCoursesExamType */}
      <Dialog
        open={addDialog.open}
        onClose={handleAddDialogClose}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
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
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: '7px',
                bgcolor: theme.palette.grey[400],
              }}
            />
          </Box>
        )}
        <DialogTitle
          sx={{
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
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: alpha(ADMIN_PRIMARY, 0.12),
                color: ADMIN_PRIMARY,
              }}
            >
              <CampaignRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Add Announcement
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleAddDialogClose}
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
            px: 3,
            pt: 0,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.8),
            overflow: 'visible',
          }}
        >
          <Box sx={{ pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              value={addDialog.title}
              onChange={(e) => setAddDialog((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              size="small"
              placeholder="e.g. New UKMLA scenarios added"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7px',
                  bgcolor: theme.palette.grey[50],
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(ADMIN_PRIMARY, 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
              }}
            />
            <TextField
              label="Description"
              value={addDialog.description}
              onChange={(e) => setAddDialog((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              size="small"
              multiline
              rows={4}
              placeholder="Enter announcement description..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '7px',
                  bgcolor: theme.palette.grey[50],
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(ADMIN_PRIMARY, 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: ADMIN_PRIMARY,
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
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
            variant="outlined"
            onClick={handleAddDialogClose}
            sx={{
              borderColor: theme.palette.grey[300],
              color: 'text.primary',
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': {
                borderColor: ADMIN_PRIMARY,
                bgcolor: alpha(ADMIN_PRIMARY, 0.04),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon sx={{ fontSize: 20 }} />}
            onClick={handleAddAnnouncement}
            sx={{
              bgcolor: ADMIN_PRIMARY,
              borderRadius: '7px',
              fontWeight: 600,
              px: 2.5,
              '&:hover': { bgcolor: ADMIN_PRIMARY_DARK },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminAnnouncements
