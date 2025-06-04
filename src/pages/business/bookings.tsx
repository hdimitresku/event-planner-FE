"use client"

import { useState, useEffect } from "react"
import bookingService  from "../../services/bookingService"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "../../components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Booking {
  id: string
  venueId: string
  userId: string
  start: string
  end: string
  status: "PENDING" | "APPROVED" | "DECLINED"
  createdAt: string
  updatedAt: string
}

const VenueBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const data = await bookingService.getBookings()
      setBookings(data)
      setError(null)
    } catch (error: any) {
      setError(error.message || "Failed to fetch bookings.")
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleApprove = async (bookingId: string) => {
    setIsUpdating(bookingId)
    try {
      const result = await bookingService.updateBookingStatus(bookingId, "APPROVED")
      if (result.success) {
        toast({
          title: "Success",
          description: "Booking approved successfully",
        })
        fetchBookings() // Refresh the bookings list
      } else {
        throw new Error(result.error || "Failed to approve booking")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDecline = async (bookingId: string) => {
    setIsUpdating(bookingId)
    try {
      const result = await bookingService.updateBookingStatus(bookingId, "DECLINED")
      if (result.success) {
        toast({
          title: "Success",
          description: "Booking declined successfully",
        })
        fetchBookings() // Refresh the bookings list
      } else {
        throw new Error(result.error || "Failed to decline booking")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to decline booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  if (isLoading) {
    return <div>Loading bookings...</div>
  }

  if (error) {
    return (
        <div>
          Error: {error}
          <Button onClick={fetchBookings}>Retry</Button>
        </div>
    )
  }

  return (
      <div>
        <h1>Venue Bookings</h1>
        <Table>
          <TableCaption>A list of your recent venue bookings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Booking ID</TableHead>
              <TableHead>Venue ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.venueId}</TableCell>
                  <TableCell>{booking.userId}</TableCell>
                  <TableCell>{booking.start}</TableCell>
                  <TableCell>{booking.end}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(booking.id)}
                        disabled={isUpdating === booking.id}
                    >
                      {isUpdating === booking.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                      ) : (
                          "Approve"
                      )}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDecline(booking.id)}
                        disabled={isUpdating === booking.id}
                    >
                      {isUpdating === booking.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Declining...
                          </>
                      ) : (
                          "Decline"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}

export default VenueBookings
