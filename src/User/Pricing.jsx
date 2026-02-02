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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Header from '../components/Header'
import Footer from '../components/Footer'

const HERO_IMAGE_URL = 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=1200'

const keyframes = {
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(28px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

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
    price: '£29',
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
    price: '£199',
    period: '6 months',
    popular: false,
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

function Pricing() {
  const theme = useTheme()

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
          aria-label="Pricing Hero"
          sx={{
            ...keyframes,
            width: '100%',
            minHeight: { xs: 280, md: 320 },
            py: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${HERO_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 50%, ${alpha(theme.palette.background.paper, 0.15)} 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container>
              <Grid item xs={12} md={8} lg={7}>
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3.5 },
                    borderRadius: { xs: 2, sm: 3 },
                    bgcolor: alpha(theme.palette.background.paper, 0.96),
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)',
                    animation: 'fadeInUp 0.7s ease-out forwards',
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                  style={{ animationDelay: '0.15s' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <AttachMoneyIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        fontSize: '0.75rem',
                      }}
                    >
                      Plans
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
                    Pricing
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Start free, upgrade when ready — choose the plan that fits your UKMLA or PLAB 1 preparation.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<VerifiedUserIcon sx={{ fontSize: 18 }} />}
                      label="Free trial"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'primary.main' },
                      }}
                    />
                    <Chip
                      icon={<StarIcon sx={{ fontSize: 18 }} />}
                      label="Most popular"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'success.main' },
                      }}
                    />
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                      label="No commitment"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': { color: 'primary.main' },
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Choose Your Learning Path — same as Home */}
        <Box
          component="section"
          aria-labelledby="pricing-heading"
          sx={{
            py: { xs: 8, md: 12 },
            background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.background.paper} 35%, ${theme.palette.background.default} 100%)`,
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
              background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
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
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
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
                  borderRadius: 2.5,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  mx: 'auto',
                  boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              />
            </Box>

            {/* Pricing Cards — middle card elevated, same as Home */}
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
              {pricingPlans.map((plan) => (
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
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: plan.popular
                        ? theme.palette.primary.main
                        : alpha(theme.palette.grey[400], 0.4),
                      bgcolor: 'background.paper',
                      boxShadow: plan.popular
                        ? `0 24px 48px ${alpha(theme.palette.primary.main, 0.18)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.08)}`
                        : '0 4px 20px rgba(15, 23, 42, 0.08)',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: plan.popular
                          ? `0 28px 56px ${alpha(theme.palette.primary.main, 0.22)}`
                          : `0 12px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
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
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          color: theme.palette.primary.contrastText,
                          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.45)}`,
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
                          borderRadius: 3,
                          bgcolor: plan.popular ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.grey[500], 0.06),
                          border: '1px solid',
                          borderColor: plan.popular ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.grey[400], 0.2),
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            background: plan.popular
                              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
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
                                color: plan.popular ? 'primary.main' : 'success.main',
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
                        color="primary"
                        size="large"
                        fullWidth
                        sx={{
                          py: 1.75,
                          fontSize: '1rem',
                          fontWeight: 700,
                          borderRadius: 2.5,
                          borderWidth: 2,
                          textTransform: 'none',
                          boxShadow: plan.popular ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
                          '&:hover': {
                            borderWidth: 2,
                            boxShadow: plan.popular ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.45)}` : `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
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

export default Pricing
