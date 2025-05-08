"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Plus, Search } from "lucide-react"
import { VenueNewModal } from "./venue-new"
import { useState } from "react"

export default function BusinessVenuesPage() {
  const { t } = useLanguage()
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false)

  // Mock data
  const venues = [
    {
      id: "1",
      name: "Grand Ballroom",
      location: "123 Main St, New York, NY",
      capacity: 300,
      pricePerHour: 500,
      image: "/placeholder.svg?height=100&width=200",
      status: "active",
    },
    {
      id: "2",
      name: "Garden Terrace",
      location: "456 Park Ave, New York, NY",
      capacity: 150,
      pricePerHour: 300,
      image: "/placeholder.svg?height=100&width=200",
      status: "active",
    },
    {
      id: "3",
      name: "Skyline Loft",
      location: "789 Broadway, New York, NY",
      capacity: 200,
      pricePerHour: 400,
      image: "/placeholder.svg?height=100&width=200",
      status: "inactive",
    },
  ]

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("business.venues.title") || "My Venues"}</h1>
          <p className="text-gray-500">{t("business.venues.subtitle") || "Manage your venues and availability"}</p>
        </div>
        <Button 
          size="sm" 
          className="bg-accent hover:bg-accent/90 text-white"
          onClick={() => setIsAddVenueModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("business.venues.addVenue") || "Add Venue"}
        </Button>
      </div>

      {/* Venue New Modal */}
      <VenueNewModal 
        isOpen={isAddVenueModalOpen} 
        onClose={() => setIsAddVenueModalOpen(false)} 
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder={t("business.venues.searchVenues") || "Search venues..."} className="pl-8" />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="all">{t("business.venues.allVenues") || "All Venues"}</option>
          <option value="active">{t("business.venues.activeVenues") || "Active Venues"}</option>
          <option value="inactive">{t("business.venues.inactiveVenues") || "Inactive Venues"}</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold">{venue.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    venue.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {venue.status === "active"
                    ? t("business.venues.active") || "Active"
                    : t("business.venues.inactive") || "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500">{venue.location}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>
                  {t("business.venues.capacity") || "Capacity"}: {venue.capacity}
                </span>
                <span className="font-medium">
                  ${venue.pricePerHour}/{t("business.venues.hour") || "hr"}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link to={`/business/venues/${venue.id}`}>{t("business.venues.edit") || "Edit"}</Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  {t("business.venues.availability") || "Availability"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BusinessLayout>
  )
}
