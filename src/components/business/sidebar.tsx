"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useLanguage } from "../../context/language-context"
import {
  LayoutDashboard,
  Building,
  Utensils,
  Calendar,
  BarChart,
  MessageSquare,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function BusinessSidebar({ className }: SidebarProps) {
  const { t } = useLanguage()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const routes = [
    {
      label: t("business.sidebar.dashboard") || "Dashboard",
      icon: LayoutDashboard,
      href: "/business/dashboard",
      active: location.pathname === "/business/dashboard",
    },
    {
      label: t("business.sidebar.venues") || "My Venues",
      icon: Building,
      href: "/business/venues",
      active: location.pathname === "/business/venues" || location.pathname.startsWith("/business/venues/"),
    },
    {
      label: t("business.sidebar.services") || "My Services",
      icon: Utensils,
      href: "/business/service-management",
      active:
        location.pathname === "/business/service-management" || location.pathname.startsWith("/business/services/"),
    },
    {
      label: t("business.sidebar.venue-bookings") || "Venue Bookings",
      icon: Calendar,
      href: "/business/venue-bookings",
      active: location.pathname === "/business/venue-bookings",
    },
    {
      label: t("business.sidebar.service-bookings") || "Service Bookings",
      icon: Calendar,
      href: "/business/service-bookings",
      active: location.pathname === "/business/service-bookings",
    },
    {
      label: t("business.sidebar.analytics") || "Analytics",
      icon: BarChart,
      href: "/business/analytics",
      active: location.pathname === "/business/analytics",
    },
    {
      label: t("business.sidebar.messages") || "Messages",
      icon: MessageSquare,
      href: "/business/messages",
      active: location.pathname === "/business/messages",
    },
    {
      label: t("business.sidebar.settings") || "Settings",
      icon: Settings,
      href: "/business/settings",
      active: location.pathname === "/business/settings",
    },
    {
      label: t("business.sidebar.help") || "Help & Support",
      icon: HelpCircle,
      href: "/business/help",
      active: location.pathname === "/business/help",
    },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        } transition-opacity duration-200`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 z-40 h-[calc(100vh-4rem)] bg-card shadow-lg text-card-foreground transition-all duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16" : "w-64"} ${className}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
            {!isCollapsed && (
              <Link to="/business" className="flex items-center gap-2 font-bold text-xl">
                <span className="text-primary">Venue</span>
                <span className="text-secondary">Space</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hidden md:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-6">
            <nav className="grid gap-2 px-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center p-3 hover:bg-muted ${
                    route.active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <route.icon className={`mr-2 h-4 w-4 ${route.active ? "text-primary" : "text-muted-foreground"}`} />
                  {!isCollapsed && <span className="text-sm">{route.label}</span>}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-border/50 p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/">
                <LogOut className="mr-2 h-4 w-4" />
                {!isCollapsed && (t("business.sidebar.logout") || "Logout")}
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
