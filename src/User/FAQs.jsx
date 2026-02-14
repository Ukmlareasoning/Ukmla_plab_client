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
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
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

const faqs = [
  {
    icon: <SchoolOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'What is UKMLA Reasoning Tutor?',
    answer: 'UKMLA Reasoning Tutor is an AI-powered platform that helps you train clinical reasoning for the UKMLA and PLAB 1 exams. It offers examiner-style questions, adaptive feedback, ethics and GMC-aligned scenarios, and progress tracking so you can prepare effectively.',
  },
  {
    icon: <PsychologyOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'How does the AI tutor work?',
    answer: 'You set your exam type and date, complete a confidence assessment, and then get daily reasoning sessions tailored to your weak areas. The AI explains answers in an examiner-style way, highlights common traps, and adapts to your progress over time.',
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'Is the content GMC-aligned?',
    answer: 'Yes. Our scenarios and feedback are aligned with Good Medical Practice and UK exam standards. We focus on clinical reasoning, ethics, patient safety, and communication in line with what UKMLA and PLAB 1 examiners expect.',
  },
  {
    icon: <PhoneAndroidOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'Can I use the tutor on mobile?',
    answer: 'Yes. The site is responsive and works on phones and tablets. You can study on the go; we recommend a stable connection for the best experience.',
  },
  {
    icon: <LockOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'How do I reset my password?',
    answer: 'On the Sign In page, use the “Forgot password” link. Enter your email and we’ll send instructions to reset your password. Check spam if you don’t see the email.',
  },
  {
    icon: <PaymentOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit and debit cards through our secure payment provider. Subscription plans are billed according to the plan you choose. See the Home page or Pricing for current plans.',
  },
  {
    icon: <QuestionAnswerIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'Is there a free trial?',
    answer: 'Yes. We offer a free trial so you can try reasoning sessions and see how the AI tutor works. Check the Home page for the latest trial offer and limits.',
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 28, color: PAGE_PRIMARY }} />,
    question: 'How do I contact support?',
    answer: 'Use the Contact Us page to send a message, or email support@ukmla-tutor.com. We typically respond within 24 hours. If you’re signed in, you can also use in-app live chat for quicker help.',
  },
]

function FAQs() {
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
              FAQs
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
              Quick answers to common questions about UKMLA Reasoning Tutor.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<SchoolOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="Platform"
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
                icon={<PsychologyOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.9)' }} />}
                label="AI tutor"
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
                label="Support"
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

        {/* FAQ list */}
        <Box
          component="section"
          aria-labelledby="faqs-content-heading"
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
                id="faqs-content-heading"
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
                Frequently asked questions
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: PAGE_PRIMARY }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
              {faqs.map((faq, index) => (
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
                  style={{ animationDelay: `${0.1 + index * 0.04}s` }}
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
                    {faq.icon}
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
                      {faq.question}
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
                      {faq.answer}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.9375rem', sm: '0.875rem' } }}>
                Can’t find your answer?
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

export default FAQs
