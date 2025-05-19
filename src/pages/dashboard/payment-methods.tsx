"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { User as UserModel } from "../../models/user"
import * as userService from "../../services/userService"
import { useLanguage } from "../../context/language-context"
import { CreditCard, PlusCircle } from "lucide-react"
import { Button } from "../../components/ui/button"

export default function PaymentMethodsPage() {
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      const user = await userService.getLoggedInUser()
      setCurrentUser(user)
    }
    
    fetchUser()
  }, [])

  return (
    <DashboardLayout currentUser={currentUser}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.paymentMethods") || "Payment Methods"}</h1>
          <p className="text-muted-foreground">
            {t("paymentMethods.description") || "Manage your payment methods for bookings"}
          </p>
        </div>

        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard className="h-16 w-16 text-muted stroke-[1.5px] mb-4" />
            <h3 className="text-xl font-medium">
              {t("paymentMethods.noPaymentMethods") || "No payment methods added yet"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {t("paymentMethods.noPaymentMethodsDescription") || "Add a payment method to make booking faster and easier"}
            </p>
            <Button className="mt-6">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("paymentMethods.addPaymentMethod") || "Add Payment Method"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 