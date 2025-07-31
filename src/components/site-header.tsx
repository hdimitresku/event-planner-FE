"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu, User, LogOut, Settings, Heart, Calendar, Building2 } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { CurrencySwitcher } from "./currency-switcher"
import { ThemeToggle } from "./theme-toggle"
import { CartButton } from "./cart/cart-button"
import { CartSidebar } from "./cart/cart-sidebar"
import { toast } from "sonner"

export function SiteHeader() {
  const { user, logout, userRole } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success(t("auth.logoutSuccess") || "Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error(t("auth.logoutError") || "Error logging out")
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { href: "/", label: t("nav.home") || "Home" },
    { href: "/venues", label: t("nav.venues") || "Venues" },
    { href: "/services", label: t("nav.services") || "Services" },
    { href: "/how-it-works", label: t("nav.howItWorks") || "How it Works" },
    { href: "/about", label: t("nav.about") || "About" },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl">EventSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Currency Switcher */}
            <CurrencySwitcher />

            {/* Cart Button */}
            <CartButton />

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture || ""} alt={user.displayName || ""} />
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || `${user.firstName} ${user.lastName}`}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Customer Menu Items */}
                  {(userRole === "customer" || userRole === "host") && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("nav.dashboard") || "Dashboard"}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/favorites" className="flex items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>{t("nav.favorites") || "Favorites"}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Business Menu Items */}
                  {userRole === "host" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/business/dashboard" className="flex items-center">
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>{t("nav.businessDashboard") || "Business Dashboard"}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/business/venues" className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{t("nav.myVenues") || "My Venues"}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("nav.settings") || "Settings"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("auth.logout") || "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t("auth.login") || "Log in"}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t("auth.signup") || "Sign up"}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`text-sm font-medium transition-colors hover:text-primary ${
                        isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {!user && (
                    <div className="flex flex-col space-y-2 pt-4">
                      <Button variant="ghost" asChild>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          {t("auth.login") || "Log in"}
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                          {t("auth.signup") || "Sign up"}
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  )
}
