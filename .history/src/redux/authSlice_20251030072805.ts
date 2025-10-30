import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAPI, logoutAPI, type LoginData } from '../../services/authService'

interface AuthState {
  user: any | null
  token: string | null
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  success: false,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await loginAPI(loginData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI()
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    },
    resetAuthState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.access_token
        state.success = true
        state.error = null
        console.log('✅ Login success:', action.payload.user)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
        console.error('❌ Login failed:', action.payload)
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.error = null
        state.success = false
        console.log('✅ Logout success')
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.token = null
        console.error('❌ Logout failed:', action.payload)
      })
  },
})

export const { clearError, clearSuccess, resetAuthState } = authSlice.actions
export default authSlice.reducer