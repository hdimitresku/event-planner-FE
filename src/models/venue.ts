import type { Address, BaseEntity, MultilingualText, Price, Rating, Review, MediaItem, OperatingHours, Capacity } from "./common"

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
  MEETING_ROOM = "meetingRoom",
  WEDDING_VENUE = "weddingVenue",
  OUTDOOR_SPACE = "outdoorSpace",
  PHOTOGRAPHY_STUDIO = "photographyStudio",
  PARTY_VENUE = "partyVenue",
  OTHER = "other",
}

/**
 * Venue amenity
 */
export enum VenueAmenity {
  WIFI = "wifi",
  PARKING = "parking",
  KITCHEN = "kitchen",
  SOUND_SYSTEM = "sound_system",
  PROJECTOR = "projector",
  CHAIRS = "chairs",
  TABLES = "tables",
  CATERING = "catering",
  BATHROOM = "bathroom",
  AV_EQUIPMENT = "av_equipment",
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
  media: MediaItem[]
  amenities: VenueAmenity[]
  capacity: Capacity
  size?: number // in square feet/meters
  rating?: Rating
  reviews?: Review[]
  price: Price
  availability?: VenueAvailability
  operatingHours?: OperatingHours
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
  address: Address
  type: VenueType
  price: Price
  media: MediaItem[]
  amenities: VenueAmenity[]
  capacity: Capacity
  reviews?: Review[]
  operatingHours?: OperatingHours
}

/**
 * Venue creation data
 */
export interface VenueCreateData {
  name: MultilingualText
  description: MultilingualText
  type: VenueType
  address: Address
  capacity: Capacity
  size?: number
  price: Price
  amenities: VenueAmenity[]
  availability: VenueAvailability
  features?: string[]
  media?: File[] // For upload
}
