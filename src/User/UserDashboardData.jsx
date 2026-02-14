import PsychologyIcon from '@mui/icons-material/Psychology'
import GavelIcon from '@mui/icons-material/Gavel'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import CompareIcon from '@mui/icons-material/Compare'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import AllInclusiveRoundedIcon from '@mui/icons-material/AllInclusiveRounded'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'
const primaryGradient = `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 100%)`

export const PAGE_COLORS = { PAGE_PRIMARY, PAGE_PRIMARY_DARK, PAGE_PRIMARY_LIGHT, primaryGradient }

export const statsCards = [
  { id: 'all', label: 'All', value: '12', sub: 'Total mocks exams', Icon: AllInclusiveRoundedIcon, gradient: primaryGradient },
  { id: 'active', label: 'Active', value: '3', sub: 'In progress', Icon: PlayCircleOutlineRoundedIcon, gradient: primaryGradient },
  { id: 'completed', label: 'Completed', value: '2', sub: 'Finished', Icon: CheckCircleRoundedIcon, gradient: primaryGradient },
  { id: 'new', label: 'New', value: '7', sub: 'Not started', Icon: NewReleasesRoundedIcon, gradient: primaryGradient },
]

export const COURSE_FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'new', label: 'New' },
]

export const progressBarData = [
  { label: 'UKMLA Reasoning Core', value: 78 },
  { label: 'Ethics & GMC', value: 45 },
  { label: 'Patient Safety', value: 22 },
]

export const pieData = [
  { label: 'Active', value: 25, color: '#0D9488' },
  { label: 'Completed', value: 17, color: '#10B981' },
  { label: 'New', value: 58, color: '#64748B' },
]

export const dashboardCoursesData = [
  { id: 1, title: 'Full UKMLA Reasoning Core', exam: 'UKMLA', description: 'Master the complete reasoning framework UK examiners expect.', tags: ['Reasoning', 'GMC', 'Patient Safety'], duration: '12 weeks', level: 'Core', enrolled: true, progress: 45, isPaid: false, icon: <PsychologyIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 2, title: 'Ethics & GMC Decision-Making', exam: 'UKMLA', description: 'Navigate complex ethical scenarios with confidence.', tags: ['Ethics', 'GMC', 'Professional Judgement'], duration: '6 weeks', level: 'Core', enrolled: true, progress: 100, isPaid: false, icon: <GavelIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 3, title: 'Patient Safety & Red-Flag Thinking', exam: 'UKMLA', description: 'Identify critical red flags and prioritize patient safety.', tags: ['Patient Safety', 'Reasoning', 'Red Flags'], duration: '4 weeks', level: 'Foundation', enrolled: true, progress: 100, isPaid: false, icon: <LocalHospitalIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 4, title: 'Data Interpretation & Examiner Traps', exam: 'UKMLA', description: 'Master ECG, blood gas, lab results, and imaging interpretation.', tags: ['Reasoning', 'Data Analysis', 'Pattern Recognition'], duration: '8 weeks', level: 'Advanced', enrolled: true, progress: 100, isPaid: true, icon: <AssessmentIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 5, title: 'Pattern Recognition & Diagnostic Contrast', exam: 'PLAB 1', description: 'Train your brain to distinguish similar presentations.', tags: ['Reasoning', 'Pattern Recognition', 'Diagnostics'], duration: '6 weeks', level: 'Advanced', enrolled: true, progress: 100, isPaid: true, icon: <CompareIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 6, title: 'PLAB 1 Reasoning Essentials', exam: 'PLAB 1', description: 'Comprehensive reasoning training specifically for PLAB 1 format.', tags: ['Reasoning', 'GMC', 'UK Guidelines'], duration: '10 weeks', level: 'Core', enrolled: false, progress: 0, isPaid: false, icon: <PsychologyIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 7, title: 'Evidence-Based Medicine Reasoning', exam: 'UKMLA', description: 'Apply evidence-based principles to exam scenarios.', tags: ['Reasoning', 'Evidence-Based Practice', 'Guidelines'], duration: '5 weeks', level: 'Advanced', enrolled: false, progress: 0, isPaid: true, icon: <LightbulbIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 8, title: 'Communication & Consent Reasoning', exam: 'UKMLA', description: 'Master the reasoning behind difficult conversations.', tags: ['Ethics', 'Communication', 'GMC'], duration: '4 weeks', level: 'Foundation', enrolled: false, progress: 0, isPaid: false, icon: <VerifiedUserIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 9, title: 'Mental Capacity & Mental Health Act', exam: 'UKMLA', description: 'Navigate the legal and ethical frameworks around capacity.', tags: ['Ethics', 'GMC', 'Mental Health'], duration: '3 weeks', level: 'Foundation', enrolled: false, progress: 0, isPaid: false, icon: <GavelIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
  { id: 10, title: 'Safeguarding & Child Protection', exam: 'UKMLA', description: 'Apply safeguarding principles and child protection procedures.', tags: ['Ethics', 'Patient Safety', 'GMC'], duration: '4 weeks', level: 'Foundation', enrolled: false, progress: 0, isPaid: false, icon: <LocalHospitalIcon sx={{ fontSize: 36, color: PAGE_PRIMARY }} /> },
]

export const DASHBOARD_COURSES_TOPIC_OPTIONS = ['all', 'Reasoning', 'Ethics', 'Patient Safety']
export const DASHBOARD_COURSE_STATUS_FILTERS = [
  { id: 'all', label: 'All mocks exams', mobileLabel: 'All' },
  { id: 'ongoing', label: 'Ongoing mocks exams', mobileLabel: 'Ongoing' },
  { id: 'completed', label: 'Completed', mobileLabel: 'Completed' },
]
