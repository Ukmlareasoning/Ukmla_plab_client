import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
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
import Header from '../components/Header'
import Footer from '../components/Footer'

const features = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Reasoning-First MCQs',
    description:
      'Every question is designed to test clinical reasoning, not memory. Learn to think like an examiner.',
  },
  {
    icon: <LightbulbIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    title: 'Examiner Intent Explanation',
    description:
      'Understand why each option exists and what the examiner wants you to consider before answering.',
  },
  {
    icon: <GavelIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Ethics & GMC Decision Logic',
    description:
      'Master GMC Good Medical Practice principles with scenario-based ethics reasoning.',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    title: 'Pattern Recognition Engine',
    description:
      'AI analyzes your responses to identify clinical reasoning patterns and knowledge gaps.',
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    title: 'Adaptive Learning System',
    description:
      'Questions adapt to your performance, focusing on areas that need improvement.',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Weakness & Progress Tracking',
    description:
      'Detailed analytics show your reasoning strengths and areas for targeted improvement.',
  },
]

const steps = [
  { label: 'Choose Exam & Timeline', description: 'Select UKMLA or PLAB 1, set your exam date, and define your study timeline.' },
  { label: 'Assess Confidence & Weak Areas', description: 'Complete an initial assessment to identify knowledge gaps and confidence levels across topics.' },
  { label: 'Daily AI-Guided Sessions', description: 'Engage in focused study sessions with AI-curated questions that target your weak areas.' },
  { label: 'Examiner-Style Feedback', description: 'Receive detailed explanations that reveal examiner intent and reasoning patterns.' },
  { label: 'Track Reasoning Improvement', description: 'Monitor your progress with analytics that show improvements in clinical reasoning over time.' },
]

function Home() {
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
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
        }}
      >
        {/* Hero Section */}
        <Box
          component="section"
          aria-label="Hero"
          sx={{
            width: '100%',
            pt: { xs: 6, md: 10 },
            pb: { xs: 6, md: 10 },
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ width: '100%', px: 0 }}>
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={12} md={6} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, py: 3 }}>
                <Typography
                  component="h1"
                  variant="h1"
                  sx={{
                    fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.75rem' },
                    mb: 2,
                    color: 'text.primary',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  Train Clinical Reasoning — Not Just Memory
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 3,
                    color: 'text.secondary',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  AI-powered UKMLA & PLAB 1 preparation designed around examiner thinking.
                </Typography>
                <Box sx={{ mb: 4 }}>
                  {['Examiner-style MCQs', 'Ethics & GMC reasoning', 'Adaptive AI tutor feedback'].map((point, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, fontSize: 24 }} />
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                  <Button variant="contained" size="large" color="primary" sx={{ px: 4 }}>
                    Start Free Reasoning Session
                  </Button>
                  <Button variant="outlined" size="large" color="primary">
                    How It Works
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  No credit card required
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, py: 3 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Chip label="AI Tutor Interaction" color="primary" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Sample Question
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      A 45-year-old woman presents with fatigue and weight gain. TSH is elevated. What is the most appropriate next step?
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, mb: 1 }}>
                        ✓ Your Answer: Check free T4 levels
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: 'success.tint',
                        p: 2,
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderColor: 'success.main',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                        Examiner Reasoning:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Correct. Elevated TSH indicates hypothyroidism. Checking free T4 confirms the diagnosis and helps determine if it's primary or secondary hypothyroidism.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Core Features */}
        <Box
          component="section"
          aria-labelledby="features-heading"
          sx={{ width: '100%', py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}
        >
          <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography id="features-heading" component="h2" variant="h2" sx={{ mb: 2, fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Core Features
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Everything you need to master clinical reasoning for UKMLA & PLAB 1
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* How It Works */}
        <Box
          component="section"
          aria-labelledby="how-it-works-heading"
          sx={{ width: '100%', py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}
        >
          <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography id="how-it-works-heading" component="h2" variant="h2" sx={{ mb: 2, fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                How It Works
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Your journey to mastering clinical reasoning in 5 simple steps
              </Typography>
            </Box>
            <Stepper orientation="vertical" activeStep={-1}>
              {steps.map((step) => (
                <Step key={step.label} expanded>
                  <StepLabel StepIconProps={{ sx: { '&.MuiStepIcon-root': { color: 'primary.main', fontSize: '2rem' } } }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body1" sx={{ color: 'text.secondary', pb: 2 }}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>

        {/* Ethics & GMC Focus */}
        <Box component="section" aria-labelledby="ethics-heading" sx={{ py: { xs: 6, md: 10 } }}>
          <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                bgcolor: 'primary.lightBg',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'primary.light',
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <GavelIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  </Box>
                  <Typography id="ethics-heading" component="h2" variant="h3" sx={{ mb: 2, fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                    Ethics & GMC Aligned
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Our platform is built around the core principles that UK medical examiners expect you to demonstrate.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    {[
                      'GMC Good Medical Practice',
                      'Four Pillars of Ethics (Autonomy, Beneficence, Non-maleficence, Justice)',
                      'Mental Capacity Act',
                      'Mental Health Act',
                    ].map((principle, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <VerifiedUserIcon sx={{ color: 'primary.main', mr: 2, fontSize: 24, mt: 0.5 }} />
                        <Typography variant="body1" sx={{ color: 'text.primary' }}>
                          {principle}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>

        {/* Trust & Credibility */}
        <Box
          component="section"
          aria-labelledby="trust-heading"
          sx={{ width: '100%', py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}
        >
          <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography id="trust-heading" component="h2" variant="h3" sx={{ mb: 2, fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                Trusted by Medical Students Worldwide
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Alert
                  icon={<SchoolIcon sx={{ fontSize: 28 }} />}
                  severity="info"
                  sx={{
                    bgcolor: 'primary.lightBg',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    '& .MuiAlert-icon': { color: 'primary.main' },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>UKMLA Blueprint Aligned</Typography>
                  <Typography variant="body2">Questions match official exam standards</Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert
                  icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
                  severity="success"
                  sx={{
                    bgcolor: 'success.lightBg',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'success.light',
                    '& .MuiAlert-icon': { color: 'success.main' },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>International & UK Graduates</Typography>
                  <Typography variant="body2">Designed for all medical students</Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert
                  icon={<VerifiedUserIcon sx={{ fontSize: 28 }} />}
                  severity="warning"
                  sx={{
                    bgcolor: 'secondary.lightBg',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'secondary.light',
                    '& .MuiAlert-icon': { color: 'secondary.main' },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Patient-Safety Focused</Typography>
                  <Typography variant="body2">Prioritizing safe clinical decisions</Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  )
}

export default Home
