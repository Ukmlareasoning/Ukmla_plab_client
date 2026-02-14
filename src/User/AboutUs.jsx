import { useEffect } from 'react'
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
  useTheme,
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SchoolIcon from '@mui/icons-material/School'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import GroupsIcon from '@mui/icons-material/Groups'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ScienceIcon from '@mui/icons-material/Science'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'

// Page primary (#384D84 â€” no green, match HowItWorks/Home)
const PAGE_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  '@keyframes scaleIn': {
    '0%': { opacity: 0, transform: 'scale(0.92)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  '@keyframes glowPulse': {
    '0%, 100%': { boxShadow: `0 0 20px ${alpha(PAGE_PRIMARY, 0.2)}` },
    '50%': { boxShadow: `0 0 32px ${alpha(PAGE_PRIMARY, 0.35)}` },
  },
}

const values = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40, color: PAGE_PRIMARY }} />,
    title: 'Clinical Reasoning First',
    description: 'We build tools that train the way UK examiners think â€” step-by-step, evidence-based, and patient-safe.',
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 40, color: PAGE_PRIMARY }} />,
    title: 'Evidence-Based Learning',
    description: 'Every scenario and feedback is aligned with guidelines, GMC standards, and real exam patterns.',
  },
  {
    icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: PAGE_PRIMARY }} />,
    title: 'AI That Teaches, Not Just Tests',
    description: 'Our AI explains examiner intent, common traps, and reasoning patterns so you learn to think, not just remember.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: PAGE_PRIMARY }} />,
    title: 'Built for Tomorrowâ€™s Doctors',
    description: 'We support UKMLA and PLAB 1 candidates with adaptive, personalized preparation for high-stakes exams.',
  },
]

const stats = [
  { value: '10K+', label: 'Sessions Delivered' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'AI Tutor Access' },
  { value: 'GMC', label: 'Aligned Content' },
]

function AboutUs() {
  const theme = useTheme()

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

      <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
        {/* Hero section â€” same style as Privacy Policy: dark blue bg, title, subtitle, badges, hero-img.png */}
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
              About Us
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
              We're building the future of clinical reasoning preparation â€” AI-powered, examiner-aligned, and designed for UKMLA.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<AutoGraphIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="AI-Powered"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
              <Chip
                icon={<SchoolIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Examiner-Aligned"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
              <Chip
                icon={<LightbulbIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Reasoning-First"
                size="small"
                sx={{
                  borderRadius: '7px',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  border: '1px solid rgba(255,255,255,0.3)',
                  '& .MuiChip-icon': { color: 'rgba(255,255,255,0.9)' },
                }}
              />
            </Box>
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

        {/* Mission & Vision */}
        <Box
          component="section"
          aria-labelledby="mission-vision-heading"
          sx={{
            ...keyframes,
            py: { xs: 6, md: 8 },
            bgcolor: 'grey.50',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(PAGE_PRIMARY, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
              <Typography
                id="mission-vision-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${PAGE_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Mission & Vision
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.55 }}>
                Why we exist and where weâ€™re headed
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: PAGE_PRIMARY }} />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.6s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(13, 148, 136, 0.12)',
                      borderColor: alpha(PAGE_PRIMARY, 0.3),
                    },
                  }}
                  style={{ animationDelay: '0.2s' }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '7px',
                        bgcolor: alpha(PAGE_PRIMARY, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <LightbulbIcon sx={{ color: PAGE_PRIMARY, fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: '1.125rem' }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                      To empower every UKMLA and PLAB 1 candidate with AI-driven clinical reasoning training that mirrors how examiners think â€” so you pass with confidence and practise safely.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    overflow: 'hidden',
                    animation: 'scaleIn 0.6s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(16, 185, 129, 0.12)',
                      borderColor: alpha(PAGE_PRIMARY, 0.3),
                    },
                  }}
                  style={{ animationDelay: '0.35s' }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '7px',
                        bgcolor: alpha(PAGE_PRIMARY, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <TrendingUpIcon sx={{ color: PAGE_PRIMARY, fontSize: 30 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: '1.125rem' }}>
                      Our Vision
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                      A world where every doctor-in-training has access to examiner-quality feedback and adaptive reasoning practice â€” so standards stay high and patients stay safe.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Core Values */}
        <Box
          component="section"
          aria-labelledby="values-heading"
          sx={{
            ...keyframes,
            py: { xs: 7, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${alpha(PAGE_PRIMARY, 0.02)} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${alpha(PAGE_PRIMARY, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, maxWidth: 600, mx: 'auto' }}>
              <Typography
                id="values-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.5rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${PAGE_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                What We Stand For
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1.05rem' }, lineHeight: 1.55 }}>
                Values that guide every feature we build
              </Typography>
              <Box sx={{ width: 60, height: 4, borderRadius: '7px', background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`, mx: 'auto', mt: 2 }} />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: { xs: 2, sm: 3, md: 3.5 },
              }}
            >
              {values.map((item, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    ...keyframes,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.5),
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 12px rgba(15, 23, 42, 0.06)',
                    animation: `fadeInUp 0.5s ease-out forwards`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${PAGE_PRIMARY}, ${PAGE_PRIMARY_LIGHT})`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover': {
                      borderColor: PAGE_PRIMARY,
                      boxShadow: '0 12px 32px rgba(13, 148, 136, 0.12)',
                      transform: 'translateY(-6px)',
                      '&::before': { opacity: 1 },
                      '& .value-icon-box': { transform: 'scale(1.08)' },
                    },
                  }}
                  style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      className="value-icon-box"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: alpha(PAGE_PRIMARY, 0.06),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontSize: '1rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, flex: 1 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Stats */}
        <Box
          component="section"
          aria-label="Stats"
          sx={{
            ...keyframes,
            py: { xs: 5, md: 7 },
            bgcolor: 'grey.50',
            position: 'relative',
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              {stats.map((stat, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    ...keyframes,
                    p: 3,
                    borderRadius: '7px',
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: alpha(PAGE_PRIMARY, 0.15),
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    animation: 'scaleIn 0.5s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: alpha(PAGE_PRIMARY, 0.35),
                      boxShadow: `0 8px 24px ${alpha(PAGE_PRIMARY, 0.1)}`,
                      transform: 'scale(1.02)',
                    },
                  }}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: PAGE_PRIMARY,
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5, fontSize: '0.875rem' }}>
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        {/* CTA */}
        <Box
          component="section"
          aria-label="Call to action"
          sx={{
            ...keyframes,
            py: { xs: 6, md: 8 },
            background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.06)} 0%, ${alpha(PAGE_PRIMARY, 0.04)} 100%)`,
            borderTop: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.1),
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '7px',
                border: '1px solid',
                borderColor: alpha(PAGE_PRIMARY, 0.15),
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0,
                animationFillMode: 'forwards',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 16px 48px rgba(13, 148, 136, 0.12)',
                },
              }}
              style={{ animationDelay: '0.1s' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Ready to train like an examiner?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, maxWidth: 420, mx: 'auto' }}>
                Join thousands of candidates using our AI tutor to build clinical reasoning and ethics skills for UKMLA & PLAB 1.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '7px',
                  textTransform: 'none',
                  bgcolor: PAGE_PRIMARY,
                  boxShadow: `0 4px 14px ${alpha(PAGE_PRIMARY, 0.35)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: PAGE_PRIMARY_DARK,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(PAGE_PRIMARY, 0.4)}`,
                  },
                }}
              >
                Start Free Trial
              </Button>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default AboutUs
