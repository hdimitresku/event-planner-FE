"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { User, Lock, Bell, Shield, CreditCard, Globe, Moon, Sun, Upload, Trash2, Check } from 'lucide-react'
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [theme, setTheme] = useState("system")
  
  // Sample user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    country: "United States",
    postalCode: "10001",
    profileImage: "/placeholder.svg?height=200&width=200&text=JD"
  }

  return (
    <BusinessLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("business.sidebar.settings")}</h1>
        <p className="text-muted-foreground mt-1">{t("dashboard.settings.personalInfo")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Settings Navigation */}
        <Tabs orientation="vertical" defaultValue="profile" onValueChange={setActiveTab} className="flex flex-col">
          <TabsList className="h-auto flex flex-col items-start justify-start p-0 bg-transparent">
            <TabsTrigger 
              value="profile" 
              className={`w-full justify-start px-3 py-2 ${activeTab === "profile" ? "bg-muted" : ""}`}
            >
              <User className="mr-2 h-4 w-4" />
              {t("dashboard.settings.personalInfo")}
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className={`w-full justify-start px-3 py-2 ${activeTab === "account" ? "bg-muted" : ""}`}
            >
              <Lock className="mr-2 h-4 w-4" />
              {t("dashboard.settings.securitySettings")}
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className={`w-full justify-start px-3 py-2 ${activeTab === "notifications" ? "bg-muted" : ""}`}
            >
              <Bell className="mr-2 h-4 w-4" />
              {t("dashboard.notificationSettings")}
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className={`w-full justify-start px-3 py-2 ${activeTab === "payment" ? "bg-muted" : ""}`}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {t("dashboard.settings.paymentMethods")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Settings Content */}
        <div>
          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.settings.personalInfo")}</CardTitle>
                <CardDescription>
                  {t("dashboard.updateProfile")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img 
                        src={user.profileImage || "/placeholder.svg"} 
                        alt={user.name} 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {t("dashboard.settings.uploadPhoto")}
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("business.common.name")}</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("dashboard.email")}</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("dashboard.phone")}</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">{t("business.common.address")}</Label>
                        <Input id="address" defaultValue={user.address} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("business.common.city")}</Label>
                        <Input id="city" defaultValue={user.city} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">{t("business.common.country")}</Label>
                        <Select defaultValue={user.country}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder={t("business.common.country")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                            <SelectItem value="China">China</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Brazil">Brazil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">{t("business.common.zip")}</Label>
                        <Input id="postalCode" defaultValue={user.postalCode} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">{t("business.common.cancel")}</Button>
                <Button>{t("business.common.save")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.account")}</CardTitle>
                <CardDescription>
                  {t("settings.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="settings-section">
                  <h3>{t("settings.password")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t("settings.currentPassword")}</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("settings.newPassword")}</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("settings.confirmPassword")}</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button className="mt-4">{t("settings.changePassword")}</Button>
                </div>

                <div className="settings-section">
                  <h3>{t("settings.twoFactor")}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="settings-section border-destructive/20">
                  <h3 className="text-destructive">{t("settings.deleteAccount")}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("settings.deleteWarning")}
                  </p>
                  <Button variant="destructive" className="mt-4">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("settings.deleteAccount")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.notifications")}</CardTitle>
                <CardDescription>
                  {t("settings.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">{t("settings.emailNotifications")}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("settings.bookingUpdates")}</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your bookings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("settings.promotions")}</p>
                        <p className="text-sm text-muted-foreground">Receive promotional offers and discounts</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("settings.newsletter")}</p>
                        <p className="text-sm text-muted-foreground">Receive our monthly newsletter</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{t("settings.pushNotifications")}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("settings.bookingUpdates")}</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications about your bookings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("settings.promotions")}</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications for promotions</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{t("settings.smsNotifications")}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t("settings.bookingUpdates")}</p>
                        <p className="text-sm text-muted-foreground">Receive SMS notifications about your bookings</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">{t("settings.cancel")}</Button>
                <Button>{t("settings.save")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language")}</CardTitle>
                <CardDescription>
                  {t("settings.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${language === 'en' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setLanguage('en')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src="/placeholder.svg?height=40&width=40&text=EN" alt="English" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">English</p>
                            <p className="text-sm text-muted-foreground">United States</p>
                          </div>
                        </div>
                        {language === 'en' && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${language === 'sq' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setLanguage('sq')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src="/placeholder.svg?height=40&width=40&text=SQ" alt="Albanian" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">Albanian</p>
                            <p className="text-sm text-muted-foreground">Shqip</p>
                          </div>
                        </div>
                        {language === 'sq' && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.theme")}</CardTitle>
                <CardDescription>
                  {t("settings.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                          <Sun className="h-6 w-6" />
                        </div>
                        <p className="font-medium">{t("settings.lightMode")}</p>
                      </div>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                          <Moon className="h-6 w-6" />
                        </div>
                        <p className="font-medium">{t("settings.darkMode")}</p>
                      </div>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setTheme('system')}
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
        </div>
      </div>
    </BusinessLayout>
  )
}
