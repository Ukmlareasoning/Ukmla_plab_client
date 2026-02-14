import { useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  Chip,
  Divider,
  Button,
  useTheme,
} from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImg from '../assets/hero-img.png'

// Page primary (#384D84 — no green, match HowItWorks)
const PAGE_PRIMARY = '#384D84'
const HERO_BG = '#1e3a5f'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes scaleIn': {
    '0%': { opacity: 0, transform: 'scale(0.92)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
}

const sections = [
  {
    icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'Getting started',
    content: 'New to UKMLA Reasoning Tutor? Sign up for a free trial, choose your exam (UKMLA or PLAB 1), set your exam date, and complete the initial confidence assessment. The AI tutor will then tailor your sessions to your weak areas. Check the Home page for a quick overview of how it works.',
  },
  {
    icon: <PersonOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'Account & billing',
    content: 'Manage your profile, password, and subscription from your account settings. For billing questions, refunds, or plan changes, contact support@ukmla-tutor.com. We typically respond within 24 hours. Premium members get priority support.',
  },
  {
    icon: <PsychologyOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'Using the AI tutor',
    content: 'The AI tutor guides you through clinical reasoning sessions with examiner-style questions and feedback. Use daily sessions for best results. Your progress and weak areas are tracked so the system adapts to you. Focus on understanding the reasoning, not just the answer.',
  },
  {
    icon: <BuildOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'Technical issues',
    content: 'If the site is slow, sessions don’t load, or you see errors, try refreshing or using a different browser. Clear cache and cookies if needed. For persistent issues, contact us with your device and browser details. We’ll help you get back on track quickly.',
  },
  {
    icon: <MenuBookOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'Study tips',
    content: 'We recommend short, regular sessions rather than long cramming. Use the sample question on the Home page to see how the AI explains answers. Align your study with the Core Learning Pillars (clinical reasoning, ethics, patient safety) for UK exam success.',
  },
  {
    icon: <QuestionAnswerOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'FAQs',
    content: 'Common questions: How do I reset my password? Use “Forgot password” on the sign-in page. Can I use the tutor on mobile? Yes, the site is responsive. Is content GMC-aligned? Yes, our scenarios and feedback follow Good Medical Practice and UK exam standards.',
  },
  {
    icon: <ContactMailOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    title: 'Contact support',
    content: 'Need more help? Use the Contact Us page to send a message, or email support@ukmla-tutor.com. If you’re signed in, you can also use in-app live chat for faster answers. We’re here to support your UKMLA and PLAB 1 preparation.',
  },
]

function HelpCenter() {
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
        {/* Hero section — same style as Privacy Policy: dark blue bg, title, subtitle, badges, hero-img.png */}
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
              Help Center
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
              Find answers, get started, and reach support for UKMLA and PLAB 1 preparation.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<SupportAgentIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="24h response"
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
                icon={<QuestionAnswerOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="FAQs"
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
                icon={<ContactMailOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Contact us"
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

        {/* Help sections */}
        <Box
          component="section"
          aria-labelledby="help-content-heading"
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
          <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
              <Typography
                id="help-content-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' },
                  px: 1,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${PAGE_PRIMARY} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Topics & guides
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: PAGE_PRIMARY }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
              {sections.map((section, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    ...keyframes,
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: '7px',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    animation: 'scaleIn 0.5s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                    gap: { xs: 2, sm: 2 },
                    textAlign: { xs: 'center', sm: 'left' },
                    '&:hover': {
                      borderColor: alpha(PAGE_PRIMARY, 0.25),
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 52 },
                      height: { xs: 48, sm: 52 },
                      borderRadius: '7px',
                      bgcolor: alpha(PAGE_PRIMARY, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      alignSelf: { xs: 'center', sm: 'flex-start' },
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: PAGE_PRIMARY,
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.75,
                        fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                        wordBreak: 'break-word',
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.9375rem', sm: '0.875rem' } }}>
                Still need help? We’re here for you.
              </Typography>
              <Button
                component={Link}
                to="/contact-us"
                variant="contained"
                size="medium"
                startIcon={<ContactMailOutlinedIcon />}
                sx={{
                  px: 3,
                  py: 1.25,
                  fontSize: '0.9375rem',
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
                Contact us
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default HelpCenter
