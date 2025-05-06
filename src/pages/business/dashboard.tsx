"use client"

import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Building, Calendar, DollarSign, Users } from "lucide-react"

export default function BusinessDashboardPage() {
  const { t } = useLanguage()

  return (
    <BusinessLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("business.dashboard.title") || "Dashboard"}</h1>
        <p className="text-gray-500">{t("business.dashboard.subtitle") || "Overview of your business performance"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.dashboard.totalRevenue") || "Total Revenue"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("business.dashboard.bookings") || "Bookings"}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("business.dashboard.venues") || "Venues"}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("business.dashboard.customers") || "Customers"}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{t("business.dashboard.overview") || "Overview"}</TabsTrigger>
            <TabsTrigger value="analytics">{t("business.dashboard.analytics") || "Analytics"}</TabsTrigger>
            <TabsTrigger value="reports">{t("business.dashboard.reports") || "Reports"}</TabsTrigger>
            <TabsTrigger value="notifications">{t("business.dashboard.notifications") || "Notifications"}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("business.dashboard.recentBookings") || "Recent Bookings"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-gray-200"></div>
                      <div>
                        <p className="font-medium">Wedding Reception</p>
                        <p className="text-sm text-gray-500">June 1, 2023 • 6:00 PM</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-medium">$1,200.00</p>
                        <p className="text-sm text-gray-500">Paid</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  )
}
