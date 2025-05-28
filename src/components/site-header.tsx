"use client"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useLanguage } from "../context/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"
import { Menu, User, LogOut, Settings, LayoutDashboard, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function SiteHeader() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, userRole, user, logout } = useAuth()
  const navigate = useNavigate();


  const handleLogout = async () => {
    logout();
    localStorage.clear();
    navigate("/");
    setOpen(false)
  }

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    return userRole === "host" ? "/business/dashboard" : "/dashboard"
  }

  // Get profile link based on user role
  const getProfileLink = () => {
    return userRole === "host" ? "/business/settings" : "/dashboard/profile"
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  return (
    <header className="border-b border-border bg-background/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
          <span className="text-primary">Venue</span>
          <span className="text-secondary">Space</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link to="/venues" className={`nav-link ${location.pathname === "/venues" ? "active" : ""}`}>
            {t("nav.venues") || "Venues"}
          </Link>
          <Link to="/services" className={`nav-link ${location.pathname === "/services" ? "active" : ""}`}>
            {t("nav.services") || "Services"}
          </Link>
          <Link to="/how-it-works" className={`nav-link ${location.pathname === "/how-it-works" ? "active" : ""}`}>
            {t("nav.howItWorks") || "How It Works"}
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary">
                    <LayoutDashboard className="h-4 w-4" />
                    {t("nav.dashboard") || "Dashboard"}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getProfileLink()}>
                        <User className="mr-2 h-4 w-4" />
                        {t("nav.profile") || "Profile"}
                      </Link>
                    </DropdownMenuItem>
                    {userRole !== "host" && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/favorites">
                          <Heart className="mr-2 h-4 w-4" />
                          {t("nav.favorites") || "Favorites"}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to={userRole === "host" ? "/business/settings" : "/dashboard/settings"}>
                        <Settings className="mr-2 h-4 w-4" />
                        {t("nav.settings") || "Settings"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("nav.logout") || "Logout"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    {t("nav.login") || "Login"}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="btn-primary">
                    {t("nav.signup") || "Sign Up"}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="grid gap-6 py-6">
                <Link
                  to="/venues"
                  className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                    location.pathname === "/venues" ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t("nav.venues") || "Venues"}
                </Link>
                <Link
                  to="/services"
                  className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                    location.pathname === "/services" ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t("nav.services") || "Services"}
                </Link>
                <Link
                  to="/how-it-works"
                  className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                    location.pathname === "/how-it-works" ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t("nav.howItWorks") || "How It Works"}
                </Link>

                {isAuthenticated && (
                  <Link
                    to={getDashboardLink()}
                    className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                      location.pathname.includes("dashboard") || location.pathname.includes("business")
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    {t("nav.dashboard") || "Dashboard"}
                  </Link>
                )}

                <div className="flex flex-col gap-3 mt-6">
                  {isAuthenticated ? (
                    <>
                      <Link to={getProfileLink()} onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full justify-start border-primary text-primary hover:bg-primary/10">
                          <User className="mr-2 h-4 w-4" />
                          {t("nav.profile") || "Profile"}
                        </Button>
                      </Link>
                      {userRole !== "host" && (
                        <Link to="/dashboard/favorites" onClick={() => setOpen(false)}>
                          <Button variant="outline" className="w-full justify-start border-primary text-primary hover:bg-primary/10">
                            <Heart className="mr-2 h-4 w-4" />
                            {t("nav.favorites") || "Favorites"}
                          </Button>
                        </Link>
                      )}
                      <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("nav.logout") || "Logout"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                          {t("nav.login") || "Login"}
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setOpen(false)}>
                        <Button className="w-full btn-primary">
                          {t("nav.signup") || "Sign Up"}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
