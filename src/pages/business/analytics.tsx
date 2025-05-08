"use client"

import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Calendar, Download } from "lucide-react"

export default function BusinessAnalyticsPage() {
  const { t } = useLanguage()

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("business.analytics.title") || "Analytics"}</h1>
          <p className="text-gray-500">{t("business.analytics.subtitle") || "Track your business performance"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {t("business.analytics.dateRange") || "Last 30 Days"}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("business.analytics.export") || "Export"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.analytics.totalBookings") || "Total Bookings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +12.5% {t("business.analytics.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("business.analytics.revenue") || "Revenue"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% {t("business.analytics.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.analytics.averageBookingValue") || "Avg. Booking Value"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$184.62</div>
            <p className="text-xs text-muted-foreground">
              +4.3% {t("business.analytics.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.analytics.occupancyRate") || "Occupancy Rate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% {t("business.analytics.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="mt-8">
        <TabsList>
          <TabsTrigger className="text-muted-foreground hover:text-foreground transition-colors hover-underline" value="revenue">{t("business.analytics.revenue") || "Revenue"}</TabsTrigger>
          <TabsTrigger className="text-muted-foreground hover:text-foreground transition-colors hover-underline" value="bookings">{t("business.analytics.bookings") || "Bookings"}</TabsTrigger>
          <TabsTrigger className="text-muted-foreground hover:text-foreground transition-colors hover-underline" value="venues">{t("business.analytics.venues") || "Venues"}</TabsTrigger>
          <TabsTrigger className="text-muted-foreground hover:text-foreground transition-colors hover-underline" value="customers">{t("business.analytics.customers") || "Customers"}</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("business.analytics.revenueOverTime") || "Revenue Over Time"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">{t("business.analytics.chartPlaceholder") || "Chart Placeholder"}</p>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("business.analytics.revenueByVenue") || "Revenue by Venue"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">{t("business.analytics.chartPlaceholder") || "Chart Placeholder"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("business.analytics.revenueByMonth") || "Revenue by Month"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">{t("business.analytics.chartPlaceholder") || "Chart Placeholder"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </BusinessLayout>
  )
}
