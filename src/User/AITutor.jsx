import { useState, useRef, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Fade,
} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAGE_PRIMARY = '#384D84'
const PAGE_PRIMARY_DARK = '#2a3a64'
const PAGE_PRIMARY_LIGHT = '#4a5f9a'

// Mock messages for demonstration
const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m your AI Tutor specialized in UKMLA PLAB preparation. I can help you with:\n\n• Clinical reasoning questions\n• GMC ethics scenarios\n• Patient safety decisions\n• Exam strategies\n• Topic explanations\n\nWhat would you like to know?',
    timestamp: new Date(),
  },
]

function AITutor() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'This is a placeholder response. In the future, this will connect to an AI model that provides detailed, accurate answers about UKMLA PLAB preparation topics.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const exampleQuestions = [
    'What is the GMC approach to consent?',
    'How do I approach a red flag scenario?',
    'Explain clinical reasoning for chest pain',
    'What are common UKMLA exam traps?',
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      {/* Compact Hero Section — "top" when opening page */}
      <Box
        id="ai-tutor-hero"
        sx={{
          background: `linear-gradient(135deg, ${alpha(PAGE_PRIMARY, 0.06)} 0%, ${alpha(PAGE_PRIMARY, 0.02)} 100%)`,
          borderBottom: `1px solid ${alpha(PAGE_PRIMARY, 0.08)}`,
          py: { xs: 1.5, sm: 1.75 },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              maxWidth: 1000,
              mx: 'auto',
            }}
          >
            {/* Compact Icon */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                borderRadius: '7px',
                background: `linear-gradient(135deg, ${PAGE_PRIMARY} 0%, ${PAGE_PRIMARY_LIGHT} 50%, ${PAGE_PRIMARY_DARK} 100%)`,
                boxShadow: `0 4px 12px ${alpha(PAGE_PRIMARY, 0.2)}`,
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  pointerEvents: 'none',
                },
              }}
            >
              <SmartToyRoundedIcon
                sx={{
                  fontSize: { xs: 22, sm: 24 },
                  color: '#FFFFFF',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </Box>

            {/* Title and Description */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.25rem', sm: '1.4rem' },
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}
                >
                  AI Tutor
                </Typography>
                {/* Inline Feature chips */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<PsychologyRoundedIcon sx={{ fontSize: 14 }} />}
                    label="Clinical Reasoning"
                    size="small"
                    sx={{
                      borderRadius: '7px !important',
                      '&.MuiChip-root': { borderRadius: '7px' },
                      height: 22,
                      bgcolor: alpha(PAGE_PRIMARY, 0.1),
                      color: PAGE_PRIMARY,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      '& .MuiChip-icon': {
                        color: PAGE_PRIMARY,
                        marginLeft: 0.5,
                      },
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                  <Chip
                    icon={<VerifiedUserRoundedIcon sx={{ fontSize: 14 }} />}
                    label="GMC Ethics"
                    size="small"
                    sx={{
                      borderRadius: '7px !important',
                      '&.MuiChip-root': { borderRadius: '7px' },
                      height: 22,
                      bgcolor: alpha(PAGE_PRIMARY, 0.1),
                      color: PAGE_PRIMARY,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      '& .MuiChip-icon': {
                        color: PAGE_PRIMARY,
                        marginLeft: 0.5,
                      },
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                  <Chip
                    icon={<AutoStoriesRoundedIcon sx={{ fontSize: 14 }} />}
                    label="UKMLA PLAB"
                    size="small"
                    sx={{
                      borderRadius: '7px !important',
                      '&.MuiChip-root': { borderRadius: '7px' },
                      height: 22,
                      bgcolor: alpha(PAGE_PRIMARY, 0.1),
                      color: PAGE_PRIMARY,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      '& .MuiChip-icon': {
                        color: PAGE_PRIMARY,
                        marginLeft: 0.5,
                      },
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  lineHeight: 1.4,
                }}
              >
                Specialized AI assistant for UKMLA PLAB preparation. Get instant answers to clinical reasoning, ethics, and exam strategy questions.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Chat Interface */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 1000,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          minHeight: 0,
          pb: { xs: 3, sm: 4 },
        }}
      >
        {/* Chat Messages Container */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '7px',
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.15),
            bgcolor: 'background.paper',
            overflow: 'hidden',
            mb: 1.5,
            minHeight: { xs: 500, sm: 600, md: 650 },
            maxHeight: { xs: 'calc(100vh - 320px)', sm: 'calc(100vh - 300px)', md: 'calc(100vh - 280px)' },
          }}
        >
          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              '&::-webkit-scrollbar': {
                width: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: alpha(theme.palette.grey[500], 0.05),
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: alpha(PAGE_PRIMARY, 0.2),
                borderRadius: '7px',
                '&:hover': {
                  bgcolor: alpha(PAGE_PRIMARY, 0.3),
                },
              },
            }}
          >
            {messages.map((message) => (
              <Fade in key={message.id} timeout={300}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      bgcolor:
                        message.role === 'user'
                          ? alpha(PAGE_PRIMARY, 0.15)
                          : PAGE_PRIMARY,
                      color: message.role === 'user' ? PAGE_PRIMARY : '#FFFFFF',
                      flexShrink: 0,
                    }}
                  >
                    {message.role === 'user' ? (
                      <PersonRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                    ) : (
                      <SmartToyRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                    )}
                  </Avatar>

                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: { xs: '85%', sm: '75%' },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: '7px',
                        bgcolor:
                          message.role === 'user'
                            ? alpha(PAGE_PRIMARY, 0.08)
                            : alpha(PAGE_PRIMARY, 0.04),
                        border: '1px solid',
                        borderColor:
                          message.role === 'user'
                            ? alpha(PAGE_PRIMARY, 0.2)
                            : alpha(theme.palette.grey[500], 0.15),
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: '0.9rem', sm: '0.95rem' },
                          lineHeight: 1.6,
                          color: 'text.primary',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {message.content}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        px: 1,
                        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            ))}

            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    bgcolor: PAGE_PRIMARY,
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  <SmartToyRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                </Avatar>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
                    borderRadius: '7px',
                    bgcolor: alpha(PAGE_PRIMARY, 0.04),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.grey[500], 0.15),
                  }}
                >
                  <CircularProgress size={20} sx={{ color: PAGE_PRIMARY }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.85rem',
                    }}
                  >
                    Thinking...
                  </Typography>
                </Box>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderTop: '1px solid',
              borderColor: alpha(theme.palette.grey[500], 0.15),
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask me anything about UKMLA PLAB preparation..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                    borderRadius: '7px',
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    '& fieldset': {
                      borderColor: alpha(PAGE_PRIMARY, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(PAGE_PRIMARY, 0.3),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PAGE_PRIMARY,
                      borderWidth: 2,
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  borderRadius: '7px',
                  bgcolor: PAGE_PRIMARY,
                  color: '#FFFFFF',
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: PAGE_PRIMARY_DARK,
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    bgcolor: alpha(PAGE_PRIMARY, 0.3),
                    color: alpha('#FFFFFF', 0.5),
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <SendRoundedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
              </IconButton>
            </Box>

            {/* Example Questions */}
            {messages.length <= 1 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    mb: 1,
                    display: 'block',
                  }}
                >
                  Try asking:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {exampleQuestions.map((question, index) => (
                    <Chip
                      key={index}
                      label={question}
                      size="small"
                      onClick={() => {
                        setInputValue(question)
                        inputRef.current?.focus()
                      }}
                      sx={{
                        borderRadius: '7px !important',
                        '&.MuiChip-root': { borderRadius: '7px' },
                        bgcolor: alpha(PAGE_PRIMARY, 0.08),
                        color: PAGE_PRIMARY,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: alpha(PAGE_PRIMARY, 0.15),
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Compact Info Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, sm: 1.25 },
            borderRadius: '7px',
            bgcolor: alpha(PAGE_PRIMARY, 0.06),
            border: '1px solid',
            borderColor: alpha(PAGE_PRIMARY, 0.12),
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <VerifiedUserRoundedIcon
            sx={{
              color: PAGE_PRIMARY,
              fontSize: { xs: 16, sm: 18 },
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              lineHeight: 1.4,
            }}
          >
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Specialized for UKMLA PLAB:
            </Box>{' '}
            Focuses on clinical reasoning, GMC ethics, patient safety, and exam strategies.
          </Typography>
        </Paper>
      </Box>

      <Footer />
    </Box>
  )
}

export default AITutor
