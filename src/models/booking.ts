import { Venue } from './venue'
import { ServiceOption } from './service'

/**
 * Booking status
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

/**
 * Event type for bookings
 */
export enum EventType {
  PHOTOSHOOT = 'photoshoot',
  BABYSHOWER = 'babyshower',
  BAPTISM = 'baptism',
  GENDER_REVEAL = 'gender_reveal',
  SEASONAL_EVENT = 'seasonal_event',
  CORPORATE = 'corporate',
  WEDDING = 'wedding',
  CONFERENCE = 'conference',
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  OTHER = 'other',
}

/**
 * Selected service option for booking
 */
export interface BookingServiceOption {
  serviceId: string;
  optionId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

/**
 * Cost breakdown for booking
 */
export interface BookingCost {
  venueBasePrice: number;
  venueTotalPrice: number;   // Based on duration
  servicesCost: number;
  subtotal: number;
  serviceFee: number;        // Service fee percentage
  taxAmount: number;         // Tax amount
  discount?: number;         // Any discounts applied
  totalAmount: number;       // Final total
  currency: string;          // Currency code (USD, EUR, etc.)
}

/**
 * Booking model
 */
export interface Booking {
  id: string
  userId: string
  venue: Venue
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  numberOfGuests: number
  totalAmount: number
  serviceFee: number
  serviceFeePercentage: string
  status: string
  specialRequests?: string
  eventType: string
  serviceOptions: ServiceOption[]
  metadata: {
    eventType: string
    contactDetails: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }
    options?: Array<{
      id: string
      serviceId: string
      status: string
      rejectionReason?: string
    }>
  }
  createdAt: string
  updatedAt: string
}

/**
 * Booking creation data
 */
export interface BookingCreateData {
  venueId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  numberOfGuests: number
  serviceOptionIds: string[]
  specialRequests?: string
  metadata?: Record<string, any>
}
