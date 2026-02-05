import { useState } from 'react'
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
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
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

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 30, 40, 50, 100]

// Same icon set as AdminServices
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

const STATIC_COURSES = [
  {
    id: 1,
    iconKey: 'psychology',
    title: 'Full UKMLA Reasoning Course',
    totalLectures: 24,
    examType: 'UKMLA',
    difficultyLevel: 'Advanced',
    topicFocus: 'Reasoning',
    status: 'Active',
  },
  {
    id: 2,
    iconKey: 'gavel',
    title: 'Ethics & GMC Decision-Making',
    totalLectures: 12,
    examType: 'PLAB',
    difficultyLevel: 'Core',
    topicFocus: 'Ethics',
    status: 'Active',
  },
  {
    id: 3,
    iconKey: 'localHospital',
    title: 'Patient Safety & Red-Flag Thinking',
    totalLectures: 18,
    examType: 'UKMLA',
    difficultyLevel: 'Foundation',
    topicFocus: 'Patient Safety',
    status: 'Inactive',
  },
]

function AdminCoursesCourses() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showAsCards = useMediaQuery(theme.breakpoints.down('md'))

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [courses] = useState(STATIC_COURSES)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const renderCourseIcon = (iconKey, size = 40) => {
    const IconComponent = COURSE_ICONS[iconKey]
    if (!IconComponent) return null
    return <IconComponent sx={{ fontSize: size, color: 'primary.main' }} />
  }

  const getStatusChipSx = (status) => ({
    height: 24,
    fontSize: '0.75rem',
    fontWeight: 600,
    border: 'none',
    ...(status === 'Active'
      ? { bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark }
      : { bgcolor: alpha(theme.palette.grey[500], 0.12), color: theme.palette.grey[700] }),
  })

  const filtered = courses.filter((row) => {
    const matchSearch = !search || row.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || row.status === statusFilter
    return matchSearch && matchStatus
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
    setStatusFilter('')
  }

  const handleAddCourse = (e) => {
    e.preventDefault()
    // Keep # - no navigation
  }

  const handleViewLectures = (row) => {
    navigate('/admin/courses/lectures', { state: { courseId: row.id, courseTitle: row.title } })
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
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Courses
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Manage courses
        </Typography>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
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
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: 120 },
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.grey[50],
                borderRadius: 2,
              },
            }}
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
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
                bgcolor: theme.palette.primary.main,
                borderRadius: 2,
                px: { xs: 2, sm: 1.5 },
                py: 1,
                fontWeight: 600,
                fontSize: '0.8125rem',
                flex: { xs: 1, sm: '0 0 auto' },
                minWidth: { sm: 'auto' },
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: theme.palette.primary.dark },
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
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.8125rem',
                px: { xs: 2, sm: 1.5 },
                py: 1,
                flex: { xs: 1, sm: '0 0 auto' },
                minWidth: { sm: 'auto' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
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
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
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
            Course list
          </Typography>
          <Button
            variant="contained"
            component="a"
            href="#"
            onClick={handleAddCourse}
            startIcon={<AddRoundedIcon />}
            sx={{
              bgcolor: theme.palette.primary.main,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
          >
            Add Course
          </Button>
        </Box>

        {/* Desktop: table */}
        {!showAsCards && (
          <TableContainer>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    '& .MuiTableCell-head': {
                      fontWeight: 700,
                      color: 'text.primary',
                      borderColor: theme.palette.grey[200],
                      py: 1.5,
                      fontSize: '0.8125rem',
                    },
                  }}
                >
                  <TableCell>Icon - Course title</TableCell>
                  <TableCell>Total lectures</TableCell>
                  <TableCell>Exam type</TableCell>
                  <TableCell>Difficulty level</TableCell>
                  <TableCell>Topic / focus</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                      '& .MuiTableCell-body': {
                        borderColor: theme.palette.grey[200],
                        py: 1.5,
                        fontSize: '0.875rem',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                          }}
                        >
                          {renderCourseIcon(row.iconKey, 22)}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
                          {row.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.totalLectures}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.dark,
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.examType}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.dark,
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.difficultyLevel}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.dark,
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.topicFocus}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette.secondary.main, 0.12),
                          color: theme.palette.secondary.dark,
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={row.status} size="small" sx={getStatusChipSx(row.status)} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View" placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleViewLectures(row)}
                          sx={{
                            color: theme.palette.info.main,
                            '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.1) },
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
                            '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.08) },
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
                ))}
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
              gap: { xs: 1.25, sm: 1.5 },
              p: { xs: 1.25, sm: 2 },
              pb: { xs: 1.25, sm: 2 },
              overflowX: 'hidden',
            }}
          >
            {paginated.map((row) => (
              <Paper
                key={row.id}
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2.5, sm: 2 },
                  border: '1px solid',
                  borderColor: { xs: alpha(theme.palette.primary.main, 0.2), sm: theme.palette.grey[200] },
                  bgcolor: theme.palette.background.paper,
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                  ...(isMobile && {
                    boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
                    '&:active': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }),
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.35),
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                {/* Top row: icon + title (+ status/counter on mobile) | actions on right */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: { xs: 1.25, sm: 1.5 },
                    mb: { xs: 1, sm: 2 },
                    pb: { xs: 1, sm: 2 },
                    borderBottom: '1px solid',
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.25, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        width: { xs: 44, sm: 48 },
                        height: { xs: 44, sm: 48 },
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        border: '2px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      }}
                    >
                      {renderCourseIcon(row.iconKey, isMobile ? 24 : 24)}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          lineHeight: 1.25,
                          fontSize: { xs: '0.9375rem', sm: '0.9rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.title}
                      </Typography>
                      {/* Mobile: Status + counter + Exam type + Difficulty + Topic (values only, no labels) */}
                      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            border: 'none',
                            ...(row.status === 'Active'
                              ? { bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark }
                              : { bgcolor: alpha(theme.palette.grey[500], 0.12), color: theme.palette.grey[700] }),
                          }}
                        />
                        <Chip
                          label={row.totalLectures}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.dark,
                            border: 'none',
                          }}
                        />
                        <Chip
                          label={row.examType}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.dark,
                            border: 'none',
                          }}
                        />
                        <Chip
                          label={row.difficultyLevel}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.info.main, 0.12),
                            color: theme.palette.info.dark,
                            border: 'none',
                          }}
                        />
                        <Chip
                          label={row.topicFocus}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.secondary.main, 0.12),
                            color: theme.palette.secondary.dark,
                            border: 'none',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Bottom row: badges (tablet+) + 3 buttons on the right (below the line) */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 0.75, sm: 1.5 },
                    mt: { xs: 0, sm: 0 },
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={row.totalLectures}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.dark,
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={row.examType}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.dark,
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={row.difficultyLevel}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.info.main, 0.12),
                        color: theme.palette.info.dark,
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={row.topicFocus}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.secondary.main, 0.12),
                        color: theme.palette.secondary.dark,
                        border: 'none',
                      }}
                    />
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        height: 26,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        ...(row.status === 'Active'
                          ? { bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.dark }
                          : { bgcolor: alpha(theme.palette.grey[500], 0.12), color: theme.palette.grey[700] }),
                      }}
                    />
                  </Box>
                  {/* 3 buttons: below the line, right side */}
                  <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 0.25, ml: 'auto' }}>
                    <Tooltip title="View" placement="top" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleViewLectures(row)}
                        sx={{
                          color: theme.palette.info.main,
                          bgcolor: alpha(theme.palette.info.main, 0.08),
                          p: { xs: 0.75, sm: 0.5 },
                          '&:hover': { color: theme.palette.info.dark, bgcolor: alpha(theme.palette.info.main, 0.15) },
                        }}
                      >
                        <VisibilityRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: theme.palette.grey[600],
                          bgcolor: { xs: theme.palette.grey[100], sm: 'transparent' },
                          p: { xs: 0.75, sm: 0.5 },
                          '&:hover': { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <EditRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton
                        size="small"
                        sx={{
                          color: theme.palette.error.main,
                          bgcolor: { xs: alpha(theme.palette.error.main, 0.08), sm: 'transparent' },
                          p: { xs: 0.75, sm: 0.5 },
                          '&:hover': { color: theme.palette.error.dark, bgcolor: alpha(theme.palette.error.main, 0.15) },
                        }}
                      >
                        <DeleteRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
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
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, sm: 2 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.75, sm: 2 },
            borderTop: '1px solid',
            borderColor: theme.palette.grey[200],
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            borderRadius: { xs: '0 0 12px 12px', sm: 0 },
          }}
        >
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
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.grey[300] },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
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
              <ViewListRoundedIcon sx={{ color: 'primary.main', fontSize: { xs: 18, sm: 22 } }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>
                Page {page + 1} of {totalPages}
              </Typography>
            </Box>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              color="primary"
              size={isMobile ? 'small' : 'large'}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.9375rem' },
                  borderRadius: 1.5,
                  minWidth: { xs: 28, sm: 40 },
                  height: { xs: 28, sm: 40 },
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                  },
                },
                '& .MuiPaginationItem-page:not(.Mui-selected):hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                },
                '& .MuiPaginationItem-icon': {
                  color: 'primary.main',
                  fontSize: { xs: 18, sm: 24 },
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminCoursesCourses
