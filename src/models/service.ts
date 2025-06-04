import { BaseEntity, MediaItem, MultilingualText, Price, Rating, Review } from './common';

/**
 * Service type/category
 */
export enum ServiceType {
  CATERING = 'catering',
  MUSIC = 'music',
  DECORATION = 'decoration',
  PHOTOGRAPHY = 'photography',
  VIDEOGRAPHY = 'videography',
  TRANSPORTATION = 'transportation',
  SECURITY = 'security',
  STAFFING = 'staffing',
  ENTERTAINMENT = 'entertainment',
  LIGHTING = 'lighting',
  OTHER = 'other'
}

/**
 * Service option model
 */
export interface ServiceOption {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  price: Price;
  availableQuantity?: number;
  popular?: boolean;
  sortOrder?: number;
}

/**
 * Simple option info for display
 */
export interface OptionInfo {
  optionName: string;
  optionJsonKey: string;
}

/**
 * Price info for display
 */
export interface PriceInfo {
  amount: number;
  currency: string;
}

/**
 * Service data for display
 */
export interface ServiceDisplayData {
  options: OptionInfo[];
  prices: Record<string, PriceInfo>;
  icon: React.ElementType;
}

/**
 * Service model
 */
export interface Service extends BaseEntity {
  name: MultilingualText;
  description: MultilingualText;
  type: ServiceType;
  media: MediaItem[];
  options: ServiceOption[];
  rating?: Rating;
  reviews?: Review[];
  featured?: boolean;
  isActive: boolean;
  providerId: string;  // Business/provider ID
  availableForVenueTypes?: string[]; // Venue types this service is available for
}

/**
 * Simplified service model for listing purposes
 */
export interface ServiceSummary {
  id: string;
  name: MultilingualText;
  type: ServiceType;
  rating: Rating;
  mainImage: string;
  basePrice: Price;    // Lowest price option
  optionsCount: number;
}

/**
 * Service creation data
 */
export interface ServiceCreateData {
  name: MultilingualText;
  description: MultilingualText;
  type: ServiceType;
  options: Omit<ServiceOption, 'id'>[];
  availableForVenueTypes?: string[];
  media?: File[];       // For upload
} 