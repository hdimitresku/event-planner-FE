/**
 * Service API Service
 * 
 * This service handles all service-related API calls.
 */

import { Service, ServiceSummary, ServiceCreateData, ServiceType } from '../models/service';
import { apiRequest, buildQueryString } from './apiService';
import * as mockDataService from '../data/mockDataService';
import { VenueType } from '../models/venue';

// Flag to determine if we should use mock data (during development)
const USE_MOCK_DATA = true;

/**
 * Get all services with optional filtering
 */
export const getServices = async (filters?: {
  serviceTypes?: ServiceType[];
  providerId?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  date?: string;
  page?: number;
  limit?: number;
}): Promise<{
  services: ServiceSummary[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.getServices(filters);
    }

    const queryString = buildQueryString(filters);
    const endpoint = `/services${queryString}`;
    return await apiRequest<{
      services: ServiceSummary[];
      total: number;
      page: number;
      limit: number;
    }>(endpoint);
  } catch (error) {
    console.error('Error fetching services:', error);
    return { services: [], total: 0, page: 1, limit: 10 };
  }
};

/**
 * Get service details by ID
 */
export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.getServiceById(id);
    }

    return await apiRequest<Service>(`/services/${id}`);
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }
};

/**
 * Create a new service
 */
export const createService = async (serviceData: ServiceCreateData): Promise<{ success: boolean; serviceId?: string; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.createService(serviceData);
    }

    const response = await apiRequest<{ id: string }>('/services', 'POST', serviceData);
    return { success: true, serviceId: response.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create service' };
  }
};

/**
 * Update an existing service
 */
export const updateService = async (
  id: string,
  serviceData: Partial<Service>
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.updateService(id, serviceData);
    }

    await apiRequest<Service>(`/services/${id}`, 'PUT', serviceData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update service' };
  }
};

/**
 * Delete a service
 */
export const deleteService = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.deleteService(id);
    }

    await apiRequest<void>(`/services/${id}`, 'DELETE');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete service' };
  }
};

/**
 * Upload service images
 */
export const uploadServiceImages = async (
  serviceId: string,
  images: File[]
): Promise<{ success: boolean; imageUrls?: string[]; error?: string }> => {
  try {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    const response = await apiRequest<{ imageUrls: string[] }>(
      `/services/${serviceId}/images`,
      'POST',
      formData,
      undefined,
      true
    );
    
    return { success: true, imageUrls: response.imageUrls };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload service images' };
  }
};

/**
 * Get service availability for a specific date range
 */
export const getServiceAvailability = async (
  serviceId: string,
  startDate: string,
  endDate: string
): Promise<{ availableDates: string[]; error?: string }> => {
  try {
    const queryString = buildQueryString({ startDate, endDate });
    const response = await apiRequest<{ availableDates: string[] }>(
      `/services/${serviceId}/availability${queryString}`
    );
    return { availableDates: response.availableDates };
  } catch (error: any) {
    return { availableDates: [], error: error.message || 'Failed to get service availability' };
  }
};

/**
 * Get services available for a specific venue type
 */
export const getServicesByVenueType = async (
  venueType: VenueType
): Promise<{ 
  serviceTypes: ServiceType[];
}> => {
  try {
    if (USE_MOCK_DATA) {
      // Since we don't have venue type filtering in the mock data service,
      // we'll just get all services and assume they're compatible with this venue type
      const { services } = await mockDataService.getServices();
      
      // Get unique service types
      const serviceTypes = Array.from(
        new Set(services.map((service: ServiceSummary) => service.type))
      );

      return { 
        serviceTypes: serviceTypes as ServiceType[]
      };
    }

    // For real API
    const queryString = buildQueryString({ venueType });
    return await apiRequest<{
      serviceTypes: ServiceType[];
    }>(`/services/venue-type${queryString}`);
  } catch (error) {
    console.error('Error fetching services by venue type:', error);
    return { serviceTypes: [] };
  }
}; 