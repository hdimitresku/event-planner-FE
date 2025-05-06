"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"

export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    login({ name: "John Doe", email: "john@example.com" })

    setIsLoading(false)
    navigate("/dashboard")
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("login.title") || "Log in to your account"}</h1>
          <p className="text-gray-500">{t("login.description") || "Enter your email below to login to your account"}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("login.email") || "Email"}
            </label>
            <Input id="email" type="email" placeholder="m@example.com" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("login.password") || "Password"}
              </label>
              <Link to="/forgot-password" className="text-sm text-[#D72638] hover:underline">
                {t("login.forgotPassword") || "Forgot password?"}
              </Link>
            </div>
            <Input id="password" type="password" required autoComplete="current-password" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("login.rememberMe") || "Remember me"}
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
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
          <p className="text-sm text-gray-500">
            {t("login.noAccount") || "Don't have an account?"}{" "}
            <Link to="/signup" className="text-[#D72638] hover:underline">
              {t("login.signUp") || "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
