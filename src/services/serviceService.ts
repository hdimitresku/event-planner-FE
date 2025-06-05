/**
 * Service API Service
 * 
 * This service handles all service-related API calls.
 */

import { Service, ServiceSummary, ServiceType, ServiceOption } from '../models/service';
import { apiRequest, buildQueryString } from './apiService';
import { VenueType } from '../models/venue';
import mockDataService from "@/services/mockDataService.ts";

// Flag to determine if we should use mock data (during development)
const USE_MOCK_DATA = false;

export const iconMap: Record<ServiceType, string> = {
  [ServiceType.CATERING]: "Utensils",
  [ServiceType.MUSIC]: "Music",
  [ServiceType.DECORATION]: "Palette",
  [ServiceType.PHOTOGRAPHY]: "Camera",
  [ServiceType.VIDEOGRAPHY]: "Video",
  [ServiceType.TRANSPORTATION]: "Car",
  [ServiceType.SECURITY]: "Shield",
  [ServiceType.STAFFING]: "Users",
  [ServiceType.ENTERTAINMENT]: "Drama",
  [ServiceType.OTHER]: "CircleDot",
};



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
export const createService = async (serviceData: FormData): Promise<{ success: boolean; serviceId?: string; error?: string }> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return mockDataService.createService(serviceData);
    // }
    await apiRequest<FormData>('/services', 'POST', serviceData, undefined, true);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create service' };
  }
};

/**
 * Update an existing service
 */
export const updateService = async (
  id: string,
  serviceData: FormData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return mockDataService.updateService(id, serviceData);
    // }
    console.log(serviceData.get('data'))

    await apiRequest<Service>(`/services/${id}`, 'PATCH', serviceData, undefined, true);
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
      // Since we don't have venue type filtering in the mock data service,
      // we'll just get all services and assume they're compatible with this venue type
      // const { services } = await mockDataService.getServices();
      //
      // // Get unique service types
      // const serviceTypes = Array.from(
      //   new Set(services.map((service: ServiceSummary) => service.type))
      // );
      //
      // return {
      //   serviceTypes: serviceTypes as ServiceType[]
      // };

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

export const getServicesByVenue = async (
  venueId: string
): Promise<{ services: Service[] }> => {
  try {
    if (USE_MOCK_DATA) {
      const { services } = await mockDataService.getServices();
      
      // Filter services by venue type (mock venue type for simplicity)
      const mockVenueType = VenueType.BALLROOM; // Adjust based on venueId
      const iconMap: Record<ServiceType, string> = {
        [ServiceType.CATERING]: 'Utensils',
        [ServiceType.MUSIC]: 'Music',
        [ServiceType.DECORATION]: 'Palette',
        [ServiceType.PHOTOGRAPHY]: 'Camera',
        [ServiceType.VIDEOGRAPHY]: 'Video',
        [ServiceType.TRANSPORTATION]: 'Car',
        [ServiceType.SECURITY]: 'Shield',
        [ServiceType.STAFFING]: 'Users',
        [ServiceType.ENTERTAINMENT]: 'Drama',
        [ServiceType.OTHER]: 'CircleDot',
      };

      const mockServices: Service[] = services
        .filter((service: { type: ServiceType; venueTypes: VenueType[] }) =>
          service.venueTypes.includes(mockVenueType)
        )
        .map((service, index) => ({
          id: `mock-service-${index}`,
          name: { en: `${service.type} Service`, sq: `${service.type} Shërbim` },
          venueTypes: service.venueTypes || [mockVenueType],
          type: service.type,
          icon: iconMap[service.type] || 'CircleDot',
          provider: {
            id: `mock-user-${index}`,
            email: `provider${index}@example.com`,
          },
          media: [
            {
              id: `mock-media-${index}`,
              url: 'http://localhost:3000/uploads/mock-photo.jpg',
              type: 'image',
              description: { en: 'Mock Photo', sq: 'Foto Mock' },
              entityType: 'service',
              entityId: `mock-service-${index}`,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

      return { services: mockServices };
    }

    // Real API
    const response = await apiRequest<Service[]>(`/services/venue/${venueId}`);
    return { services: response };
  } catch (error) {
    console.error('Error fetching services by venue:', error);
    return { services: [] };
  }
};

export const getServiceOptionById = async (
  serviceId: string,
  optionId: string
): Promise<{ success: boolean; option: ServiceOption; error?: string }> => {
  try {
    const response = await apiRequest<ServiceOption>(`/services/${serviceId}/options/${optionId}`);
    return { success: true, option: response };
  } catch (error) {
    console.error('Error fetching service option:', error);
    return { success: false, error: error.message || 'Failed to fetch service option' };
  }
};

export const getServiceTypesByVenueType = async (
  venueType: VenueType
): Promise<{ 
  serviceTypes: { type: ServiceType; icon: string }[];
}> => {
  try {
    if (USE_MOCK_DATA) {
      const { services } = await mockDataService.getServices();
      
      // Icon mapping (same as backend)
      const iconMap: Record<ServiceType, string> = {
        [ServiceType.CATERING]: 'Utensils',
        [ServiceType.MUSIC]: 'Music',
        [ServiceType.DECORATION]: 'Palette',
        [ServiceType.PHOTOGRAPHY]: 'Camera',
        [ServiceType.VIDEOGRAPHY]: 'Video',
        [ServiceType.TRANSPORTATION]: 'Car',
        [ServiceType.SECURITY]: 'Shield',
        [ServiceType.STAFFING]: 'Users',
        [ServiceType.ENTERTAINMENT]: 'Drama',
        [ServiceType.OTHER]: 'CircleDot',
      };

      // Get unique service types with icons
      const serviceTypes = Array.from(
        new Set(services.map((service: { type: ServiceType }) => service.type))
      ).map(type => ({
        type,
        icon: iconMap[type as ServiceType] || 'CircleDot',
      }));

      return { serviceTypes };
    }

    // Real API
    return await apiRequest<{
      serviceTypes: { type: ServiceType; icon: string }[];
    }>(`/services/venue/type/${venueType}`);
  } catch (error) {
    console.error('Error fetching services by venue type:', error);
    return { serviceTypes: [] };
  }
};

export const getOwnedServices = async (): Promise<Service[]> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return mockDataService.getOwnedServices();
    // }

    return await apiRequest<Service[]>(`/services/owned`);
  } catch (error) {
    console.error(`Error fetching owned services for current user:`, error);
    return [];
  }
}