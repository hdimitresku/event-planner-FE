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
  PER_DAY = "per_day",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  PER_PERSON = "per_person",
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
  alt?: string;
  isPrimary?: boolean;
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
  userName: string;
  rating: number;
  comment: string;
  date: string;
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
 * Day availability for hours
 */
export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

/**
 * Operating hours for each day of the week
 */
export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
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

/**
 * Capacity information for venues
 */
export interface Capacity {
  minimum: number;
  maximum: number;
  recommended: number;
}
