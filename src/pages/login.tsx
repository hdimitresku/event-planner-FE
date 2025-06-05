"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { authService } from "@/services/authService"

export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Use the auth service to login
      const data = await authService.login(formData)

      // Update auth context
      login(data.user.email, formData.password)

      // Redirect based on role
      if (data.user.role === "host") {
        navigate("/business/dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Enhanced abstract background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 dark:bg-sky-700 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-300 to-emerald-400 dark:bg-emerald-700 blur-3xl"></div>
      </div>
      
      {/* Subtle texture overlay for light mode */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      
      <div className="container max-w-md mx-auto py-12 relative z-10 flex items-center min-h-screen">
        <div className="w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200/80 dark:border-slate-700">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t("login.title") || "Log in to your account"}</h1>
              <p className="text-gray-600 dark:text-gray-300">{t("login.description") || "Enter your email below to login to your account"}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                >
                  {t("login.email") || "Email"}
                </label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                  >
                    {t("login.password") || "Password"}
                  </label>
                  <Link to="/forgot-password" className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors">
                    {t("login.forgotPassword") || "Forgot password?"}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 border-gray-300 dark:border-gray-600" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                >
                  {t("login.rememberMe") || "Remember me"}
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("login.loggingIn") || "Logging in..."}
                  </span>
                ) : (
                  t("login.login") || "Login"
                )}
              </Button>
            </form>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("login.noAccount") || "Don't have an account?"}{" "}
                <Link to="/signup" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-medium transition-colors">
                  {t("login.signUp") || "Sign up"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
