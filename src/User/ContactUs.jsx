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
} from '@mui/material'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import EmailIcon from '@mui/icons-material/Email'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Header from '../components/Header'
import Footer from '../components/Footer'
import heroImage from '../assets/hero.jpg'

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
}

const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Email',
    value: 'support@ukmla-tutor.com',
    description: 'We typically respond within 24 hours',
  },
  {
    icon: <ScheduleIcon sx={{ fontSize: 32, color: 'success.main' }} />,
    title: 'Support Hours',
    value: 'Mon–Fri, 9am–6pm GMT',
    description: 'Extended hours for Premium members',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Live Chat',
    value: 'In-app when signed in',
    description: 'Quick answers for account & technical issues',
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Address',
    value: 'London, United Kingdom',
    description: 'Head office — reach out for visits or post',
  },
]

const inputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'background.paper',
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
  },
})

function ContactUs() {
  const theme = useTheme()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder: wire to your backend or email service
  }

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
        {/* Hero */}
        <Box
          component="section"
          aria-label="Contact Us Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 300, md: 340 },
            py: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.05)} 45%, transparent 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container>
              <Grid item xs={12} md={8} lg={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.15),
                    backdropFilter: 'blur(30px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.25),
                    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                    animation: 'fadeInUp 0.7s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)} 0%, transparent 100%)`,
                      pointerEvents: 'none',
                      zIndex: 0,
                    },
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <ContactMailIcon sx={{ color: 'text.primary', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      Get in Touch
                    </Typography>
                  </Box>
                  <Typography
                    component="h1"
                    variant="h1"
                    sx={{
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem', lg: '2.75rem' },
                      mb: 1.5,
                      color: 'text.primary',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Contact Us
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.primary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Have a question, feedback, or need support? We’re here to help — reach out and we’ll get back to you soon.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
                      label="24h response"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                    <Chip
                      icon={<SupportAgentIcon sx={{ fontSize: 18 }} />}
                      label="Support"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                    <Chip
                      icon={<EmailIcon sx={{ fontSize: 18 }} />}
                      label="Secure"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'text.primary' },
                      }}
                    />
                  </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Contact form + info */}
        <Box
          component="section"
          aria-labelledby="contact-heading"
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
              background: `linear-gradient(90deg, transparent 0%, ${alpha(theme.palette.primary.main, 0.2)} 50%, transparent 100%)`,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, maxWidth: 560, mx: 'auto' }}>
              <Typography
                id="contact-heading"
                component="h2"
                variant="h2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Send a Message
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.55 }}>
                Fill out the form below and we’ll get back to you as soon as we can
              </Typography>
              <Divider sx={{ mt: 2, mx: 'auto', width: 60, borderWidth: 2, borderColor: 'primary.main' }} />
            </Box>

            {/* Flex layout: form left, contact cards right — same row on sm+ */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                alignItems: 'stretch',
              }}
            >
              {/* Form — left */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', sm: '7 1 0%' },
                  minWidth: 0,
                }}
              >
                <Paper
                  elevation={0}
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    ...keyframes,
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[300], 0.6),
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                    animation: 'scaleIn 0.6s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
                    },
                  }}
                  style={{ animationDelay: '0.2s' }}
                >
                  <Box sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      required
                      name="name"
                      label="Your name"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      sx={inputSx(theme)}
                      placeholder="e.g. Dr Jane Smith"
                    />
                    <TextField
                      fullWidth
                      required
                      name="email"
                      type="email"
                      label="Email address"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      sx={inputSx(theme)}
                      placeholder="you@example.com"
                    />
                    <TextField
                      fullWidth
                      name="subject"
                      label="Subject"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      sx={inputSx(theme)}
                      placeholder="e.g. Billing, Technical support, Feedback"
                    />
                    <TextField
                      fullWidth
                      required
                      name="message"
                      label="Message"
                      variant="outlined"
                      color="primary"
                      multiline
                      rows={5}
                      sx={inputSx(theme)}
                      placeholder="Tell us how we can help..."
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SendIcon />}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                    }}
                  >
                    Send message
                  </Button>
                </Paper>
              </Box>

              {/* Email, Support Hours, Live Chat — right (beside form on sm+ screens) */}
              <Box
                sx={{
                  flex: { xs: '0 0 auto', sm: '5 1 0%' },
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                  {contactInfo.map((item, index) => (
                    <Card
                      key={index}
                      elevation={0}
                      sx={{
                        ...keyframes,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.grey[300], 0.6),
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        opacity: 0,
                        animationFillMode: 'forwards',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          opacity: 0,
                          transition: 'opacity 0.3s',
                        },
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(13, 148, 136, 0.1)',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&::before': { opacity: 1 },
                        },
                      }}
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <CardContent sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5, fontSize: '0.875rem' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}>
                            {item.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.8125rem' }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Reassurance strip */}
        <Box
          component="section"
          aria-label="Response time"
          sx={{
            ...keyframes,
            py: { xs: 4, md: 5 },
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.success.main, 0.04)} 100%)`,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.12),
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                animation: 'fadeInUp 0.5s ease-out forwards',
                opacity: 0,
                animationFillMode: 'forwards',
              }}
              style={{ animationDelay: '0.1s' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <VerifiedUserIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  We’re here to help
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto' }}>
                Most messages get a reply within 24 hours. For urgent account or technical issues, sign in and use in-app live chat for faster support.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default ContactUs
