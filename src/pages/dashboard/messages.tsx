"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/dashboard/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { User as UserModel } from "../../models/user"
import * as userService from "../../services/userService"
import { useLanguage } from "../../context/language-context"
import { MessageCircle } from "lucide-react"

export default function MessagesPage() {
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      const user = await userService.getUserById("user3")
      setCurrentUser(user)
    }
    
    fetchUser()
  }, [])

  return (
    <DashboardLayout currentUser={currentUser}>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.messages") || "Messages"}</h1>
          <p className="text-muted-foreground">
            {t("messages.description") || "Communicate with venue owners and service providers"}
          </p>
        </div>

        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <MessageCircle className="h-16 w-16 text-muted stroke-[1.5px] mb-4" />
            <h3 className="text-xl font-medium">
              {t("messages.noMessages") || "No messages yet"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {t("messages.noMessagesDescription") || "You'll see your conversations with venue owners and service providers here"}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 