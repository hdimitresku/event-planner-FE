import { BaseEntity } from "./common";

/**
 * Booking status
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
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
  WEDDING = 'wedding',
  CORPORATE_EVENT = 'corporate_event',
  BIRTHDAY_PARTY = 'birthday_party',
  CONFERENCE = 'conference',
  PHOTO_SHOOT = 'photo_shoot',
  PRIVATE_PARTY = 'private_party',
  OTHER = 'other'
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
export interface Booking extends BaseEntity {
  venueId: string;
  userId: string;
  startDateTime: string;     // ISO date string
  endDateTime: string;       // ISO date string
  duration: number;          // In hours
  eventType: EventType;
  guestCount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  serviceOptions: BookingServiceOption[];
  costs: BookingCost;
  confirmationCode?: string;
  cancellationReason?: string;
}

/**
 * Booking creation data
 */
export interface BookingCreateData {
  venueId: string;
  startDateTime: string;
  endDateTime: string;
  eventType: EventType;
  guestCount: number;
  specialRequests?: string;
  serviceOptions: Omit<BookingServiceOption, 'totalPrice'>[];
} 