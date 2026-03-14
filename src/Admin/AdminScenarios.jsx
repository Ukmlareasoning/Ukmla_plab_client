import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
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
  Skeleton,
} from '@mui/material'
import Slide from '@mui/material/Slide'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import RestoreFromTrashRoundedIcon from '@mui/icons-material/RestoreFromTrashRounded'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'
import GavelIcon from '@mui/icons-material/Gavel'
import BarChartIcon from '@mui/icons-material/BarChart'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import BiotechRoundedIcon from '@mui/icons-material/BiotechRounded'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded'
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
import apiClient from '../server'
import { useToast } from '../components/ToastProvider'

const ADMIN_PRIMARY = '#384D84'
const ADMIN_PRIMARY_DARK = '#2a3a64'
const ADMIN_PRIMARY_LIGHT = '#4a5f9a'

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]
const SKELETON_ROW_COUNT = 5

const keyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}

const COURSE_ICONS = {
  psychology: PsychologyIcon,
  psychologyAlt: PsychologyAltRoundedIcon,
  assignment: AssignmentIcon,
  timeline: TimelineIcon,
  gavel: GavelIcon,
  barChart: BarChartIcon,
  analytics: AnalyticsRoundedIcon,
  groups: GroupsIcon,
  localHospital: LocalHospitalIcon,
  medicalServices: MedicalServicesRoundedIcon,
  vaccines: VaccinesRoundedIcon,
  monitorHeart: MonitorHeartRoundedIcon,
  school: SchoolRoundedIcon,
  menuBook: MenuBookRoundedIcon,
  libraryBooks: LibraryBooksRoundedIcon,
  quiz: QuizRoundedIcon,
  support: SupportRoundedIcon,
  campaign: CampaignRoundedIcon,
  science: ScienceRoundedIcon,
  biotech: BiotechRoundedIcon,
  fitnessCenter: FitnessCenterRoundedIcon,
  selfImprovement: SelfImprovementRoundedIcon,
  star: StarRoundedIcon,
  emojiEvents: EmojiEventsRoundedIcon,
  speed: SpeedRoundedIcon,
  touchApp: TouchAppRoundedIcon,
  recordVoiceOver: RecordVoiceOverRoundedIcon,
  translate: TranslateRoundedIcon,
  code: CodeRoundedIcon,
  calculate: CalculateRoundedIcon,
  lightbulb: LightbulbRoundedIcon,
  precisionManufacturing: PrecisionManufacturingRoundedIcon,
  autoAwesome: AutoAwesomeRoundedIcon,
  workspacePremium: WorkspacePremiumRoundedIcon,
  category: CategoryRoundedIcon,
  dashboardCustomize: DashboardCustomizeRoundedIcon,
  extension: ExtensionRoundedIcon,
}

function renderCourseIcon(iconKey, size = 22) {
  const IconComponent = COURSE_ICONS[iconKey]
  if (!IconComponent) return null
  return <IconComponent sx={{ fontSize: size, color: ADMIN_PRIMARY }} />
}

function AdminScenarios() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [scenarios, setScenarios] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRows, setTotalRows] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState('')

  const [rowActionLoading, setRowActionLoading] = useState({})

  const [confirmState, setConfirmState] = useState({ open: false, mode: 'delete', row: null })
  const [confirmLoading, setConfirmLoading] = useState(false)

  const serverPage = page + 1
  const from = totalRows === 0 ? 0 : (serverPage - 1) * rowsPerPage + 1
  const to = Math.min((serverPage - 1) * rowsPerPage + rowsPerPage, totalRows)

  const fetchScenarios = async (opts = {}) => {
    const { applyFilters = false, targetPage = serverPage, targetPerPage = rowsPerPage } = opts
    setListLoading(true)
    setListError('')
    const params = new URLSearchParams()
    params.set('page', String(targetPage))
    params.set('per_page', String(targetPerPage))
    if (applyFilters) {
      params.set('apply_filters', '1')
      if (search.trim()) params.set('text', search.trim())
      if (statusFilter) params.set('status', statusFilter)
    }
    try {
      const { ok, data } = await apiClient(`/scenarios?${params.toString()}`, 'GET')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object'
          ? Object.values(data.errors).flat().join(' ')
          : data?.message
        setListError(message || 'Unable to load scenarios.')
        return
      }
      const list = data.data?.scenarios || []
      const pagination = data.data?.pagination || {}
      setScenarios(list)
      const total = Number(pagination.total || list.length || 0)
      const perPageValue = Number(pagination.per_page || targetPerPage || 10)
      const currentPageValue = Number(pagination.current_page || targetPage || 1)
      const lastPageValue = Number(pagination.last_page || Math.max(1, Math.ceil(total / perPageValue)))
      setTotalRows(total)
      setRowsPerPage(perPageValue)
      setPage(Math.max(0, currentPageValue - 1))
      setTotalPages(lastPageValue || 1)
    } catch {
      setListError('Unable to reach server. Please try again.')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    fetchScenarios({ applyFilters: false, targetPage: 1, targetPerPage: rowsPerPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    setPage(0)
    fetchScenarios({ applyFilters: true, targetPage: 1 })
  }
  const handleReset = () => {
    setSearch('')
    setStatusFilter('')
    setPage(0)
    fetchScenarios({ applyFilters: false, targetPage: 1 })
  }
  const handleChangePage = (_, value) => {
    const newPage = value - 1
    setPage(newPage)
    fetchScenarios({ applyFilters: !!(search || statusFilter), targetPage: value, targetPerPage: rowsPerPage })
  }
  const handleChangeRowsPerPage = (e) => {
    const newPerPage = Number(e.target.value)
    setRowsPerPage(newPerPage)
    setPage(0)
    fetchScenarios({ applyFilters: !!(search || statusFilter), targetPage: 1, targetPerPage: newPerPage })
  }

  const handleViewLectures = (row) => {
    navigate('/admin/scenarios/lectures', { state: { scenarioId: row.id, courseTitle: row.title, examsReleaseMode: row.exams_release_mode } })
  }

  const openConfirmDelete = (row) => setConfirmState({ open: true, mode: 'delete', row })
  const openConfirmRestore = (row) => setConfirmState({ open: true, mode: 'restore', row })
  const handleConfirmClose = () => { if (confirmLoading) return; setConfirmState({ open: false, mode: 'delete', row: null }) }

  const handleDelete = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/scenarios/${row.id}`, 'DELETE')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : data?.message
        showToast(message || 'Unable to delete scenario.', 'error')
        return
      }
      showToast('Scenario deleted successfully.', 'success')
      fetchScenarios({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setRowActionLoading((prev) => ({ ...prev, [row.id]: false }))
    }
  }

  const handleRestore = async (row) => {
    if (!row?.id) return
    setRowActionLoading((prev) => ({ ...prev, [row.id]: true }))
    try {
      const { ok, data } = await apiClient(`/scenarios/${row.id}/restore`, 'POST')
      if (!ok || !data?.success) {
        const message = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join(' ') : data?.message
        showToast(message || 'Unable to restore scenario.', 'error')
        return
      }
      showToast('Scenario restored successfully.', 'success')
      fetchScenarios({ applyFilters: !!(search || statusFilter), targetPage: serverPage })
    } catch {
      showToast('Unable to reach server. Please try again.', 'error')
    } finally {
      setRowActionLoading((prev) => ({ ...prev, [row.id]: false }))
    }
  }

  const handleConfirmProceed = async () => {
    if (!confirmState.row || confirmLoading) return
    setConfirmLoading(true)
    try {
      if (confirmState.mode === 'restore') await handleRestore(confirmState.row)
      else await handleDelete(confirmState.row)
      handleConfirmClose()
    } finally {
      setConfirmLoading(false)
    }
  }

  const statusChipSx = (status) => ({
    height: 24,
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: '7px',
    border: 'none',
    bgcolor: status === 'Active'
      ? alpha(theme.palette.success.main, 0.12)
      : status === 'Inactive'
      ? alpha(theme.palette.warning.main, 0.12)
      : alpha(theme.palette.error.main, 0.12),
    color: status === 'Active'
      ? theme.palette.success.dark
      : status === 'Inactive'
      ? theme.palette.warning.dark
      : theme.palette.error.dark,
  })

  return (
    <Box sx={{ ...keyframes, width: '100%', minWidth: 0, maxWidth: 1400, mx: 'auto', overflowX: 'hidden' }}>
      {/* Confirm delete/restore dialog */}
      <Dialog
        open={confirmState.open}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{ ...(isMobile && { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center' } }) }}
        PaperProps={{
          sx: {
            margin: isMobile ? 0 : 24,
            maxHeight: isMobile ? '90vh' : 'calc(100vh - 48px)',
            width: isMobile ? '100%' : undefined,
            maxWidth: isMobile ? '100%' : undefined,
            borderRadius: isMobile ? '24px 24px 0 0' : '7px',
            border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.25),
            borderBottom: isMobile ? 'none' : undefined,
            boxShadow: isMobile ? `0 -8px 32px rgba(15,23,42,0.2)` : `0 12px 40px ${alpha(ADMIN_PRIMARY, 0.15)}`,
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden', position: 'relative',
            '&::before': isMobile ? { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${ADMIN_PRIMARY} 0%, ${ADMIN_PRIMARY_LIGHT} 100%)` } : undefined,
          },
        }}
        slotProps={{ backdrop: { sx: { bgcolor: alpha(theme.palette.common.black, 0.65), backdropFilter: 'blur(6px)' } } }}
      >
        {isMobile && (
          <Box sx={{ pt: 1.5, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderBottom: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.1) }}>
            <Box sx={{ width: 40, height: 4, borderRadius: '7px', bgcolor: theme.palette.grey[400] }} />
          </Box>
        )}
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: confirmState.mode === 'restore' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.08) }}>
              {confirmState.mode === 'restore' ? <RestoreFromTrashRoundedIcon sx={{ fontSize: 22, color: theme.palette.success.dark }} /> : <DeleteRoundedIcon sx={{ fontSize: 22, color: theme.palette.error.dark }} />}
            </Box>
            <Typography component="span" sx={{ fontWeight: 700 }}>
              {confirmState.mode === 'restore' ? 'Restore scenario' : 'Delete scenario'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 3, pb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
            {confirmState.mode === 'restore'
              ? 'Are you sure you want to restore this scenario?'
              : 'Are you sure you want to delete this scenario? You can restore it later from this list.'}
          </Typography>
          {confirmState.row && (
            <Typography variant="subtitle2" sx={{ mt: 1.5, fontWeight: 600, color: 'text.primary' }}>
              {confirmState.row.title}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, pt: 2, pb: { xs: 'max(20px, env(safe-area-inset-bottom))', sm: 2.5 }, borderTop: '1px solid', borderColor: theme.palette.divider, gap: 1 }}>
          <Button variant="outlined" onClick={handleConfirmClose} disabled={confirmLoading} sx={{ borderColor: theme.palette.grey[300], color: 'text.primary', borderRadius: '7px', fontWeight: 600, px: 2.5, '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) } }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmProceed}
            variant="contained"
            disabled={confirmLoading}
            startIcon={confirmLoading ? <AutorenewIcon sx={{ animation: 'spin 0.8s linear infinite', color: '#fff' }} /> : confirmState.mode === 'restore' ? <RestoreFromTrashRoundedIcon sx={{ fontSize: 20, color: '#fff' }} /> : <DeleteRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />}
            sx={{ bgcolor: confirmState.mode === 'restore' ? ADMIN_PRIMARY : theme.palette.error.main, borderRadius: '7px', fontWeight: 600, px: 2.5, color: '#fff', '&:hover': { bgcolor: confirmState.mode === 'restore' ? ADMIN_PRIMARY_DARK : theme.palette.error.dark }, '&.Mui-disabled': { color: '#fff', bgcolor: confirmState.mode === 'restore' ? ADMIN_PRIMARY : theme.palette.error.main, opacity: 1 } }}
          >
            {confirmLoading ? 'Processing…' : confirmState.mode === 'restore' ? 'Yes, restore' : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page title */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.25 }}>
          <QuizRoundedIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: ADMIN_PRIMARY }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Scenarios
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage scenarios
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), bgcolor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <TextField
            size="small"
            placeholder="Search scenarios"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            sx={{ flex: { xs: '1 1 100%', sm: '1 1 140px', md: '1 1 180px' }, minWidth: { xs: 0, sm: 120 }, maxWidth: { sm: 200, md: 240 }, '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px', '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(ADMIN_PRIMARY, 0.3) }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 } } }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0, '& .MuiOutlinedInput-root': { bgcolor: theme.palette.grey[50], borderRadius: '7px' }, '& .MuiInputLabel-root.Mui-focused': { color: ADMIN_PRIMARY } }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Deleted">Deleted</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' }, flexShrink: 0 }}>
            <Button variant="contained" size="small" startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />} onClick={handleSearch} fullWidth sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', px: { xs: 2, sm: 1.5 }, py: 1, fontWeight: 600, fontSize: '0.8125rem', flex: { xs: 1, sm: '0 0 auto' }, whiteSpace: 'nowrap', '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>
              Search
            </Button>
            <Button variant="outlined" size="small" startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />} onClick={handleReset} fullWidth sx={{ borderColor: theme.palette.grey[300], color: 'text.primary', borderRadius: '7px', fontWeight: 600, fontSize: '0.8125rem', px: { xs: 2, sm: 1.5 }, py: 1, flex: { xs: 1, sm: '0 0 auto' }, whiteSpace: 'nowrap', '&:hover': { borderColor: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.04) } }}>
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table section */}
      <Paper elevation={0} sx={{ borderRadius: '7px', border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.12), overflow: 'hidden', overflowX: { xs: 'hidden', md: 'visible' }, bgcolor: theme.palette.background.paper }}>
        <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5, borderBottom: '1px solid', borderColor: theme.palette.grey[200], display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>Scenarios list</Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate('/admin/scenarios/add')} sx={{ bgcolor: ADMIN_PRIMARY, borderRadius: '7px', fontWeight: 600, '&:hover': { bgcolor: ADMIN_PRIMARY_DARK } }}>
            Add Scenario
          </Button>
        </Box>

        {/* Error state */}
        {listError && !listLoading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="error">{listError}</Typography>
            <Button size="small" onClick={() => fetchScenarios({ applyFilters: !!(search || statusFilter), targetPage: serverPage })} sx={{ mt: 1, color: ADMIN_PRIMARY }}>
              Retry
            </Button>
          </Box>
        )}

        {/* Desktop table */}
        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(ADMIN_PRIMARY, 0.06), '& .MuiTableCell-head': { fontWeight: 700, color: 'text.primary', borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.8125rem' } }}>
                  <TableCell>Icon – Scenario title</TableCell>
                  <TableCell>Total Exams</TableCell>
                  <TableCell>Exam type</TableCell>
                  <TableCell>Difficulty level</TableCell>
                  <TableCell>Topic / focus</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listLoading
                  ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                      <TableRow key={`sk-${idx}`} sx={{ '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5 } }}>
                        <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '7px', flexShrink: 0 }} /><Skeleton variant="text" width="60%" sx={{ maxWidth: 180 }} /></Box></TableCell>
                        <TableCell><Skeleton variant="rounded" width={40} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell><Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: '7px' }} /></TableCell>
                        <TableCell align="right"><Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}><Skeleton variant="circular" width={32} height={32} /><Skeleton variant="circular" width={32} height={32} /><Skeleton variant="circular" width={32} height={32} /></Box></TableCell>
                      </TableRow>
                    ))
                  : scenarios.length === 0 && !listError ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ViewListRoundedIcon sx={{ fontSize: 40, color: alpha(ADMIN_PRIMARY, 0.4) }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No scenarios found.</Typography>
                            <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 320 }}>Use the filters above or click "Add Scenario" to create a new one.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  : scenarios.map((row) => (
                      <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: alpha(ADMIN_PRIMARY, 0.04) }, '& .MuiTableCell-body': { borderColor: theme.palette.grey[200], py: 1.5, fontSize: '0.875rem' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), border: '1px solid', borderColor: alpha(ADMIN_PRIMARY, 0.2) }}>
                              {renderCourseIcon(row.icon_key, 22)}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>{row.title}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={row.total_exams ?? 0} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} /></TableCell>
                        <TableCell><Chip label={row.exam_type_name || '—'} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} /></TableCell>
                        <TableCell><Chip label={row.difficulty_level_name || '—'} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY_LIGHT, 0.15), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} /></TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {row.topic_focuses?.length > 0
                              ? row.topic_focuses.map((t) => <Chip key={t.id} label={t.name} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY_LIGHT, 0.15), color: ADMIN_PRIMARY, borderRadius: '7px', border: 'none' }} />)
                              : <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>}
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={row.status} size="small" sx={statusChipSx(row.status)} /></TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="View exams" placement="top" arrow>
                              <IconButton size="small" onClick={() => handleViewLectures(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.12) } }}>
                                <VisibilityRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit" placement="top" arrow>
                              <IconButton size="small" onClick={() => navigate('/admin/scenarios/add', { state: { scenarioId: row.id, scenario: row } })} sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.08) } }}>
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                              <span>
                                <IconButton size="small" disabled={!!rowActionLoading[row.id]} onClick={() => row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)}
                                  sx={{ color: row.status === 'Deleted' ? theme.palette.success.main : theme.palette.error.main, ml: 0.5, '&:hover': { color: row.status === 'Deleted' ? theme.palette.success.dark : theme.palette.error.dark, bgcolor: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12) }, '&.Mui-disabled': { color: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.6) : alpha(theme.palette.error.main, 0.6) } }}>
                                  {rowActionLoading[row.id] ? <AutorenewIcon sx={{ fontSize: 18, animation: 'spin 0.8s linear infinite' }} /> : row.status === 'Deleted' ? <RestoreFromTrashRoundedIcon fontSize="small" /> : <DeleteRoundedIcon fontSize="small" />}
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile/Tablet cards */}
        {showAsCards && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 1.5 }, p: { xs: 2, sm: 2 }, pb: 2, overflowX: 'hidden' }}>
            {listLoading
              ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
                  <Paper key={`sk-card-${idx}`} elevation={0} sx={{ p: { xs: 2.5, sm: 2 }, borderRadius: '7px', border: '1px solid', borderColor: theme.palette.grey[200], bgcolor: theme.palette.background.paper }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Skeleton variant="rounded" width={isMobile ? 56 : 48} height={isMobile ? 56 : 48} sx={{ borderRadius: '7px', flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="70%" sx={{ maxWidth: 180, fontSize: '1rem' }} />
                          <Skeleton variant="rounded" width={64} height={24} sx={{ mt: 0.5, borderRadius: '7px' }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                        <Skeleton variant="circular" width={isMobile ? 40 : 36} height={isMobile ? 40 : 36} />
                      </Box>
                    </Box>
                  </Paper>
                ))
              : scenarios.length === 0 && !listError ? (
                  <Paper elevation={0} sx={{ p: { xs: 3 }, borderRadius: '7px', border: '1px dashed', borderColor: alpha(ADMIN_PRIMARY, 0.3), bgcolor: alpha(ADMIN_PRIMARY, 0.02), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                      <ViewListRoundedIcon sx={{ fontSize: 36, color: alpha(ADMIN_PRIMARY, 0.5) }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>No scenarios found.</Typography>
                      <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 260 }}>Adjust your filters or add a new scenario.</Typography>
                    </Box>
                  </Paper>
                )
              : scenarios.map((row) => (
                  <Paper key={row.id} elevation={0} sx={{ p: { xs: 2.5, sm: 2 }, borderRadius: '7px', border: '1px solid', borderColor: { xs: alpha(ADMIN_PRIMARY, 0.2), sm: theme.palette.grey[200] }, bgcolor: theme.palette.background.paper, transition: 'all 0.2s ease', '&:hover': { borderColor: alpha(ADMIN_PRIMARY, 0.35), boxShadow: `0 4px 20px ${alpha(ADMIN_PRIMARY, 0.1)}` }, ...(isMobile && { boxShadow: `0 2px 12px ${alpha(ADMIN_PRIMARY, 0.06)}` }) }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                        <Box sx={{ width: { xs: 56, sm: 48 }, height: { xs: 56, sm: 48 }, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: alpha(ADMIN_PRIMARY, 0.12), border: `2px solid ${alpha(ADMIN_PRIMARY, 0.2)}` }}>
                          {renderCourseIcon(row.icon_key, isMobile ? 28 : 24)}
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', sm: '0.875rem' } }}>{row.title}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                        <Tooltip title="View exams" placement="top" arrow>
                          <IconButton size="medium" onClick={() => handleViewLectures(row)} sx={{ color: theme.palette.info.main, '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}><VisibilityRoundedIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton size="medium" onClick={() => navigate('/admin/scenarios/add', { state: { scenarioId: row.id, scenario: row } })} sx={{ color: theme.palette.grey[600], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}><EditRoundedIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                          <span>
                            <IconButton size="medium" disabled={!!rowActionLoading[row.id]} onClick={() => row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)} sx={{ color: row.status === 'Deleted' ? theme.palette.success.main : theme.palette.error.main, '&:hover': { color: row.status === 'Deleted' ? theme.palette.success.dark : theme.palette.error.dark, bgcolor: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.error.main, 0.15) }, '&.Mui-disabled': { color: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.6) : alpha(theme.palette.error.main, 0.6) } }}>
                              {rowActionLoading[row.id] ? <AutorenewIcon sx={{ fontSize: 18, animation: 'spin 0.8s linear infinite' }} /> : row.status === 'Deleted' ? <RestoreFromTrashRoundedIcon fontSize="small" /> : <DeleteRoundedIcon fontSize="small" />}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                        <Chip label={`${row.total_exams ?? 0} exams`} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />
                        {row.exam_type_name && <Chip label={row.exam_type_name} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY, 0.12), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />}
                        {row.difficulty_level_name && <Chip label={row.difficulty_level_name} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY_LIGHT, 0.15), color: ADMIN_PRIMARY_DARK, borderRadius: '7px', border: 'none' }} />}
                        {row.topic_focuses?.map((t) => <Chip key={t.id} label={t.name} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, bgcolor: alpha(ADMIN_PRIMARY_LIGHT, 0.15), color: ADMIN_PRIMARY, borderRadius: '7px', border: 'none' }} />)}
                        <Chip label={row.status} size="small" sx={{ height: { xs: 28, sm: 26 }, fontSize: { xs: '0.8125rem', sm: '0.75rem' }, fontWeight: 600, borderRadius: '7px', border: 'none', ...statusChipSx(row.status) }} />
                      </Box>
                      <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', flexShrink: 0, gap: 0.25 }}>
                        <Tooltip title="View exams" placement="top" arrow>
                          <IconButton size="large" onClick={() => handleViewLectures(row)} sx={{ color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.08), '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) } }}><VisibilityRoundedIcon fontSize="medium" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                          <IconButton size="large" onClick={() => navigate('/admin/scenarios/add', { state: { scenarioId: row.id, scenario: row } })} sx={{ color: theme.palette.grey[600], bgcolor: theme.palette.grey[100], '&:hover': { color: ADMIN_PRIMARY, bgcolor: alpha(ADMIN_PRIMARY, 0.1) } }}><EditRoundedIcon fontSize="medium" /></IconButton>
                        </Tooltip>
                        <Tooltip title={row.status === 'Deleted' ? 'Restore' : 'Delete'} placement="top" arrow>
                          <span>
                            <IconButton size="large" disabled={!!rowActionLoading[row.id]} onClick={() => row.status === 'Deleted' ? openConfirmRestore(row) : openConfirmDelete(row)} sx={{ color: row.status === 'Deleted' ? theme.palette.success.main : theme.palette.error.main, bgcolor: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.error.main, 0.08), '&:hover': { color: row.status === 'Deleted' ? theme.palette.success.dark : theme.palette.error.dark, bgcolor: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.error.main, 0.15) }, '&.Mui-disabled': { color: row.status === 'Deleted' ? alpha(theme.palette.success.main, 0.6) : alpha(theme.palette.error.main, 0.6) } }}>
                              {rowActionLoading[row.id] ? <AutorenewIcon sx={{ fontSize: 20, animation: 'spin 0.8s linear infinite' }} /> : row.status === 'Deleted' ? <RestoreFromTrashRoundedIcon fontSize="medium" /> : <DeleteRoundedIcon fontSize="medium" />}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                ))}
          </Box>
        )}

        {/* Pagination */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 }, py: { xs: 1.75, sm: 2 }, borderTop: '1px solid', borderColor: theme.palette.grey[200], bgcolor: alpha(ADMIN_PRIMARY, 0.02), borderRadius: { xs: '0 0 7px 7px', sm: 0 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>Rows per page</Typography>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 72, flexShrink: 0 }}>
              <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} sx={{ height: 36, fontSize: '0.8125rem', fontWeight: 600, borderRadius: '7px', bgcolor: theme.palette.background.paper, '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ADMIN_PRIMARY, borderWidth: 2 } }}>
                {ROWS_PER_PAGE_OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.8125rem', sm: '0.875rem' }, flexShrink: 0 }}>{totalRows === 0 ? '0–0 of 0' : `${from}–${to} of ${totalRows}`}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              <ViewListRoundedIcon sx={{ color: ADMIN_PRIMARY, fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>Page {page + 1} of {totalPages}</Typography>
            </Box>
            <Pagination count={totalPages} page={page + 1} onChange={handleChangePage} size="small" showFirstButton showLastButton sx={{ '& .MuiPaginationItem-root': { fontWeight: 600, fontSize: '0.8125rem', borderRadius: '7px', minWidth: 32, height: 32, color: ADMIN_PRIMARY }, '& .MuiPaginationItem-page.Mui-selected': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY}, ${ADMIN_PRIMARY_DARK})`, color: '#fff', boxShadow: `0 2px 6px ${alpha(ADMIN_PRIMARY, 0.35)}`, '&:hover': { background: `linear-gradient(135deg, ${ADMIN_PRIMARY_LIGHT}, ${ADMIN_PRIMARY})` } }, '& .MuiPaginationItem-page:not(.Mui-selected):hover': { backgroundColor: alpha(ADMIN_PRIMARY, 0.1), color: ADMIN_PRIMARY }, '& .MuiPaginationItem-icon': { color: ADMIN_PRIMARY, fontSize: 20 } }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminScenarios
