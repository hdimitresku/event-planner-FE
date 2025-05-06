"use client"

import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useLanguage } from "../context/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState } from "react"

export function SiteHeader() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-soft-blue">Venue</span>
          <span className="text-warm-coral">Space</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link to="/venues" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.venues")}
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.services")}
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.howItWorks")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:text-primary transition-colors">
                {t("nav.dashboard")}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                {t("nav.login")}
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-white">
                {t("nav.signup")}
              </Button>
            </Link>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <Link
                  to="/venues"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.venues")}
                </Link>
                <Link
                  to="/services"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.services")}
                </Link>
                <Link
                  to="/how-it-works"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.howItWorks")}
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.dashboard")}
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white">{t("nav.signup")}</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
