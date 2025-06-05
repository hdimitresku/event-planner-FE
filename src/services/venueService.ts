/**
 * Venue API Service
 *
 * This service handles all venue-related API calls.
 */

import { apiRequest, buildQueryString, USE_MOCK_DATA } from './apiService';
import { Venue, VenueSummary, VenueCreateData, VenueType, VenueAmenity } from '../models/venue';
import { PricingType } from '../models/common';
import { MockDataService } from './mockDataService';

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
}): Promise<VenueSummary[]> => {
  try {
    if (USE_MOCK_DATA) {
      return await MockDataService.getVenues(filters);
    }

    const queryString = buildQueryString(filters);
    const endpoint = `/venues${queryString}`;
    return await apiRequest<VenueSummary[]>(endpoint);
  } catch (error) {
    console.error('Error fetching venues:', error);
    // Fallback to mock data if API fails
    return await MockDataService.getVenues(filters);
  }
};

/**
 * Get venue details by ID
 */
export const getVenueById = async (id: string): Promise<VenueSummary | null> => {
  try {
    if (USE_MOCK_DATA) {
      return await MockDataService.getVenueById(id);
    }

    return await apiRequest<VenueSummary>(`/venues/${id}`);
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    // Fallback to mock data if API fails
    return await MockDataService.getVenueById(id);
  }
};

export const getVenueByOwner = async (): Promise<Venue[]> => {
  try {
    if (USE_MOCK_DATA) {
      // Return empty array for mock data since we don't have owner functionality in demo
      return [];
    }

    return await apiRequest<Venue[]>(`/venues/owned`);
  } catch (error) {
    console.error(`Error fetching owned venues:`, error);
    return [];
  }
};

/**
 * Create a new venue
 */
export const createVenue = async (venueData: FormData): Promise<{ success: boolean; venueId?: string; error?: string }> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return await MockDataService.createVenue(venueData);
    // }

    const response = await apiRequest<{ id: string }>('/venues', 'POST', venueData, undefined, true);
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
  venueData: FormData
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return await MockDataService.updateVenue(id, venueData);
    }

    await apiRequest<Venue>(`/venues/${id}`, 'PATCH', venueData, undefined, true);
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
      return await MockDataService.deleteVenue(id);
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

export const getSimilarVenues = async (
  venueId: string,
  criteria: string[] = ['type'],
  limit: number = 3,
): Promise<{ venues: Venue[] }> => {
  try {
    if (USE_MOCK_DATA) {
      const venues = await MockDataService.getVenues();
      const currentVenue = venues.find(v => v.id === venueId);
      if (!currentVenue) throw new Error('Venue not found');

      let filteredVenues = venues.filter(v => v.id !== venueId);

      const similarVenues = filteredVenues.map((venue: VenueSummary, index: number) => {
        const matchCriteria = {
          venueType: criteria.includes('type') && venue.type === currentVenue.type,
          location:
            criteria.includes('location') && venue.address?.city === currentVenue.address?.city,
          capacity:
            criteria.includes('capacity') &&
            venue.capacity?.recommended &&
            currentVenue.capacity?.recommended &&
            venue.capacity.recommended >= Math.floor(currentVenue.capacity.recommended * 0.8) &&
            venue.capacity.recommended <= Math.ceil(currentVenue.capacity.recommended * 1.2),
          services: criteria.includes('services') && venue.type === currentVenue.type, // Simplified
          price:
            criteria.includes('price') &&
            venue.price?.amount &&
            currentVenue.price?.amount &&
            venue.price.currency === currentVenue.price.currency &&
            venue.price.type === currentVenue.price.type &&
            venue.price.amount >= Math.floor(currentVenue.price.amount * 0.8) &&
            venue.price.amount <= Math.ceil(currentVenue.price.amount * 1.2),
          amenities:
            criteria.includes('amenities') &&
            venue.amenities?.some((a: string) => currentVenue.amenities?.includes(a)),
        };

        const similarityScore = Object.values(matchCriteria).filter(Boolean).length;

        return {
          ...venue,
          id: `similar${index + 1}`,
          name: {
            en: `Similar Venue ${index + 1}`,
            sq: `Ambient i Ngjashëm ${index + 1}`,
          },
          price: {
            ...venue.price,
            amount: currentVenue.price.amount + (index === 0 ? -20 : index === 1 ? 10 : 30),
          },
          matchCriteria,
          similarityScore,
        };
      });

      return {
        venues: similarVenues
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, limit) as Venue[],
      };
    }

    const criteriaParam = criteria.join(',');
    const test = await apiRequest<{ venues: Venue[] }>(
      `/venues/${venueId}/similar?criteria=${criteriaParam}&limit=${limit}`
    );
    console.log(test)
    return test;
  } catch (error) {
    console.error('Error fetching similar venues:', error);
    return { venues: [] };
  }
};
