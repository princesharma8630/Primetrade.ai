import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aimailer-backend.onrender.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.detail || 'Something went wrong'
      return Promise.reject(new Error(message))
    } else if (error.request) {
      return Promise.reject(new Error('No response from server. Please check your connection.'))
    } else {
      return Promise.reject(new Error(error.message || 'Request failed'))
    }
  }
)

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  data: any
  access_token: string
  token_type: string
  user: {
    id: number
    name: string
    email: string
    organization: string
    role: string
  }
}

export interface LogoutResponse {
  message: string
}

export const loginAPI = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    console.log('📤 Logging in:', loginData.email)
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData)
    
    if (response.data.data.access_token) {
      localStorage.setItem('token', response.data.data.access_token)
      console.log('✅ Token stored')
    }
    
    console.log('✅ Login success:', response.data.data)
    return response.data.data
  } catch (error: any) {
    console.error('❌ Login error:', error.message)
    throw error
  }
}

export const logoutAPI = async (): Promise<LogoutResponse> => {
  try {
    console.log('📤 Logging out...')
    const response = await apiClient.post<LogoutResponse>('/auth/logout')
    
    localStorage.removeItem('token')
    console.log('✅ Logout success')
    
    return response.data
  } catch (error: any) {
    localStorage.removeItem('token')
    console.error('❌ Logout error:', error.message)
    throw error
  }
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const clearAuth = (): void => {
  localStorage.removeItem('token')
}