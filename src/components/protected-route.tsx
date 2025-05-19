"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, userRole } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If a specific role is required and the user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to the appropriate dashboard based on their role
    return <Navigate to={userRole === "host" ? "/business/dashboard" : "/dashboard"} replace />
  }

  return <>{children}</>
}
