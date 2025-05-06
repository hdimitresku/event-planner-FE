"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"

export default function SignupPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1000))
    login({ name: "John Doe", email: "john@example.com" })

    setIsLoading(false)
    navigate("/dashboard")
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("signup.title") || "Create an account"}</h1>
          <p className="text-gray-500">
            {t("signup.description") || "Enter your information below to create your account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("signup.firstName") || "First name"}
              </label>
              <Input id="firstName" type="text" required autoComplete="given-name" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("signup.lastName") || "Last name"}
              </label>
              <Input id="lastName" type="text" required autoComplete="family-name" />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("signup.email") || "Email"}
            </label>
            <Input id="email" type="email" placeholder="m@example.com" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("signup.password") || "Password"}
            </label>
            <Input id="password" type="password" required autoComplete="new-password" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("signup.agreeTerms") || "I agree to the terms and conditions"}
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
                {t("signup.creating") || "Creating account..."}
              </span>
            ) : (
              t("signup.createAccount") || "Create account"
            )}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {t("signup.alreadyHaveAccount") || "Already have an account?"}{" "}
            <Link to="/login" className="text-[#D72638] hover:underline">
              {t("signup.login") || "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
