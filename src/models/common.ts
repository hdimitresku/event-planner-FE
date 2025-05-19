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
  HOURLY = "hourly",
  PER_PERSON = "perPerson",
  FIXED = "fixed",
  PER_DAY = "perDay",
  CUSTOM = "custom"
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
  zipCode: string;
  country: string;
  location?: GeoLocation;
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
  [key: string]: string; // day of week -> time range string (e.g., "9:00 AM - 10:00 PM")
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