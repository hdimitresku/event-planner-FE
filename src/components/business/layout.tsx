import React from "react"
import { BusinessSidebar } from "./sidebar"

interface BusinessLayoutProps {
  children: React.ReactNode
}

export function BusinessLayout({ children }: BusinessLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <BusinessSidebar />
      <div className="flex-1 md:ml-16">
        <div className="container py-4">{children}</div>
      </div>
    </div>
  )
}
