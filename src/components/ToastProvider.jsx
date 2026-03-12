import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Snackbar, Alert, Box, LinearProgress } from '@mui/material'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const [progress, setProgress] = useState(0)

  const showToast = useCallback((message, severity = 'success') => {
    setToast({
      open: true,
      message,
      severity,
    })
    setProgress(0)
  }, [])

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return
    setToast((prev) => ({ ...prev, open: false }))
  }, [])

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  )

  useEffect(() => {
    if (!toast.open) return undefined

    const totalDuration = 4000
    const intervalMs = 100
    const step = (intervalMs / totalDuration) * 100

    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step
        return next >= 100 ? 100 : next
      })
    }, intervalMs)

    return () => clearInterval(id)
  }, [toast.open])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{
            px: 1.5,
            py: 0.5,
            minWidth: 0,
            borderRadius: 1,
            boxShadow: 3,
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{toast.message}</Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 3,
                borderRadius: 999,
                bgcolor: (theme) => theme.palette.common.white,
                '& .MuiLinearProgress-bar': {
                  bgcolor: (theme) => theme.palette[toast.severity]?.dark || theme.palette.primary.dark,
                },
              }}
            />
          </Box>
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

