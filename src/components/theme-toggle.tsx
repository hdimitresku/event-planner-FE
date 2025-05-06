"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "../context/theme-context"
import { useLanguage } from "../context/language-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? t("theme.lightMode") || "Switch to light mode" : t("theme.darkMode") || "Switch to dark mode"
      }
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
