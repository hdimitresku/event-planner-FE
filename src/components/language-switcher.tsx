"use client"

import { Button } from "./ui/button"
import { useLanguage } from "../context/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "sq" ? "en" : "sq")
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {language === "sq" ? "EN" : "SQ"}
    </Button>
  )
}
