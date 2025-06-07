import React from "react"
import { BusinessSidebar } from "./sidebar"

interface BusinessLayoutProps {
  children: React.ReactNode
}

export function BusinessLayout({ children }: BusinessLayoutProps) {
  return (
    <div className="flex min-h-screen pt-16 md:pt-0">
      <BusinessSidebar />
      <main className="flex-1 md:ml-16">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
