/**
 * Common models and types used across the application
 */

/**
 * Represents multilingual text content
 */
export interface MultilingualText {
  en: string;
  sq: string;
}

/**
 * Available pricing types for venues and services
 */
export enum PricingType {
  FIXED = "fixed",
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  PER_PERSON = "perPerson"
}

/**
 * Supported languages in the application
 */
export enum Language {
  ENGLISH = "en",
  ALBANIAN = "sq"
}

/**
 * Geolocation coordinates
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

/**
 * Address information
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  location?: {
    lat: number;
    lng: number;
  } | null;
}

/**
 * Price information
 */
export interface Price {
  amount: number;
  currency: string;
  type: PricingType;
}

/**
 * Media item (image, video)
 */
export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  title?: string;
  description?: MultilingualText;
}

/**
 * Base entity with common properties
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Rating information
 */
export interface Rating {
  average: number;
  count: number;
}

/**
 * Review for venues/services
 */
export interface Review extends BaseEntity {
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
}

/**
 * Time range
 */
export interface TimeRange {
  startTime: string; // Format: "HH:MM", 24-hour
  endTime: string;   // Format: "HH:MM", 24-hour
}

/**
 * Day availability
 */
export interface DayAvailability {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

/**
 * Host information
 */
export interface Host {
  name: string;
  image: string;
  responseRate: number;
  responseTime: string;
  joined: string;
}

export enum VenueType {
  BALLROOM = "ballroom",
  GARDEN = "garden",
  BEACH = "beach",
  ROOFTOP = "rooftop",
  RESTAURANT = "restaurant",
  CONFERENCE = "conference",
  WAREHOUSE = "warehouse",
  THEATER = "theater",
  MUSEUM = "museum",
  GALLERY = "gallery",
  OTHER = "other"
}

export enum VenueAmenity {
  WIFI = "wifi",
  PARKING = "parking",
  CATERING = "catering",
  BAR = "bar",
  STAGE = "stage",
  SOUNDSYSTEM = "soundsystem",
  LIGHTING = "lighting",
  AV_EQUIPMENT = "avequipment",
  WHEELCHAIR_ACCESS = "wheelchairaccess",
  OUTDOOR_SPACE = "outdoorspace",
  KITCHEN = "kitchen",
  DRESSING_ROOM = "dressingroom",
  SECURITY = "security",
  CLEANING = "cleaning",
  OTHER = "other"
} 