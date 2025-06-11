"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useLanguage } from "../../context/language-context"
import { useCurrency } from "../../context/currency-context"
import * as venueService from "../../services/venueService"
import { Info } from "lucide-react"

interface EditBookingModalProps {
  booking: any
  isOpen: boolean
  onClose: () => void
  onSave: (booking: any) => void
}

export function EditBookingModal({ booking, isOpen, onClose, onSave }: EditBookingModalProps) {
  const { t, language } = useLanguage()
  const { formatPrice } = useCurrency()
  const [venues, setVenues] = useState<any[]>([])
  const [formData, setFormData] = useState({
    venueId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    numberOfGuests: 0,
    eventType: "",
    specialRequests: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  })
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedVenue, setSelectedVenue] = useState<any>(null)

  // Fetch venues when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchVenues = async () => {
        try {
          const venueDetails = await venueService.getVenueByOwner()
          setVenues(venueDetails)
        } catch (error) {
          console.error("Error fetching venues:", error)
        }
      }
      fetchVenues()
    }
  }, [isOpen])

  // Update selected venue when venueId changes
  useEffect(() => {
    if (formData.venueId) {
      const venue = venues.find(v => v.id === formData.venueId)
      setSelectedVenue(venue)
    }
  }, [formData.venueId, venues])

  // Populate form with booking data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        venueId: booking.venueId || "",
        startDate: booking.startDate || "",
        endDate: booking.endDate || "",
        startTime: booking.startTime || "",
        endTime: booking.endTime || "",
        numberOfGuests: booking.numberOfGuests || 0,
        eventType: booking.eventType || "",
        specialRequests: booking.specialRequests || "",
        customerName: booking.customer?.name || "",
        customerEmail: booking.customer?.email || "",
        customerPhone: booking.customer?.phone || "",
      })

      if (booking.startDate) {
        setStartDate(new Date(booking.startDate))
      }
      if (booking.endDate) {
        setEndDate(new Date(booking.endDate))
      }
    }
  }, [booking])

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedVenue) return null

    let basePrice = selectedVenue.price.amount
    if (selectedVenue.price.type === "perPerson") {
      basePrice = basePrice * formData.numberOfGuests
    }

    const serviceFee = basePrice * 0.1
    const total = basePrice + serviceFee

    return {
      basePrice: formatPrice(basePrice, selectedVenue.price.currency),
      serviceFee: formatPrice(serviceFee, selectedVenue.price.currency),
      total: formatPrice(total, selectedVenue.price.currency)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    if (date) {
      handleInputChange("startDate", format(date, "yyyy-MM-dd"))
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
    if (date) {
      handleInputChange("endDate", format(date, "yyyy-MM-dd"))
    }
  }

  const handleSave = () => {
    const updatedBooking = {
      ...booking,
      ...formData,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
    }
    onSave(updatedBooking)
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`
        const displayTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push({ value: timeString, label: displayTime })
      }
    }
    return times
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("business.bookings.editBooking") || "Edit Booking"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Venue Selection */}
          <div className="grid gap-2">
            <Label htmlFor="venue">{t("business.bookings.venue") || "Venue"}</Label>
            <Select value={formData.venueId} onValueChange={(value) => handleInputChange("venueId", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("business.bookings.selectVenue") || "Select a venue"} />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{venue.name[language] || venue.name.en}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {formatPrice(venue.price.amount, venue.price.currency)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("business.bookings.startDate") || "Start Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : t("business.bookings.pickDate") || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>{t("business.bookings.endDate") || "End Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : t("business.bookings.pickDate") || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={handleEndDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("business.bookings.startTime") || "Start Time"}</Label>
              <Select value={formData.startTime} onValueChange={(value) => handleInputChange("startTime", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("business.bookings.selectTime") || "Select time"} />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>{t("business.bookings.endTime") || "End Time"}</Label>
              <Select value={formData.endTime} onValueChange={(value) => handleInputChange("endTime", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("business.bookings.selectTime") || "Select time"} />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Count and Event Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="guests">{t("business.bookings.numberOfGuests") || "Number of Guests"}</Label>
              <Input
                id="guests"
                type="number"
                value={formData.numberOfGuests}
                onChange={(e) => handleInputChange("numberOfGuests", Number.parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="eventType">{t("business.bookings.eventType") || "Event Type"}</Label>
              <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("business.bookings.selectEventType") || "Select event type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="birthday">Birthday Party</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">
              {t("business.bookings.customerInformation") || "Customer Information"}
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="customerName">{t("business.bookings.customerName") || "Customer Name"}</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customerEmail">{t("business.bookings.customerEmail") || "Email"}</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customerPhone">{t("business.bookings.customerPhone") || "Phone"}</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="grid gap-2">
            <Label htmlFor="specialRequests">{t("business.bookings.specialRequests") || "Special Requests"}</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              placeholder={t("business.bookings.specialRequestsPlaceholder") || "Any special requirements or notes..."}
              rows={3}
            />
          </div>

          {/* Price Summary */}
          {selectedVenue && (
            <div className="border-t pt-4 mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm">{t("business.bookings.venueRental") || "Venue Rental"}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({selectedVenue.price.type === "perPerson" ? t("business.bookings.perPerson") : t("business.bookings.fixed")})
                  </span>
                </div>
                <span className="text-sm font-medium">{calculateTotal()?.basePrice}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm">{t("business.bookings.serviceFee") || "Service Fee"}</span>
                  <div className="relative ml-1 group">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                      {t("business.bookings.serviceFeeInfo") || "10% service fee applied to the total amount"}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium">{calculateTotal()?.serviceFee}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-semibold">{t("business.bookings.total") || "Total"}</span>
                <span className="font-semibold text-lg">{calculateTotal()?.total}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("business.common.cancel") || "Cancel"}
          </Button>
          <Button onClick={handleSave}>{t("business.common.save") || "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}