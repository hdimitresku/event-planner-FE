"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth-context"
import { useLanguage } from "../../context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Switch } from "../../components/ui/switch"
import { User, Mail, Phone, Calendar, Shield, Bell, CreditCard, LogOut, Moon, Sun, Check } from "lucide-react"
import * as userService from "../../services/userService"
import type { User as UserModel } from "../../models/user"
import type { Address } from "../../models/common"
import { AddressAutocomplete } from "../../components/address-autocomplete"

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)
  const [theme, setTheme] = useState("system")
  const [profileData, setProfileData] = useState<Partial<UserModel>>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    address: undefined
  })
  const [originalProfileData, setOriginalProfileData] = useState<Partial<UserModel>>({})
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
    // Fetch current user for dashboard layout
    const fetchUser = async () => {
      const userModel = await userService.getLoggedInUser()
      setCurrentUser(userModel)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    // Redirect if not authenticated
    // if (!isAuthenticated) {
    //   navigate("/login")
    //   return
    // }

    // Populate profile data from user object
    if (user) {
      const newProfileData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthday: user.birthday  ,
        address: user.address ? {
          street: user.address.street || null,
          city: user.address.city || null,
          state: user.address.state || null,
          zipCode: user.address.zipCode || null,
          country: user.address.country || null,
          location: user.address.location || null
        } : undefined
      }
      setProfileData(newProfileData)
      setOriginalProfileData(newProfileData)
    }
  }, [isAuthenticated, user, navigate])

  // Add a debug effect to monitor profileData changes
  useEffect(() => {
  }, [profileData])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedUser = {
      ...user,
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      email: profileData?.email || "",
      phoneNumber: profileData?.phoneNumber || "",
      birthday: profileData?.birthday || undefined,
      address: profileData?.address || undefined
    }

    await userService.updateUserProfile(updatedUser)
    setOriginalProfileData(profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setProfileData(originalProfileData)
    setIsEditing(false)
  }

  const handleAddressSelect = (address: Address) => {
    setProfileData((prev) => ({
      ...prev,
      address: {
        street: address.street || null,
        city: address.city || null,
        state: address.state || null,
        zipCode: address.zipCode || null,
        country: address.country || null,
        location: address.location || null
      }
    }))
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      address: prev.address ? {
        ...prev.address,
        [name]: value || null
      } : {
        street: name === 'street' ? value || null : null,
        city: name === 'city' ? value || null : null,
        state: name === 'state' ? value || null : null,
        zipCode: name === 'zipCode' ? value || null : null,
        country: name === 'country' ? value || null : null,
        location: null
      }
    }));
  };

  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProfileData(prev => ({
      ...prev,
      birthday: value || undefined
    }));
  };

  return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("profile.title") || "My Profile"}</h1>
            <p className="text-muted-foreground">
              {t("profile.description") || "Manage your account settings and preferences"}
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("profile.logout") || "Logout"}
          </Button>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-6 md:w-full">
            <TabsTrigger value="personal">{t("profile.tabs.personal") || "Personal"}</TabsTrigger>
            <TabsTrigger value="security">{t("profile.tabs.security") || "Security"}</TabsTrigger>
            <TabsTrigger value="notifications">{t("profile.tabs.notifications") || "Notifications"}</TabsTrigger>
            <TabsTrigger value="payment">{t("profile.tabs.payment") || "Payment"}</TabsTrigger>
            <TabsTrigger value="language">{t("settings.language") || "Language"}</TabsTrigger>
            <TabsTrigger value="theme">{t("settings.theme") || "Theme"}</TabsTrigger>
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
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {t("profile.firstName") || "First Name"}
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData?.firstName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {t("profile.lastName") || "Last Name"}
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData?.lastName || ""}
                        onChange={handleInputChange}
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
                        name="email"
                        type="email"
                        value={profileData?.email || ""}
                        onChange={handleInputChange}
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
                        name="phoneNumber"
                        value={profileData?.phoneNumber || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid gap-3">
                      <AddressAutocomplete
                        onAddressSelect={handleAddressSelect}
                        defaultAddress={profileData?.address || undefined}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street" className="flex items-center gap-2">
                          {t("profile.street") || "Street"}
                        </Label>
                        <Input
                          id="street"
                          name="street"
                          value={profileData?.address?.street || ""}
                          onChange={handleAddressChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("profile.city") || "City"}</Label>
                        <Input
                          id="city"
                          name="city"
                          value={profileData?.address?.city || ""}
                          onChange={handleAddressChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">{t("profile.state") || "State/Province"}</Label>
                        <Input
                          id="state"
                          name="state"
                          value={profileData?.address?.state || ""}
                          onChange={handleAddressChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">{t("profile.zipCode") || "ZIP/Postal Code"}</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={profileData?.address?.zipCode || ""}
                          onChange={handleAddressChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">{t("profile.country") || "Country"}</Label>
                        <Input
                          id="country"
                          name="country"
                          value={profileData?.address?.country || ""}
                          onChange={handleAddressChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="birthday" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {t("profile.birthday") || "Birthday"}
                      </Label>
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={profileData?.birthday ? profileData.birthday.toString().split('T')[0] : ""}
                        onChange={handleBirthdayChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="flex justify-end gap-2 mt-6">
                      <Button type="button" variant="outline" onClick={handleCancel}>
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
                      <AddressAutocomplete
                        onAddressSelect={(address) => console.log("Billing address selected:", address)}
                        label={t("profile.billingAddress") || "Billing Address"}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="billing-name">{t("profile.name") || "Name"}</Label>
                          <Input id="billing-name" defaultValue={user?.firstName || ""} />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="billing-street">{t("profile.street") || "Street"}</Label>
                          <Input id="billing-street" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="billing-city">{t("profile.city") || "City"}</Label>
                          <Input id="billing-city" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="billing-state">{t("profile.state") || "State/Province"}</Label>
                          <Input id="billing-state" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="billing-zip">{t("profile.zipCode") || "ZIP Code"}</Label>
                          <Input id="billing-zip" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="billing-country">{t("profile.country") || "Country"}</Label>
                          <Input id="billing-country" />
                        </div>
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

          <TabsContent value="language" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language")}</CardTitle>
                <CardDescription>{t("settings.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        language === "en" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => setLanguage("en")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src="/placeholder.svg?height=40&width=40&text=EN"
                              alt="English"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">English</p>
                            <p className="text-sm text-muted-foreground">United States</p>
                          </div>
                        </div>
                        {language === "en" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        language === "sq" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => setLanguage("sq")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src="/placeholder.svg?height=40&width=40&text=SQ"
                              alt="Albanian"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">Albanian</p>
                            <p className="text-sm text-muted-foreground">Shqip</p>
                          </div>
                        </div>
                        {language === "sq" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.theme")}</CardTitle>
                <CardDescription>{t("settings.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        theme === "light" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                          <Sun className="h-6 w-6" />
                        </div>
                        <p className="font-medium">{t("settings.lightMode")}</p>
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        theme === "dark" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                          <Moon className="h-6 w-6" />
                        </div>
                        <p className="font-medium">{t("settings.darkMode")}</p>
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        theme === "system" ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                          <div className="relative">
                            <Sun className="h-6 w-6 absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" />
                            <Moon className="h-6 w-6 absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2" />
                          </div>
                        </div>
                        <p className="font-medium">{t("settings.systemDefault")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
