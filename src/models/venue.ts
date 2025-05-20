import { Address, BaseEntity, DayAvailability, Host, MediaItem, MultilingualText, Price, Rating, Review } from './common';

/**
 * Venue type/category
 */
export enum VenueType {
  BALLROOM = 'ballroom',
  GARDEN = 'garden',
  ROOFTOP = 'rooftop',
  LOFT = 'loft',
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  MEETING_ROOM = 'meetingRoom',
  WEDDING_VENUE = 'weddingVenue',
  OUTDOOR_SPACE = 'outdoorSpace',
  PHOTOGRAPHY_STUDIO = 'photographyStudio',
  PARTY_VENUE = 'partyVenue',
  OTHER = 'other'
}

/**
 * Venue amenity
 */
export enum VenueAmenity {
  WIFI = 'wifi',
  PARKING = 'parking',
  KITCHEN = 'kitchen',
  SOUND_SYSTEM = 'soundsystem',
  PROJECTOR = 'projector',
  CHAIRS = 'chairs',
  TABLES = 'tables',
  CATERING = 'catering',
  BATHROOM = 'bathroom',
  AV_EQUIPMENT = 'avequipment'
}

/**
 * Venue availability rules
 */
export interface VenueAvailability {
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string;    // Format: "HH:MM", 24-hour
  endTime: string;      // Format: "HH:MM", 24-hour
  exceptions?: {        // Exceptions to regular availability
    date: string;       // Format: "YYYY-MM-DD"
    available: boolean;
    startTime?: string;
    endTime?: string;
  }[];
}

/**
 * Venue capacity information
 */
export interface VenueCapacity {
  min: number;
  max: number;
  recommended: number;
}

/**
 * Venue model
 */
export interface Venue extends BaseEntity {
  name: MultilingualText;
  description: MultilingualText;
  type: VenueType;
  address: Address;
  media: MediaItem[];
  amenities: VenueAmenity[];
  capacity: VenueCapacity;
  size?: number;        // in square feet/meters
  rating?: Rating;
  reviews?: Review[];
  price: Price;
  availability: VenueAvailability;
  dayAvailability?: DayAvailability; // For display purposes
  ownerId: string;      // Business/owner ID
  featured?: boolean;   // Is this venue featured?
  active: boolean;      // Is this venue active and bookable?
  host?: Host;          // Host/owner information
  features?: string[];  // Special features of the venue
  location?: MultilingualText; // Location name for display (e.g. "SoHo, New York")
}

/**
 * Simplified venue model for listing purposes
 */
export interface VenueSummary {
  id: string;
  name: MultilingualText;
  address: Address;
  type: VenueType;
  rating: Rating;
  price: Price;
  mainImage: string;
  amenities: VenueAmenity[];
}

/**
 * Venue creation data
 */
export interface VenueCreateData {
  name: MultilingualText;
  description: MultilingualText;
  type: VenueType;
  address: Address;
  capacity: VenueCapacity;
  size?: number;
  price: Price;
  amenities: VenueAmenity[];
  availability: VenueAvailability;
  features?: string[];
  media?: File[];       // For upload
} 