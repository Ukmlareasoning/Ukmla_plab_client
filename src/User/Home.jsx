import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Container,
  Chip,
  Divider,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SchoolIcon from '@mui/icons-material/School'
import GavelIcon from '@mui/icons-material/Gavel'
import TimelineIcon from '@mui/icons-material/Timeline'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SecurityIcon from '@mui/icons-material/Security'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import StarIcon from '@mui/icons-material/Star'
import MemoryIcon from '@mui/icons-material/Memory'
import CompareIcon from '@mui/icons-material/Compare'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LockIcon from '@mui/icons-material/Lock'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'

// User/Home primary (#384D84 — no green, match admin style)
const HOME_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const HERO_BTN_GREEN = '#38a169'
const HERO_BTN_GREEN_HOVER = '#2d7a5a'
const HERO_BTN_GOLD = '#c9a227'
const HERO_BTN_GOLD_HOVER = '#b38600'
const HOME_PRIMARY_DARK = '#2a3a64'
const HOME_PRIMARY_LIGHT = '#4a5f9a'

// Core Learning Pillars (8 pillars — 4 per row, 2 rows)
const corePillars = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Clinical Reasoning',
    description: 'Think through problems step-by-step like an examiner expects',
  },
  {
    icon: <GavelIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Ethics & Professional Judgement',
    description: 'Master GMC principles and ethical decision-making',
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Patient Safety Thinking',
    description: 'Prioritize safe, patient-centered clinical decisions',
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'GMC-Aligned Decision Making',
    description: 'Apply Good Medical Practice in every scenario',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Evidence-Based Practice',
    description: 'Link clinical decisions to guidelines and best evidence',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Communication & Consent',
    description: 'Demonstrate clear communication and valid consent',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Systematic Diagnosis',
    description: 'Work through differentials in a structured way',
  },
  {
    icon: <LightbulbIcon sx={{ fontSize: 44, color: HOME_PRIMARY }} />,
    title: 'Reflective Practice',
    description: 'Learn from feedback and improve your reasoning',
  },
]

// How AI Tutor Works Steps
const steps = [
  { label: 'Select Exam & Time to Exam', description: 'Choose UKMLA or PLAB 1 and set your exam date to personalize your study timeline.' },
  { label: 'Assess Confidence & Weak Areas', description: 'Complete an initial assessment to identify knowledge gaps and confidence levels across topics.' },
  { label: 'Daily Focused Reasoning Sessions', description: 'Engage in AI-curated study sessions targeting your specific weak areas with clinical reasoning challenges.' },
  { label: 'Examiner-Style Challenge & Feedback', description: 'Receive detailed explanations revealing examiner intent, common traps, and reasoning patterns.' },
  { label: 'Adaptive Learning & Progress Tracking', description: 'Monitor your improvement with analytics showing reasoning strengths and areas needing targeted work.' },
]

// Icons for "How The AI Tutor Works" steps (same order as steps)
const stepIcons = [
  <CalendarMonthIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <AssessmentIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <PsychologyIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <LightbulbIcon sx={{ fontSize: 28, color: 'inherit' }} />,
  <TrendingUpIcon sx={{ fontSize: 28, color: 'inherit' }} />,
]

// Pricing Plans
const pricingPlans = [
  {
    title: 'Free Trial',
    price: '£0',
    period: '7 days',
    popular: false,
    features: [
      '20 reasoning sessions',
      'Basic ethics scenarios',
      'Progress tracking',
      'Community support',
    ],
    cta: 'Start Free Trial',
    whoFor: 'For exploring the platform',
  },
  {
    title: 'Standard',
    price: '£5',
    period: 'per month',
    popular: true,
    features: [
      'Unlimited reasoning sessions',
      'Full ethics & GMC access',
      'Adaptive learning system',
      'Weakness analysis',
      'Progress dashboard',
      'Email support',
    ],
    cta: 'Get Started',
    whoFor: 'For serious exam preparation',
  },
  {
    title: 'Premium',
    price: '£10',
    period: '3 months',
    popular: false,
    savingPercent: 33, // vs £5/month × 3 = £15
    features: [
      'Everything in Standard',
      'Priority AI tutor access',
      'Custom study plans',
      'Advanced analytics',
      'Mock exam simulations',
      'Priority support',
    ],
    cta: 'Go Premium',
    whoFor: 'For comprehensive mastery',
  },
]

function Home() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // When navigating to Home from another page, scroll to top so the main/hero section is in view (not footer)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Header />

      <Box
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
        }}
      >
        {/* Hero section — matches Scenarios: dark blue bg, title, subtitle, CTAs, hero-img.png */}
        <Box
          component="section"
          aria-label="Hero"
          sx={{
            width: '100%',
            minHeight: { xs: 420, sm: 460, md: 500 },
            py: { xs: 4, sm: 5, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 6 },
            bgcolor: HERO_BG,
            background: `linear-gradient(180deg, #243b55 0%, ${HERO_BG} 50%, #182d47 100%)`,
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: { xs: '100%', md: 'auto' },
              maxWidth: { md: '55%' },
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.65rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              Think like a UKMLA Examiner – not a question bank.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontWeight: 400,
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              AI-driven clinical reasoning. Examiner feedback. Zero memorisation.
            </Typography>
            <Grid
              container
              spacing={1.5}
              sx={{
                width: '100%',
                flexWrap: 'nowrap',
                boxSizing: 'border-box',
              }}
            >
              <Grid item xs={6} sx={{ minWidth: 0, flex: '1 1 50%', maxWidth: '50%' }}>
                <Button
                  component={Link}
                  to="/scenarios"
                  variant="contained"
                  fullWidth
                  startIcon={!isMobile ? <PsychologyIcon sx={{ fontSize: 20 }} /> : null}
                  sx={{
                    bgcolor: HERO_BTN_GREEN,
                    color: 'rgba(255,255,255,0.92)',
                    fontWeight: 700,
                    fontSize: { xs: '0.7rem', sm: '0.95rem' },
                    py: 1.25,
                    px: { xs: 1, sm: 2.5 },
                    borderRadius: '8px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    boxShadow: `0 4px 14px ${alpha(HERO_BTN_GREEN, 0.25)}`,
                    '&:hover': {
                      bgcolor: HERO_BTN_GREEN_HOVER,
                      color: '#1a1a1a',
                      boxShadow: `0 6px 20px ${alpha(HERO_BTN_GREEN, 0.35)}`,
                    },
                  }}
                >
                  {isMobile ? 'Try Free' : 'Try a Free Scenario'}
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ minWidth: 0, flex: '1 1 50%', maxWidth: '50%' }}>
                <Button
                  component={Link}
                  to="/pricing"
                  variant="contained"
                  fullWidth
                  startIcon={!isMobile ? <ArrowUpwardRoundedIcon sx={{ fontSize: 20 }} /> : null}
                  sx={{
                    bgcolor: HERO_BTN_GOLD,
                    color: '#1a1a1a',
                    fontWeight: 700,
                    fontSize: { xs: '0.7rem', sm: '0.95rem' },
                    py: 1.25,
                    px: { xs: 1, sm: 2.5 },
                    borderRadius: '8px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    boxShadow: `0 4px 14px ${alpha(HERO_BTN_GOLD, 0.25)}`,
                    '&:hover': {
                      bgcolor: HERO_BTN_GOLD_HOVER,
                      color: '#1a1a1a',
                      boxShadow: `0 6px 20px ${alpha(HERO_BTN_GOLD, 0.35)}`,
                    },
                  }}
                >
                  {isMobile ? '£5/mo' : 'View Pricing (£5/month)'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: '45%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-end' },
              minHeight: { xs: 260, md: 340 },
            }}
          >
            <Box
              component="img"
              src={heroImg}
              alt="UKMLA clinical reasoning interface"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: { xs: 260, md: 360 },
                objectFit: 'contain',
                borderRadius: '7px',
              }}
            />
          </Box>
        </Box>

        {/* 3️⃣ CORE LEARNING PILLARS — Premium UI design */}
        <Box
          component="section"
          aria-labelledby="core-pillars-heading"
          sx={{
            py: { xs: 7, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(HOME_PRIMARY, 0.02)} 100%)`,
            width: '100%',
            overflowX: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(HOME_PRIMARY, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, maxWidth: 600, mx: 'auto' }}>
              <Typography
                id="core-pillars-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.5rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${HOME_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Core Learning Pillars
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9375rem', md: '1.05rem' },
                  lineHeight: 1.55,
                  mb: 2,
                }}
              >
                Six essential foundations for UK exam success
              </Typography>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                  mx: 'auto',
                }}
              />
            </Box>

            {/* Cards Grid — 2 per row on xs, 3 per row on sm+ */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                },
                gap: { xs: 2, sm: 3, md: 3.5 },
              }}
            >
              {corePillars.slice(0, 6).map((pillar, index) => (
                <Card
                  key={index}
                    elevation={0}
                    sx={{
                      height: '100%',
                      minHeight: { xs: 200, md: 240 },
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.grey[300], 0.5),
                      borderRadius: '7px',
                      bgcolor: 'background.paper',
                      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
                      cursor: 'pointer',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: `linear-gradient(90deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      },
                      '&:hover': {
                        borderColor: HOME_PRIMARY,
                        boxShadow: `0 12px 32px ${alpha(HOME_PRIMARY, 0.12)}`,
                        transform: 'translateY(-6px)',
                        '&::before': {
                          opacity: 1,
                        },
                        '& .pillar-icon-wrapper': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2, md: 3.5 },
                        textAlign: { xs: 'left', sm: 'center' },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'flex-start',
                      }}
                    >
                      {/* Icon with background */}
                      <Box
                        className="pillar-icon-wrapper"
                        sx={{
                          width: { xs: 56, sm: 72 },
                          height: { xs: 56, sm: 72 },
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: { xs: 1.5, md: 2.5 },
                          background:
                            index % 3 === 0
                              ? `linear-gradient(135deg, ${alpha(HOME_PRIMARY, 0.12)}, ${alpha(HOME_PRIMARY_LIGHT, 0.08)})`
                              : index % 3 === 1
                              ? `linear-gradient(135deg, ${alpha(HOME_PRIMARY_DARK, 0.12)}, ${alpha(HOME_PRIMARY, 0.08)})`
                              : `linear-gradient(135deg, ${alpha(HOME_PRIMARY, 0.12)}, ${alpha(HOME_PRIMARY_LIGHT, 0.08)})`,
                          border: '1px solid',
                          borderColor:
                            index % 3 === 0
                              ? alpha(HOME_PRIMARY, 0.2)
                              : index % 3 === 1
                              ? alpha(HOME_PRIMARY_DARK, 0.2)
                              : alpha(HOME_PRIMARY, 0.2),
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {pillar.icon}
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: { xs: 1, md: 1.5 },
                          fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1.125rem' },
                          lineHeight: 1.35,
                          color: 'text.primary',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                        }}
                      >
                        {pillar.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.55,
                          fontSize: { xs: '0.8125rem', md: '0.9375rem' },
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                        }}
                      >
                        {pillar.description}
                      </Typography>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 2️⃣ SAMPLE QUESTION — Question, Answer & AI Tutor Explanation */}
        <Box
          component="section"
          aria-labelledby="sample-question-heading"
          sx={{
            py: { xs: 6, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${alpha(HOME_PRIMARY, 0.04)} 50%, ${theme.palette.grey[50]} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(800px, 100%)',
              height: 280,
              background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${alpha(HOME_PRIMARY, 0.08)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
              <Chip
                icon={<AssessmentIcon sx={{ fontSize: 16 }} />}
                label="Interactive preview"
                size="small"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: alpha(HOME_PRIMARY, 0.12),
                  color: HOME_PRIMARY,
                  '& .MuiChip-icon': { color: 'inherit' },
                }}
              />
              <Typography
                id="sample-question-heading"
                component="h2"
                variant="h3"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.25rem' },
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                See How the AI Tutor Works
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                  lineHeight: 1.5,
                  maxWidth: 480,
                  mx: 'auto',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                }}
              >
                A sample question with examiner-style explanation
              </Typography>
              <Box
                sx={{
                  width: 56,
                  height: 4,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                  mx: 'auto',
                  mt: 2,
                }}
              />
            </Box>

            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(HOME_PRIMARY, 0.15),
                bgcolor: 'background.paper',
                boxShadow: `0 4px 6px ${alpha(theme.palette.common.black, 0.04)}, 0 24px 48px ${alpha(HOME_PRIMARY, 0.06)}`,
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.06)}, 0 32px 64px ${alpha(HOME_PRIMARY, 0.08)}`,
                },
              }}
            >
              {/* Question block — exam-style header */}
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3, md: 4 },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  background: `linear-gradient(135deg, ${alpha(HOME_PRIMARY, 0.06)} 0%, ${alpha(HOME_PRIMARY, 0.02)} 100%)`,
                }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Chip
                    label="Sample MCQ"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.04em',
                      bgcolor: HOME_PRIMARY,
                      color: '#fff',
                      height: 28,
                    }}
                  />
                  <Chip
                    label="Question 1"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem', borderColor: 'divider', color: 'text.secondary' }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: { xs: '0.9375rem', sm: '1.05rem', md: '1.125rem' },
                    lineHeight: 1.6,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  A 45-year-old woman presents with fatigue, weight gain, and cold intolerance for 3 months. TSH is elevated at 12 mU/L (reference 0.4–4.0). What is the most appropriate next step?
                </Typography>
              </Box>

              {/* MCQ options — A/B/C/D style */}
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1.5,
                }}
              >
                {[
                  { letter: 'A', text: 'Start levothyroxine immediately', correct: false },
                  { letter: 'B', text: 'Check serum free T4 (and consider T3 if indicated)', correct: true },
                  { letter: 'C', text: 'Order thyroid antibodies only', correct: false },
                  { letter: 'D', text: 'MRI pituitary to exclude secondary cause', correct: false },
                ].map((opt) => (
                  <Box
                    key={opt.letter}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: { xs: 1.5, md: 2 },
                      borderRadius: '7px',
                      border: '2px solid',
                      borderColor: opt.correct ? HOME_PRIMARY : 'divider',
                      bgcolor: opt.correct ? alpha(HOME_PRIMARY, 0.08) : 'transparent',
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
                        bgcolor: opt.correct ? HOME_PRIMARY : 'action.hover',
                        color: opt.correct ? '#fff' : 'text.secondary',
                      }}
                    >
                      {opt.letter}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        color: 'text.primary',
                        fontWeight: opt.correct ? 600 : 500,
                        lineHeight: 1.55,
                        pt: 0.5,
                        fontSize: { xs: '0.8125rem', md: '0.875rem' },
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                      }}
                    >
                      {opt.text}
                    </Typography>
                    {opt.correct && (
                      <CheckCircleIcon sx={{ color: HOME_PRIMARY, fontSize: 22, ml: 'auto', flexShrink: 0, mt: 0.25 }} />
                    )}
                  </Box>
                ))}
              </Box>

              {/* Correct answer & rationale card */}
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3, md: 4 },
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'flex-start' },
                  gap: 2,
                  bgcolor: alpha(HOME_PRIMARY, 0.04),
                  borderLeft: { xs: 'none', sm: '4px solid' },
                  borderLeftColor: HOME_PRIMARY,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: alpha(HOME_PRIMARY, 0.15),
                    color: HOME_PRIMARY,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: HOME_PRIMARY,
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: '0.8rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Correct Answer
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                    }}
                  >
                    Check serum free T4 (and consider T3 if indicated)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mt: 1.25,
                      lineHeight: 1.6,
                      fontSize: { xs: '0.8125rem', md: '0.875rem' },
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                    }}
                  >
                    Elevated TSH with suggestive symptoms supports hypothyroidism; free T4 confirms and helps distinguish primary from secondary causes.
                  </Typography>
                </Box>
              </Box>

              {/* AI Tutor explanation — premium card */}
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3, md: 4 },
                  background: `linear-gradient(135deg, ${alpha(HOME_PRIMARY, 0.08)} 0%, ${alpha(HOME_PRIMARY, 0.03)} 100%)`,
                  borderLeft: '4px solid',
                  borderColor: HOME_PRIMARY,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 160,
                    height: 160,
                    background: `radial-gradient(circle at 100% 0%, ${alpha(HOME_PRIMARY, 0.12)} 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, position: 'relative' }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(HOME_PRIMARY, 0.15),
                      color: HOME_PRIMARY,
                    }}
                  >
                    <LightbulbIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: HOME_PRIMARY,
                        fontWeight: 700,
                        fontSize: { xs: '0.9375rem', md: '1rem' },
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                    >
                      AI Tutor Explanation
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Examiner-style reasoning
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.65,
                    fontSize: { xs: '0.9375rem', md: '1rem' },
                    position: 'relative',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  This question tests your ability to <strong>follow a logical diagnostic pathway</strong>. When TSH is raised, the next step is to check free T4 to confirm hypothyroidism and to see if it is primary (high TSH, low T4) or secondary (e.g. pituitary cause). Starting levothyroxine without confirming with T4 would be premature. Checking thyroid antibodies can help with aetiology but does not replace T4 for confirming the diagnosis. The examiner is assessing that you prioritise the right investigation in the right order — a key part of safe, patient-centred care.
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px dashed',
                    borderColor: alpha(HOME_PRIMARY, 0.2),
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.65,
                      fontStyle: 'italic',
                      fontSize: { xs: '0.8125rem', md: '0.875rem' },
                    }}
                  >
                  Our AI tutor gives you this kind of examiner-style reasoning on every question, so you learn not just the answer but why it’s right and how to think through similar cases.
                </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>

        {/* 4️⃣ HOW THE AI TUTOR WORKS — Advanced timeline UI */}
        <Box
          component="section"
          aria-labelledby="how-it-works-heading"
          sx={{
            py: { xs: 7, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(HOME_PRIMARY, 0.03)} 50%, ${theme.palette.background.paper} 100%)`,
            width: '100%',
            overflowX: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(HOME_PRIMARY, 0.25)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, maxWidth: 560, mx: 'auto' }}>
              <Typography
                id="how-it-works-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${HOME_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                How The AI Tutor Works
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9375rem', md: '1.05rem' },
                  lineHeight: 1.55,
                  mb: 2,
                }}
              >
                A structured, reassuring approach to mastering clinical reasoning
              </Typography>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                  mx: 'auto',
                }}
              />
            </Box>

            {/* Timeline with step cards — 1 per row on mobile, vertical timeline on sm+ */}
            <Box
              sx={{
                position: 'relative',
                pl: { xs: 0, sm: 5 },
                display: 'block',
                '&::before': {
                  content: '""',
                  display: { xs: 'none', sm: 'block' },
                  position: 'absolute',
                  left: 19,
                  top: 24,
                  bottom: 24,
                  width: 2,
                  borderRadius: '7px',
                  background: `linear-gradient(180deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT}, ${alpha(HOME_PRIMARY, 0.4)})`,
                },
              }}
            >
              {steps.map((step, index) => (
                <Box
                  key={step.label}
                  sx={{
                    position: 'relative',
                    mb: { xs: 3, sm: 4 },
                    '&:last-of-type': { mb: 0 },
                  }}
                >
                  {/* Step number node (desktop: on timeline; mobile: above card) */}
                  <Box
                    sx={{
                      position: { xs: 'relative', sm: 'absolute' },
                      left: { sm: 0 },
                      top: { xs: 0, sm: 20 },
                      transform: { sm: 'translateX(-50%)' },
                      width: { xs: 40, sm: 40 },
                      height: { xs: 40, sm: 40 },
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_DARK})`,
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: '1rem' },
                      boxShadow: `0 4px 14px ${alpha(HOME_PRIMARY, 0.4)}`,
                      zIndex: 1,
                      mb: { xs: 1.5, sm: 0 },
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Step card */}
                  <Card
                    elevation={0}
                    sx={{
                      ml: { xs: 0, sm: 4 },
                      border: '1px solid',
                      borderColor: alpha(theme.palette.grey[300], 0.6),
                      borderRadius: '7px',
                      bgcolor: 'background.paper',
                      boxShadow: { xs: '0 4px 20px rgba(15, 23, 42, 0.08)', sm: '0 2px 16px rgba(15, 23, 42, 0.06)' },
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: `linear-gradient(180deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      },
                      '&:hover': {
                        borderColor: HOME_PRIMARY,
                        boxShadow: `0 12px 32px ${alpha(HOME_PRIMARY, 0.12)}`,
                        transform: 'translateX(4px)',
                        '&::before': { opacity: 1 },
                        '& .step-icon-wrap': {
                          transform: 'scale(1.08)',
                          bgcolor: alpha(HOME_PRIMARY, 0.12),
                        },
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 3, md: 4 },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'flex-start' },
                        gap: { xs: 2, md: 2 },
                      }}
                    >
                      {/* Icon */}
                      <Box
                        className="step-icon-wrap"
                        sx={{
                          width: { xs: 52, md: 56 },
                          height: { xs: 52, md: 56 },
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          bgcolor: alpha(HOME_PRIMARY, 0.08),
                          color: HOME_PRIMARY,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {stepIcons[index]}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: { xs: '1.0625rem', md: '1.2rem' },
                            lineHeight: 1.3,
                            color: 'text.primary',
                          }}
                        >
                          {step.label}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9375rem', md: '1rem' },
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 6️⃣ ETHICS & GMC REASONING — Premium futuristic UI */}
        <Box
          component="section"
          aria-labelledby="ethics-heading"
          sx={{
            py: { xs: 7, md: 10 },
            background: `linear-gradient(180deg, ${alpha(HOME_PRIMARY, 0.04)} 0%, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 100%)`,
            width: '100%',
            overflowX: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(HOME_PRIMARY, 0.3)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, maxWidth: 640, mx: 'auto' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  background: `linear-gradient(135deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_DARK})`,
                  color: '#fff',
                  boxShadow: `0 8px 24px ${alpha(HOME_PRIMARY, 0.35)}`,
                }}
              >
                <GavelIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                id="ethics-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${HOME_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ethics & GMC Reasoning
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9375rem', md: '1.05rem' },
                  lineHeight: 1.55,
                  mb: 2,
                }}
              >
                Master the professional and ethical principles that underpin every UK medical examination.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                <Chip
                  label="UK-Specific"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: '7px',
                    bgcolor: alpha(HOME_PRIMARY, 0.12),
                    color: HOME_PRIMARY,
                    border: '1px solid',
                    borderColor: alpha(HOME_PRIMARY, 0.3),
                  }}
                />
                <Chip
                  label="Professional"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: '7px',
                    bgcolor: alpha(HOME_PRIMARY, 0.12),
                    color: HOME_PRIMARY,
                    border: '1px solid',
                    borderColor: alpha(HOME_PRIMARY, 0.3),
                  }}
                />
                <Chip
                  label="Serious"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: '7px',
                    bgcolor: alpha(HOME_PRIMARY, 0.12),
                    color: HOME_PRIMARY,
                    border: '1px solid',
                    borderColor: alpha(HOME_PRIMARY, 0.3),
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                  mx: 'auto',
                  mt: 2,
                }}
              />
            </Box>

            {/* Core Ethics Principles — Card grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(12, 1fr)',
                  sm: 'repeat(12, 1fr)',
                  md: 'repeat(12, 1fr)',
                },
                gap: { xs: 2, sm: 3, md: 3.5 },
              }}
            >
              {[
                { icon: <SecurityIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'GMC Good Medical Practice', subtitle: 'Foundation of professional conduct' },
                { icon: <VerifiedUserIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Autonomy', subtitle: 'Respecting patient choices' },
                { icon: <LocalHospitalIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Beneficence', subtitle: 'Acting in patient\'s best interest' },
                { icon: <GavelIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Non-maleficence', subtitle: 'First, do no harm' },
                { icon: <AssessmentIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Justice', subtitle: 'Fair allocation of resources' },
                { icon: <PsychologyIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Mental Capacity Act', subtitle: 'Assessing decision-making capacity' },
                { icon: <SchoolIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Mental Health Act', subtitle: 'Legal frameworks for MH care' },
                { icon: <LockIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Confidentiality', subtitle: 'Protecting patient information' },
                { icon: <LightbulbIcon sx={{ fontSize: 28, color: 'inherit' }} />, title: 'Duty of Candour', subtitle: 'Being open and honest when things go wrong' },
              ].map((principle, index) => (
                <Card
                  key={principle.title}
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.5),
                    borderRadius: '7px',
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
                    gridColumn: index === 8
                      ? { xs: '1 / -1', md: 'span 4' }
                      : { xs: 'span 6', sm: 'span 6', md: 'span 4' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: `linear-gradient(180deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover': {
                      borderColor: HOME_PRIMARY,
                      boxShadow: `0 12px 32px ${alpha(HOME_PRIMARY, 0.12)}`,
                      transform: 'translateY(-4px)',
                      '&::before': { opacity: 1 },
                      '& .ethics-icon-wrap': {
                        transform: 'scale(1.08)',
                        bgcolor: alpha(HOME_PRIMARY, 0.15),
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box
                      className="ethics-icon-wrap"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '7px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        bgcolor: alpha(HOME_PRIMARY, 0.08),
                        color: HOME_PRIMARY,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {principle.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 0.75,
                        fontSize: { xs: '0.875rem', md: '1.1rem' },
                        color: 'text.primary',
                        lineHeight: 1.3,
                      }}
                    >
                      {principle.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.45,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                    >
                      {principle.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* 9️⃣ CHOOSE YOUR LEARNING PATH — Bold pricing UI */}
        <Box
          component="section"
          aria-labelledby="pricing-heading"
          sx={{
            py: { xs: 8, md: 12 },
            background: `linear-gradient(160deg, ${alpha(HOME_PRIMARY, 0.06)} 0%, ${theme.palette.background.paper} 35%, ${theme.palette.background.default} 100%)`,
            width: '100%',
            overflowX: 'hidden',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${HOME_PRIMARY}, transparent)`,
              opacity: 0.4,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
              <Typography
                id="pricing-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  fontSize: { xs: '1.35rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${HOME_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Choose Your Learning Path
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9375rem', md: '1.05rem' },
                  lineHeight: 1.55,
                  mb: 2,
                }}
              >
                Start free, upgrade when ready
              </Typography>
              <Box
                sx={{
                  width: 80,
                  height: 5,
                  borderRadius: '7px',
                  background: `linear-gradient(90deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_LIGHT})`,
                  mx: 'auto',
                  boxShadow: `0 2px 12px ${alpha(HOME_PRIMARY, 0.3)}`,
                }}
              />
            </Box>

            {/* Pricing Cards — middle card elevated */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1.06fr 1fr' },
                gap: { xs: 3, md: 2 },
                alignItems: 'stretch',
                maxWidth: 1000,
                mx: 'auto',
                position: 'relative',
              }}
            >
              {pricingPlans.map((plan, index) => (
                <Box
                  key={plan.title}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    mb: { xs: 0, md: 0 },
                    ...(plan.popular && {
                      md: {
                        zIndex: 1,
                        transform: 'scale(1.05)',
                        my: -2,
                      },
                    }),
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'visible',
                      borderRadius: '7px',
                      border: '2px solid',
                      borderColor: plan.popular
                        ? HOME_PRIMARY
                        : alpha(theme.palette.grey[400], 0.4),
                      bgcolor: 'background.paper',
                      boxShadow: plan.popular
                        ? `0 24px 48px ${alpha(HOME_PRIMARY, 0.18)}, 0 0 0 1px ${alpha(HOME_PRIMARY, 0.08)}`
                        : '0 4px 20px rgba(15, 23, 42, 0.08)',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: HOME_PRIMARY,
                        boxShadow: plan.popular
                          ? `0 28px 56px ${alpha(HOME_PRIMARY, 0.22)}`
                          : `0 12px 32px ${alpha(HOME_PRIMARY, 0.12)}`,
                        transform: 'translateY(-6px)',
                      },
                    }}
                  >
                    {/* Popular ribbon */}
                    {plan.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 2,
                          px: 2,
                          py: 0.75,
                          borderRadius: '7px',
                          background: `linear-gradient(135deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_DARK})`,
                          color: '#fff',
                          boxShadow: `0 4px 14px ${alpha(HOME_PRIMARY, 0.45)}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <StarIcon sx={{ fontSize: 18 }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                          MOST POPULAR
                        </Typography>
                      </Box>
                    )}

                    <CardContent sx={{ p: { xs: 3, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 0.5,
                          fontWeight: 800,
                          textAlign: 'center',
                          fontSize: { xs: '1.4rem', md: '1.5rem' },
                          color: 'text.primary',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {plan.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 3,
                          color: 'text.secondary',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }}
                      >
                        {plan.whoFor}
                      </Typography>

                      {/* Price block */}
                      <Box
                        sx={{
                          textAlign: 'center',
                          mb: 3,
                          py: 2,
                          px: 2,
                          borderRadius: '7px',
                          bgcolor: plan.popular ? alpha(HOME_PRIMARY, 0.08) : alpha(theme.palette.grey[500], 0.06),
                          border: '1px solid',
                          borderColor: plan.popular ? alpha(HOME_PRIMARY, 0.2) : alpha(theme.palette.grey[400], 0.2),
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            background: plan.popular
                              ? `linear-gradient(135deg, ${HOME_PRIMARY}, ${HOME_PRIMARY_DARK})`
                              : 'none',
                            color: plan.popular ? 'transparent' : 'text.primary',
                            WebkitBackgroundClip: plan.popular ? 'text' : 'unset',
                            backgroundClip: plan.popular ? 'text' : 'unset',
                            fontSize: { xs: '2.5rem', md: '2.75rem' },
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {plan.price}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
                          {plan.period}
                        </Typography>
                        {plan.savingPercent != null && (
                          <Chip
                            size="small"
                            label={`Save ${plan.savingPercent}%`}
                            sx={{
                              mt: 1.5,
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              bgcolor: HOME_PRIMARY,
                              color: '#fff',
                              '& .MuiChip-label': { px: 1.25 },
                            }}
                          />
                        )}
                      </Box>

                      <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.grey[400], 0.25) }} />

                      <Box sx={{ flexGrow: 1, mb: 3 }}>
                        {plan.features.map((feature, featureIndex) => (
                          <Box
                            key={featureIndex}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              mb: 1.5,
                              py: 0.5,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{
                                color: HOME_PRIMARY,
                                fontSize: 22,
                                flexShrink: 0,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, fontSize: '0.9rem' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Button
                        variant={plan.popular ? 'contained' : 'outlined'}
                        size="large"
                        fullWidth
                        sx={{
                          py: 1.75,
                          fontSize: '1rem',
                          fontWeight: 700,
                          borderRadius: '7px',
                          borderWidth: 2,
                          textTransform: 'none',
                          ...(plan.popular
                            ? { bgcolor: HOME_PRIMARY, color: '#fff', boxShadow: `0 6px 20px ${alpha(HOME_PRIMARY, 0.4)}` }
                            : { borderColor: HOME_PRIMARY, color: HOME_PRIMARY, boxShadow: 'none' }
                          ),
                          '&:hover': {
                            borderWidth: 2,
                            ...(plan.popular
                              ? { bgcolor: HOME_PRIMARY_DARK, boxShadow: `0 8px 24px ${alpha(HOME_PRIMARY, 0.45)}` }
                              : { borderColor: HOME_PRIMARY_DARK, color: HOME_PRIMARY_DARK, bgcolor: alpha(HOME_PRIMARY, 0.08), boxShadow: `0 4px 14px ${alpha(HOME_PRIMARY, 0.2)}` }
                            ),
                          },
                        }}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default Home
