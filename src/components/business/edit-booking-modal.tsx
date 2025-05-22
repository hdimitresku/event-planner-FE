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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Check, X } from "lucide-react"

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

  const handleSelectChange = (name: string, value: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("business.bookings.editBooking") || "Edit Booking"}
          </DialogTitle>
          <DialogDescription>
            {t("business.bookings.editBookingDescription") || "Make changes to the booking details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t("business.bookings.date") || "Date"}</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={editedBooking.date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">{t("business.bookings.time") || "Time"}</Label>
              <Input
                type="text"
                id="time"
                name="time"
                value={editedBooking.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">{t("business.bookings.venue") || "Venue"}</Label>
              <Input
                type="text"
                id="venue"
                name="venue"
                value={editedBooking.venue}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">{t("business.bookings.guests") || "Guests"}</Label>
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
            <Label htmlFor="status">{t("business.bookings.status") || "Status"}</Label>
            <Select 
              value={editedBooking.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue>{editedBooking.status}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t("business.bookings.pending") || "Pending"}</SelectItem>
                <SelectItem value="confirmed">{t("business.bookings.confirmed") || "Confirmed"}</SelectItem>
                <SelectItem value="completed">{t("business.bookings.completed") || "Completed"}</SelectItem>
                <SelectItem value="cancelled">{t("business.bookings.cancelled") || "Cancelled"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("business.bookings.notes") || "Notes"}</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              value={editedBooking.notes || ""}
              onChange={handleChange}
            />
          </div>

          <Separator />

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              {t("business.common.cancel") || "Cancel"}
            </Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              {t("business.common.save") || "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
} 