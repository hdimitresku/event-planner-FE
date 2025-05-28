"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../../context/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Check, X } from "lucide-react"
import { Booking } from "../../models/booking"

interface EditBookingModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onSave: (updatedBooking: Booking) => void
}

export function EditBookingModal({ booking, isOpen, onClose, onSave }: EditBookingModalProps) {
  const { t } = useLanguage()
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null)
  
  useEffect(() => {
    if (booking) {
      setEditedBooking({ ...booking })
    }
  }, [booking])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editedBooking) {
      setEditedBooking({ ...editedBooking, [name]: value })
    }
  }

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    if (editedBooking) {
      setEditedBooking({ ...editedBooking, numberOfGuests: value })
    }
  }

  const handleSave = () => {
    if (editedBooking) {
      onSave(editedBooking)
      onClose()
    }
  }

  if (!editedBooking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("dashboard.editBooking") || "Edit Booking"}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.editBookingDescription") || "Make changes to your booking details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t("dashboard.startDate") || "Start Date"}</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={editedBooking.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t("dashboard.endDate") || "End Date"}</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={editedBooking.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t("dashboard.startTime") || "Start Time"}</Label>
              <Input
                type="time"
                id="startTime"
                name="startTime"
                value={editedBooking.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">{t("dashboard.endTime") || "End Time"}</Label>
              <Input
                type="time"
                id="endTime"
                name="endTime"
                value={editedBooking.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfGuests">{t("dashboard.guests") || "Number of Guests"}</Label>
            <Input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={editedBooking.numberOfGuests}
              min={editedBooking.venue.capacity.min}
              max={editedBooking.venue.capacity.max}
              onChange={handleGuestsChange}
            />
            <p className="text-xs text-muted-foreground">
              {t("dashboard.guestCapacity", {
                min: editedBooking.venue.capacity.min,
                max: editedBooking.venue.capacity.max
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">{t("dashboard.specialRequests") || "Special Requests"}</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              value={editedBooking.specialRequests || ""}
              onChange={handleChange}
            />
          </div>

          <Separator />

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              {t("common.save") || "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
} 