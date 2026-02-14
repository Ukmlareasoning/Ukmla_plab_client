import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import UserDashboardLayout from './UserDashboardLayout'
import { dashboardCoursesData } from './UserDashboardData.jsx'
import { dashboardScenariosData } from './UserDashboard'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const CHART_COLORS = {
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#10B981',
}

// Mock mistakes count per enrolled item (deterministic from id and progress)
function getMistakesCount(item) {
  if (!item.enrolled) return 0
  const base = (item.id % 5) * 2
  const fromProgress = item.progress < 100 ? Math.floor((100 - item.progress) / 15) : 0
  return Math.min(25, base + fromProgress)
}

function computeMistakesStats(items) {
  const withMistakes = items
    .filter((i) => i.enrolled)
    .map((i) => ({ ...i, mistakes: getMistakesCount(i) }))
  const totalMistakes = withMistakes.reduce((s, i) => s + i.mistakes, 0)
  const itemsWithMistakes = withMistakes.filter((i) => i.mistakes > 0).length
  const avgPerItem = withMistakes.length ? Math.round((totalMistakes / withMistakes.length) * 10) / 10 : 0
  const maxMistakes = withMistakes.length ? Math.max(...withMistakes.map((i) => i.mistakes)) : 0
  return { totalMistakes, itemsWithMistakes, avgPerItem, maxMistakes, withMistakes }
}

function getPieDataFromMistakes(withMistakes) {
  if (withMistakes.length === 0) return []
  const high = withMistakes.filter((i) => i.mistakes >= 10).length
  const medium = withMistakes.filter((i) => i.mistakes >= 4 && i.mistakes < 10).length
  const low = withMistakes.filter((i) => i.mistakes > 0 && i.mistakes < 4).length
  const none = withMistakes.filter((i) => i.mistakes === 0).length
  const total = withMistakes.length
  return [
    { name: 'High (10+)', value: total ? Math.round((high / total) * 100) : 0, count: high, fill: CHART_COLORS.high },
    { name: 'Medium (4–9)', value: total ? Math.round((medium / total) * 100) : 0, count: medium, fill: CHART_COLORS.medium },
    { name: 'Low (1–3)', value: total ? Math.round((low / total) * 100) : 0, count: low, fill: CHART_COLORS.low },
    { name: 'None', value: total ? Math.round((none / total) * 100) : 0, count: none, fill: '#64748B' },
  ].filter((d) => d.count > 0)
}

function getBarDataFromMistakes(items, maxNameLen = 28) {
  return items
    .filter((i) => i.enrolled)
    .slice(0, 8)
    .map((i) => {
      const fullName = i.title
      const name = fullName.length > maxNameLen ? fullName.slice(0, maxNameLen - 2) + '…' : fullName
      const mistakes = getMistakesCount(i)
      return { name, fullName, mistakes, fullMark: 100 }
    })
    .filter((d) => d.mistakes >= 0)
}

export default function UserMistakesPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [filter, setFilter] = useState('scenarios') // 'scenarios' (default) | 'mocks'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { mocksStats, scenariosStats, mocksPie, scenariosPie, mocksBar, scenariosBar } = useMemo(() => {
    const mocksStats = computeMistakesStats(dashboardCoursesData)
    const scenariosStats = computeMistakesStats(dashboardScenariosData)
    const mocksPie = getPieDataFromMistakes(mocksStats.withMistakes)
    const scenariosPie = getPieDataFromMistakes(scenariosStats.withMistakes)
    const maxNameLen = isMobile ? 14 : 28
    const mocksBar = getBarDataFromMistakes(dashboardCoursesData, maxNameLen)
    const scenariosBar = getBarDataFromMistakes(dashboardScenariosData, maxNameLen)
    return { mocksStats, scenariosStats, mocksPie, scenariosPie, mocksBar, scenariosBar }
  }, [isMobile])

  const stats = filter === 'mocks' ? mocksStats : scenariosStats
  const pieData = filter === 'mocks' ? mocksPie : scenariosPie
  const barData = filter === 'mocks' ? mocksBar : scenariosBar
  const filterLabel = filter === 'mocks' ? 'Mocks' : 'Scenarios'

  return (
    <UserDashboardLayout>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 }, overflowX: 'hidden', maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>
            Mistakes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View mistake statistics and breakdowns for mocks and scenario exams
          </Typography>
        </Box>

        {/* Filter: Scenarios (default) | Mocks */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 3,
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.2),
            bgcolor: alpha(PAGE_PRIMARY, 0.03),
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Show mistakes for
          </Typography>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v != null && setFilter(v)}
            size="small"
            sx={{
              flexWrap: 'wrap',
              gap: 0.5,
              '& .MuiToggleButtonGroup-grouped': { borderRadius: '7px !important', textTransform: 'none', fontWeight: 600 },
              '& .MuiToggleButton-root': { border: '1px solid', borderColor: alpha(PAGE_PRIMARY, 0.3), color: 'text.secondary', '&.Mui-selected': { bgcolor: PAGE_PRIMARY, color: '#fff', borderColor: PAGE_PRIMARY, '&:hover': { bgcolor: PAGE_PRIMARY_DARK } } },
            }}
          >
            <ToggleButton value="scenarios" aria-label="Scenarios">
              <AutoStoriesRoundedIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Scenarios
            </ToggleButton>
            <ToggleButton value="mocks" aria-label="Mocks">
              <MenuBookRoundedIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Mocks
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        {/* Stats cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {[
            { label: 'Total mistakes', value: stats.totalMistakes, sub: `Across ${filterLabel.toLowerCase()}` },
            { label: 'Items with mistakes', value: stats.itemsWithMistakes, sub: 'Enrolled items' },
            { label: 'Avg per item', value: stats.avgPerItem, sub: 'Mistakes per item' },
            { label: 'Highest', value: stats.maxMistakes, sub: 'Single item' },
          ].map((card) => (
            <Paper
              key={card.label}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.15),
                bgcolor: theme.palette.background.paper,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, color: PAGE_PRIMARY, lineHeight: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                {card.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {card.sub}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Pie chart */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PieChartRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Mistakes distribution – {filterLabel}
            </Typography>
          </Box>
          {pieData.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: '100%', maxWidth: 280, height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {pieData.map((d) => (
                  <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: 1, bgcolor: d.fill }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {d.name}: {d.value}% {d.count != null && `(${d.count})`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No data to display for this filter.
            </Typography>
          )}
        </Paper>

        {/* Bar chart: mistakes by item */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            mb: 3,
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
            <BarChartRoundedIcon sx={{ color: PAGE_PRIMARY, fontSize: { xs: 24, sm: 28 } }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Mistakes by item – {filterLabel}
            </Typography>
          </Box>
          {barData.length > 0 ? (
            <Box sx={{ width: '100%', height: { xs: 280, sm: 320 }, minHeight: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{
                    top: 8,
                    right: isMobile ? 8 : 30,
                    left: 4,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                  <XAxis
                    type="number"
                    domain={[0, 'auto']}
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: isMobile ? 10 : 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={isMobile ? 88 : 120}
                    tick={{ fontSize: isMobile ? 10 : 11 }}
                    stroke={theme.palette.text.secondary}
                    interval={0}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      const fullName = d.fullName ?? d.name
                      return (
                        <Paper
                          elevation={2}
                          sx={{
                            p: 1.5,
                            borderRadius: '7px',
                            maxWidth: 280,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                            {fullName}
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                            Mistakes: {d.mistakes}
                          </Typography>
                        </Paper>
                      )
                    }}
                  />
                  <Bar dataKey="mistakes" name="Mistakes" fill={CHART_COLORS.high} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No enrolled items to display.
            </Typography>
          )}
        </Paper>

        {/* CTA: Only active tab's history */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '7px',
            border: '2px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.25),
            bgcolor: alpha(PAGE_PRIMARY, 0.06),
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Need more detail?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: 560 }}>
            {filter === 'scenarios'
              ? 'These statistics give you an overview. To review attempt history, question-level mistakes, and full breakdowns for scenario exams, please use your Scenarios History page.'
              : 'These statistics give you an overview. To review attempt history, question-level mistakes, and full breakdowns for mock exams, please use your Mocks History page.'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, flexWrap: 'wrap' }}>
            {filter === 'scenarios' ? (
              <Button
                variant="contained"
                startIcon={<HistoryRoundedIcon />}
                onClick={() => navigate('/user-dashboard/scenarios-history')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '7px',
                  bgcolor: PAGE_PRIMARY,
                  '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                }}
              >
                Scenarios History
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<HistoryRoundedIcon />}
                onClick={() => navigate('/user-dashboard/history')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '7px',
                  bgcolor: PAGE_PRIMARY,
                  '&:hover': { bgcolor: PAGE_PRIMARY_DARK },
                }}
              >
                Mocks History
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </UserDashboardLayout>
  )
}
