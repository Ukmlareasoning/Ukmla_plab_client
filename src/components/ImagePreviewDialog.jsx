import { alpha } from '@mui/material/styles'
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'

/**
 * Reusable image preview dialog – works with any image type (jpg, png, gif, webp, etc.).
 * Wrap any small image in a clickable element and pass the same src to this dialog.
 *
 * @example
 * const [preview, setPreview] = useState({ open: false, src: '', alt: '' })
 * <Avatar src={row.avatar} onClick={() => setPreview({ open: true, src: row.avatar, alt: row.name })} />
 * <ImagePreviewDialog
 *   open={preview.open}
 *   onClose={() => setPreview(p => ({ ...p, open: false }))}
 *   src={preview.src}
 *   alt={preview.alt}
 *   title="Profile photo"
 * />
 */
function ImagePreviewDialog({
  open = false,
  onClose,
  src = '',
  alt = 'Image preview',
  title = '',
  caption = '',
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!src) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '7px',
          border: '2px solid',
          borderColor: alpha(theme.palette.primary.main, 0.25),
          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          bgcolor: theme.palette.background.paper,
          maxWidth: isMobile ? '95vw' : 560,
          maxHeight: isMobile ? '92vh' : '90vh',
          m: isMobile ? 1 : 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: alpha(theme.palette.common.black, 0.65),
            backdropFilter: 'blur(6px)',
          },
        },
      }}
    >
      {/* Header: close icon only, right-aligned */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: 1.5,
          py: 1,
          borderBottom: '1px solid',
          borderColor: theme.palette.grey[200],
          bgcolor: theme.palette.grey[50],
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onClose}
          size="medium"
          sx={{
            borderRadius: '7px',
            color: theme.palette.grey[700],
            '&:hover': {
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
          aria-label="Close preview"
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Image + name in middle */}
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        {/* Image: full area so complete image shows clearly */}
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          sx={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            maxHeight: isMobile ? '60vh' : '65vh',
            objectFit: 'contain',
            borderRadius: '7px',
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
            display: 'block',
          }}
          onError={(e) => {
            e.target.onerror = null
            e.target.src =
              'data:image/svg+xml,' +
              encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>'
              )
            e.target.alt = 'Image could not be loaded'
          }}
        />

        {/* Name in the middle (centered below image) */}
        {title && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mt: 2,
              flexShrink: 0,
            }}
          >
            <ImageRoundedIcon
              sx={{
                fontSize: 22,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              {title}
            </Typography>
          </Box>
        )}

        {caption && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            {caption}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ImagePreviewDialog
