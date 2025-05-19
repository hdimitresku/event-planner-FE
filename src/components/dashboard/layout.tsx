"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useLanguage } from "../../context/language-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  Calendar,
  User,
  Heart,
  MessageCircle,
  CreditCard,
  LogOut,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentUser?: any // This would be properly typed in a real app
}

export function DashboardLayout({ children, currentUser }: DashboardLayoutProps) {
  const { t } = useLanguage()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
        {/* Sidebar */}
        <div className="mb-8 w-full md:mb-0 md:w-64">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-white">
                  {currentUser?.profileImage ? (
                    <AvatarImage src={currentUser.profileImage} alt={currentUser.displayName} />
                  ) : (
                    <AvatarFallback>
                      {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-base">{currentUser?.displayName}</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-xs">
                    {currentUser?.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid divide-y">
                <Link to="/dashboard" className="flex items-center p-3 hover:bg-muted">
                  <Calendar className={`mr-2 h-4 w-4 ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{t("dashboard.bookings") || "My Bookings"}</span>
                </Link>
                <Link to="/dashboard/profile" className="flex items-center p-3 hover:bg-muted">
                  <User className={`mr-2 h-4 w-4 ${isActive("/dashboard/profile") ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm">{t("dashboard.profile") || "Profile"}</span>
                </Link>
                <Link to="/dashboard/favorites" className="flex items-center p-3 hover:bg-muted">
                  <Heart className={`mr-2 h-4 w-4 ${isActive("/dashboard/favorites") ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm">{t("dashboard.favorites") || "Favorites"}</span>
                </Link>
                <Link to="/dashboard/messages" className="flex items-center p-3 hover:bg-muted">
                  <MessageCircle className={`mr-2 h-4 w-4 ${isActive("/dashboard/messages") ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm">{t("dashboard.messages") || "Messages"}</span>
                </Link>
                <Link to="/dashboard/payment-methods" className="flex items-center p-3 hover:bg-muted">
                  <CreditCard className={`mr-2 h-4 w-4 ${isActive("/dashboard/payment-methods") ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm">{t("dashboard.paymentMethods") || "Payment Methods"}</span>
                </Link>
                <div className="p-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("dashboard.signOut") || "Sign Out"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
} 