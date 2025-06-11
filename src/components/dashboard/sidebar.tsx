import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Calendar, User, Heart, MessageCircle, CreditCard, LogOut } from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { LayoutHeader } from "./layout-header"
import { useAuth } from "../../context/auth-context"

export function DashboardSidebar() {
  const { t } = useLanguage()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-16 md:w-64 bg-background border-r">
      <Card className="h-full border-0 rounded-none">
        <LayoutHeader currentUser={user} />
        <CardContent className="p-4">
          <div className="grid divide-y">
            <Link to="/dashboard" className="flex items-center p-3 hover:bg-muted">
              <Calendar className={`mr-2 h-4 w-4 ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground"}`} />
              <span className="hidden md:inline text-sm font-medium">{t("dashboard.bookings") || "My Bookings"}</span>
            </Link>
            <Link to="/dashboard/profile" className="flex items-center p-3 hover:bg-muted">
              <User className={`mr-2 h-4 w-4 ${isActive("/dashboard/profile") ? "text-primary" : "text-muted-foreground"}`} />
              <span className="hidden md:inline text-sm">{t("dashboard.profile") || "Profile"}</span>
            </Link>
            <Link to="/dashboard/favorites" className="flex items-center p-3 hover:bg-muted">
              <Heart className={`mr-2 h-4 w-4 ${isActive("/dashboard/favorites") ? "text-primary" : "text-muted-foreground"}`} />
              <span className="hidden md:inline text-sm">{t("dashboard.favorites") || "Favorites"}</span>
            </Link>
            <Link to="/dashboard/messages" className="flex items-center p-3 hover:bg-muted">
              <MessageCircle className={`mr-2 h-4 w-4 ${isActive("/dashboard/messages") ? "text-primary" : "text-muted-foreground"}`} />
              <span className="hidden md:inline text-sm">{t("dashboard.messages") || "Messages"}</span>
            </Link>
            <Link to="/dashboard/payment-methods" className="flex items-center p-3 hover:bg-muted">
              <CreditCard className={`mr-2 h-4 w-4 ${isActive("/dashboard/payment-methods") ? "text-primary" : "text-muted-foreground"}`} />
              <span className="hidden md:inline text-sm">{t("dashboard.paymentMethods") || "Payment Methods"}</span>
            </Link>
            <div className="p-3">
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">{t("dashboard.signOut") || "Sign Out"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 