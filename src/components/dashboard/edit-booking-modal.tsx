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
import { BookingStatus } from "../../models/booking"

interface EditBookingModalProps {
  booking: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedBooking: any) => void
}

export function EditBookingModal({ booking, isOpen, onClose, onSave }: EditBookingModalProps) {
  const { t } = useLanguage()
  const [editedBooking, setEditedBooking] = useState<any>(null)
  
  useEffect(() => {
    if (booking) {
      setEditedBooking({ ...booking })
    }
  }, [booking])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedBooking({ ...editedBooking, [name]: value })
  }

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setEditedBooking({ ...editedBooking, guests: value })
  }

  const handleSave = () => {
    onSave(editedBooking)
    onClose()
  }

  if (!editedBooking) return null

  // Format dates for input field
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

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
              <Label htmlFor="startDateTime">{t("dashboard.date") || "Date"}</Label>
              <Input
                type="date"
                id="startDateTime"
                name="startDateTime"
                value={formatDateForInput(editedBooking.startDateTime)}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">{t("dashboard.guests") || "Guests"}</Label>
              <Input
                type="number"
                id="guests"
                name="guests"
                value={editedBooking.guests}
                min={1}
                onChange={handleGuestsChange}
              />
            </div>
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