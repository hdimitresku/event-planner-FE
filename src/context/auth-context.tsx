"use client"

import { Address } from "@/models/common"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import * as userService from "../services/userService"
import type { User as UserModel } from "../models/user"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserModel | null
  userRole: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<UserModel | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setUserRole(currentUser.role)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // Clear potentially corrupted auth data
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await userService.login({ email, password })
      if (result.success && result.user) {
        setUser(result.user)
        setUserRole(result.user.role)
        setIsAuthenticated(true)
      } else {
        throw new Error(result.error || "Login failed")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await userService.logout()
    } finally {
      // Reset state
      setUser(null)
      setUserRole(null)
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        userRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
