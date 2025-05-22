import type { Address, BaseEntity, DayAvailability, MultilingualText, Price, Rating } from "./common"
import type { User } from "./user"

/**
 * Venue type/category
 */
export enum VenueType {
  BALLROOM = "ballroom",
  GARDEN = "garden",
  ROOFTOP = "rooftop",
  LOFT = "loft",
  HOTEL = "hotel",
  RESTAURANT = "restaurant",
  MEETING_ROOM = "meeting_room",
  WEDDING_VENUE = "wedding_venue",
  OUTDOOR_SPACE = "outdoor_space",
  PHOTOGRAPHY_STUDIO = "photography_studio",
  PARTY_VENUE = "party_venue",
  OTHER = "other",
}

/**
 * Venue amenity
 */
export enum VenueAmenity {
  WIFI = "wifi",
  PARKING = "parking",
  KITCHEN = "kitchen",
  SOUND_SYSTEM = "soundsystem",
  PROJECTOR = "projector",
  CHAIRS = "chairs",
  TABLES = "tables",
  CATERING = "catering",
  BATHROOM = "bathroom",
  AV_EQUIPMENT = "avequipment",
}

/**
 * Venue availability rules
 */
export interface VenueAvailability {
  daysOfWeek: number[] // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string // Format: "HH:MM", 24-hour
  endTime: string // Format: "HH:MM", 24-hour
  exceptions?: {
    // Exceptions to regular availability
    date: string // Format: "YYYY-MM-DD"
    available: boolean
    startTime?: string
    endTime?: string
  }[]
}

/**
 * Venue capacity information
 */
export interface VenueCapacity {
  min: number
  max: number
  recommended: number
}

/**
 * Media item for venue
 */
export interface VenueMedia {
  id: string
  url: string
  type: string
  entityType: string
  entityId: string
  createdAt: string
  updatedAt: string
}

/**
 * Venue review
 */
export interface VenueReview {
  id: string
  rating: number
  comment: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Venue booking
 */
export interface VenueBooking {
  id: string
  venue: any
  userId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  totalAmount: string
  status: string
  specialRequests: string
  numberOfGuests: number
  serviceOptions: any[]
  metadata: any
  createdAt: string
  updatedAt: string
}

/**
 * Venue metadata
 */
export interface VenueMetadata {
  blockedDates?: {
    startDate: string
    endDate: string
    isConfirmed: boolean
  }[]
}

/**
 * Venue model
 */
export interface Venue extends BaseEntity {
  name: MultilingualText
  description: MultilingualText
  type: VenueType
  address: Address
  media: VenueMedia[]
  amenities: VenueAmenity[]
  capacity: VenueCapacity
  size?: number // in square feet/meters
  rating?: Rating
  reviews?: VenueReview[]
  price: Price
  availability?: VenueAvailability
  dayAvailability?: DayAvailability // For display purposes
  owner: User // Owner information
  isActive: boolean // Is this venue active and bookable?
  metadata?: VenueMetadata
  bookings?: VenueBooking[]
  featured?: boolean // Is this venue featured?
}

/**
 * Simplified venue model for listing purposes
 */
export interface VenueSummary {
  id: string
  name: MultilingualText
  location?: MultilingualText
  address: Address
  type: VenueType
  rating?: Rating
  price: Price
  media: VenueMedia[]
  amenities: VenueAmenity[]
  reviews?: VenueReview[]
  dayAvailability?: DayAvailability
  owner: User
}

/**
 * Venue creation data
 */
export interface VenueCreateData {
  name: MultilingualText
  description: MultilingualText
  type: VenueType
  address: Address
  capacity: VenueCapacity
  size?: number
  price: Price
  amenities: VenueAmenity[]
  availability: VenueAvailability
  features?: string[]
  media?: File[] // For upload
}
