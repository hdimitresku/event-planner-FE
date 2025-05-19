import type { User } from "../models/user"

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignupData {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  password: string
  role: "user" | "host"
}

const API_URL = import.meta.env.VITE_API_URL

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log(API_URL)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      // Store auth data in localStorage
      this.setAuthData(data)

      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  /**
   * Register a new user
   */
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const data = await response.json()

      // Store auth data in localStorage
      this.setAuthData(data)

      return data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken")
  },

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem("user")
    if (!userJson) return null

    try {
      return JSON.parse(userJson)
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  },

  /**
   * Get user role
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser()
    return user ? user.role : null
  },

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken")
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken")
  },

  /**
   * Set authentication data in localStorage
   */
  setAuthData(data: AuthResponse): void {
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
    localStorage.setItem("user", JSON.stringify(data.user))
  },
}
