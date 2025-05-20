/**
 * Venue API Service
 * 
 * This service handles all venue-related API calls.
 */

import { apiRequest, buildQueryString } from './apiService';
import { Venue, VenueSummary, VenueCreateData, VenueType, VenueAmenity } from '../models/venue';
import { PricingType } from '../models/common';
import * as mockDataService from '../data/mockDataService';

// Flag to determine if we should use mock data (during development)
const USE_MOCK_DATA = true;

/**
 * Get all venues with optional filtering
 */
export const getVenues = async (filters?: {
  priceMin?: number;
  priceMax?: number;
  venueTypes?: VenueType[];
  priceTypes?: PricingType[];
  amenities?: VenueAmenity[];
  location?: string;
  date?: string;
  guests?: number;
  page?: number;
  limit?: number;
}): Promise<{
  venues: VenueSummary[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return mockDataService.getVenues(filters);
    // }

    const queryString = buildQueryString(filters);
    const endpoint = `/venues${queryString}`;
    return await apiRequest<{
      venues: VenueSummary[];
      total: number;
      page: number;
      limit: number;
    }>(endpoint);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return { venues: [], total: 0, page: 1, limit: 10 };
  }
};

/**
 * Get venue details by ID
 */
export const getVenueById = async (id: string): Promise<Venue | null> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.getVenueById(id);
    }

    return await apiRequest<Venue>(`/venues/${id}`);
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
};

/**
 * Create a new venue
 */
export const createVenue = async (venueData: VenueCreateData): Promise<{ success: boolean; venueId?: string; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.createVenue(venueData);
    }

    const response = await apiRequest<{ id: string }>('/venues', 'POST', venueData);
    return { success: true, venueId: response.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create venue' };
  }
};

/**
 * Update an existing venue
 */
export const updateVenue = async (
  id: string,
  venueData: Partial<Venue>
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.updateVenue(id, venueData);
    }

    await apiRequest<Venue>(`/venues/${id}`, 'PUT', venueData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update venue' };
  }
};

/**
 * Delete a venue
 */
export const deleteVenue = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.deleteVenue(id);
    }

    await apiRequest<void>(`/venues/${id}`, 'DELETE');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete venue' };
  }
};

/**
 * Upload venue images
 */
export const uploadVenueImages = async (
  venueId: string,
  images: File[]
): Promise<{ success: boolean; imageUrls?: string[]; error?: string }> => {
  try {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    const response = await apiRequest<{ imageUrls: string[] }>(
      `/venues/${venueId}/images`,
      'POST',
      formData,
      undefined,
      true
    );
    
    return { success: true, imageUrls: response.imageUrls };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload venue images' };
  }
};

/**
 * Get venue availability for a specific date range
 */
export const getVenueAvailability = async (
  venueId: string,
  startDate: string,
  endDate: string
): Promise<{ availableDates: string[]; error?: string }> => {
  try {
    const queryString = buildQueryString({ startDate, endDate });
    const response = await apiRequest<{ availableDates: string[] }>(
      `/venues/${venueId}/availability${queryString}`
    );
    return { availableDates: response.availableDates };
  } catch (error: any) {
    return { availableDates: [], error: error.message || 'Failed to get venue availability' };
  }
}; 