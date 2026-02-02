import { Link, useLocation } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'

const BOTTOM_NAV_HEIGHT = 72

const bottomNavItems = [
  { label: 'Home', to: '/', value: '/', Icon: HomeRoundedIcon },
  { label: 'Courses', to: '/courses', value: '/courses', Icon: AutoStoriesRoundedIcon },
  { label: 'Sign In', to: '/sign-in', value: 'sign-in', Icon: PersonOutlineRoundedIcon },
]

function MobileBottomNav() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const pathname = location.pathname

  const currentValue =
    pathname === '/' ? '/' : pathname === '/courses' ? '/courses' : 'sign-in'

  if (!isMobile) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar - 1,
        display: { xs: 'block', md: 'none' },
        pb: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      <BottomNavigation
        value={currentValue}
        showLabels
        sx={{
          height: BOTTOM_NAV_HEIGHT,
          bgcolor: alpha(theme.palette.background.paper, 0.98),
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.15),
          boxShadow: '0 -8px 32px rgba(15, 23, 42, 0.1), 0 -1px 0 rgba(0,0,0,0.04)',
          gap: 0.5,
          px: 0.5,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 72,
            py: 1.5,
            px: 1,
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: '0.7rem',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 2.5,
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              fontWeight: 500,
              mt: 0.5,
              transition: 'all 0.25s',
            },
            '& .MuiSvgIcon-root': {
              fontSize: 28,
              transition: 'transform 0.25s',
            },
            /* Active state: soft, clear, user-friendly — teal tint + primary color */
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2.5,
              mx: 0.25,
              '& .MuiBottomNavigationAction-label': {
                fontWeight: 700,
                fontSize: '0.75rem',
                color: theme.palette.primary.main,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                },
              },
              '& .MuiSvgIcon-root': {
                color: theme.palette.primary.main,
              },
            },
          },
        }}
      >
        {bottomNavItems.map((item) => {
          const Icon = item.Icon
          return (
            <BottomNavigationAction
              key={item.value}
              component={Link}
              to={item.to}
              label={item.label}
              value={item.value}
              icon={<Icon sx={{ fontSize: 26 }} />}
            />
          )
        })}
      </BottomNavigation>
    </Box>
  )
}

export default MobileBottomNav
export { BOTTOM_NAV_HEIGHT }
