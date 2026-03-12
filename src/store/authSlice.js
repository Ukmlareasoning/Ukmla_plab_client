import { createSlice } from '@reduxjs/toolkit'

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

function loadFromStorage() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    if (token && user) return { user, token, isLoggedIn: true }
  } catch {
    // ignore
  }
  return { user: null, token: null, isLoggedIn: false }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage(),
  reducers: {
    loginSuccess(state, action) {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isLoggedIn = true
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },
    logoutSuccess(state) {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem(USER_KEY, JSON.stringify(state.user))
    },
  },
})

export const { loginSuccess, logoutSuccess, updateUser } = authSlice.actions
export default authSlice.reducer
