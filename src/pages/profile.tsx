"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { Switch } from "../components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, CreditCard, LogOut, Building, Home } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    bookingReminders: true,
    promotions: false,
    updates: true,
  })

  useEffect(() => {
    // Redirect if not authenticated
    // if (!isAuthenticated) {
    //   navigate("/login")
    //   return
    // }

    // Populate profile data from user object
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        address: "",
        birthday: "",
      })
    }
  }, [isAuthenticated, user, navigate])

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to update the user profile
    setIsEditing(false)
    // Show success message
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleDashboardRedirect = () => {
    if (user?.role === "business") {
      navigate("/business")
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={`/placeholder.svg?text=${user?.avatar || "U"}`} alt={user?.name || "User"} />
              <AvatarFallback>{user?.avatar || user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{t("profile.title") || "My Profile"}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDashboardRedirect}>
              {user?.role === "business" ? (
                <>
                  <Building className="mr-2 h-4 w-4" />
                  {t("profile.businessDashboard") || "Business Dashboard"}
                </>
              ) : (
                <>
                  <Home className="mr-2 h-4 w-4" />
                  {t("profile.dashboard") || "Dashboard"}
                </>
              )}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("profile.logout") || "Logout"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-full">
            <TabsTrigger value="personal">{t("profile.tabs.personal") || "Personal"}</TabsTrigger>
            <TabsTrigger value="security">{t("profile.tabs.security") || "Security"}</TabsTrigger>
            <TabsTrigger value="notifications">{t("profile.tabs.notifications") || "Notifications"}</TabsTrigger>
            <TabsTrigger value="payment">{t("profile.tabs.payment") || "Payment"}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.personalInfo") || "Personal Information"}</CardTitle>
                <CardDescription>
                  {t("profile.personalInfoDesc") || "Update your personal information and contact details."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {t("profile.fullName") || "Full Name"}
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {t("profile.email") || "Email"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {t("profile.phone") || "Phone Number"}
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {t("profile.address") || "Address"}
                      </Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="birthday" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {t("profile.birthday") || "Birthday"}
                      </Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="flex justify-end gap-2 mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        {t("profile.cancel") || "Cancel"}
                      </Button>
                      <Button type="submit">{t("profile.save") || "Save Changes"}</Button>
                    </div>
                  ) : (
                    <div className="flex justify-end mt-6">
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        {t("profile.edit") || "Edit Profile"}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.security") || "Security"}</CardTitle>
                <CardDescription>
                  {t("profile.securityDesc") || "Manage your account security and authentication settings."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                    {t("profile.password") || "Password"}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="current-password">{t("profile.currentPassword") || "Current Password"}</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="new-password">{t("profile.newPassword") || "New Password"}</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password">{t("profile.confirmPassword") || "Confirm Password"}</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>{t("profile.updatePassword") || "Update Password"}</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("profile.twoFactor") || "Two-Factor Authentication"}</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>{t("profile.twoFactorStatus") || "Two-factor authentication is currently disabled."}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("profile.twoFactorDesc") ||
                          "Add an extra layer of security to your account by enabling two-factor authentication."}
                      </p>
                    </div>
                    <Button variant="outline">{t("profile.enable") || "Enable"}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.notifications") || "Notifications"}</CardTitle>
                <CardDescription>
                  {t("profile.notificationsDesc") || "Manage how you receive notifications and updates."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
                      {t("profile.notificationChannels") || "Notification Channels"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("profile.emailNotifications") || "Email Notifications"}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.emailNotificationsDesc") || "Receive notifications via email."}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("profile.pushNotifications") || "Push Notifications"}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.pushNotificationsDesc") || "Receive notifications on your device."}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("profile.smsNotifications") || "SMS Notifications"}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.smsNotificationsDesc") || "Receive notifications via text message."}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {t("profile.notificationTypes") || "Notification Types"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("profile.bookingReminders") || "Booking Reminders"}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.bookingRemindersDesc") || "Receive reminders about your upcoming bookings."}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.bookingReminders}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, bookingReminders: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("profile.promotions") || "Promotions and Offers"}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.promotionsDesc") || "Receive updates about promotions and special offers."}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.promotions}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t("profile.updates") || "Platform Updates"}</Label>
                          <p className="text-sm text-muted-foreground">
                            {t("profile.updatesDesc") || "Receive updates about new features and improvements."}
                          </p>
                        </div>
                        <Switch
                          checked={notifications.updates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">{t("profile.savePreferences") || "Save Preferences"}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.paymentMethods") || "Payment Methods"}</CardTitle>
                <CardDescription>
                  {t("profile.paymentMethodsDesc") || "Manage your payment methods and billing information."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                      {t("profile.savedCards") || "Saved Cards"}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs font-medium">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            {t("profile.edit") || "Edit"}
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive">
                            {t("profile.remove") || "Remove"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4">
                      {t("profile.addPaymentMethod") || "Add Payment Method"}
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t("profile.billingAddress") || "Billing Address"}</h3>
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <Label htmlFor="billing-name">{t("profile.name") || "Name"}</Label>
                        <Input id="billing-name" defaultValue={user?.name || ""} />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="billing-address">{t("profile.address") || "Address"}</Label>
                        <Input id="billing-address" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="billing-city">{t("profile.city") || "City"}</Label>
                          <Input id="billing-city" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="billing-zip">{t("profile.zipCode") || "ZIP Code"}</Label>
                          <Input id="billing-zip" />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="billing-country">{t("profile.country") || "Country"}</Label>
                        <Input id="billing-country" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">{t("profile.saveBillingInfo") || "Save Billing Information"}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
