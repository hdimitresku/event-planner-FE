/**
 * Mock Data Service
 * 
 * This service provides methods for working with mock data in JSON files.
 * In a real application, these would be API calls to a backend server.
 */

import venuesData from './mock/venues.json';
import servicesData from './mock/services.json';
import bookingsData from './mock/bookings.json';
import usersData from './mock/users.json';

import { Venue, VenueSummary, VenueType, VenueAmenity } from '../models/venue';
import { Service, ServiceSummary, ServiceType } from '../models/service';
import { Booking, BookingCreateData, BookingStatus, PaymentStatus, EventType } from '../models/booking';
import { User, BusinessProfile, AuthData, LoginCredentials, RegisterData, BusinessRegisterData, UserRole } from '../models/user';
import { PricingType } from '../models/common';

// Type guard for checking if a string is a valid venue type
const isVenueType = (value: string): value is VenueType => {
  return Object.values(VenueType).includes(value as VenueType);
};

// Type guard for checking if a string is a valid service type
const isServiceType = (value: string): value is ServiceType => {
  return Object.values(ServiceType).includes(value as ServiceType);
};

// Type guard for checking if a string is a valid booking status
const isBookingStatus = (value: string): value is BookingStatus => {
  return Object.values(BookingStatus).includes(value as BookingStatus);
};

// Type guard for checking if a string is a valid payment status
const isPaymentStatus = (value: string): value is PaymentStatus => {
  return Object.values(PaymentStatus).includes(value as PaymentStatus);
};

// Type guard for pricing type
const isPricingType = (value: string): value is PricingType => {
  return Object.values(PricingType).includes(value as PricingType);
};

// Type guard for user role
const isUserRole = (value: string): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole);
};

// Type guard for verification status
const isVerificationStatus = (value: string): value is "pending" | "verified" | "rejected" => {
  return ["pending", "verified", "rejected"].includes(value);
};

// Convert string type values from JSON to enum values for strict typing
const convertVenue = (venue: any): Venue => {
  // Convert string venue type to enum
  const venueType = isVenueType(venue.type) ? venue.type : VenueType.OTHER;
  
  // Convert string amenities to enum values
  const amenities = venue.amenities
    .filter((amenity: string) => Object.values(VenueAmenity).includes(amenity as VenueAmenity))
    .map((amenity: string) => amenity as VenueAmenity);
  
  // Convert pricing type
  const priceType = isPricingType(venue.price.type) ? venue.price.type : PricingType.FIXED;
  
  return {
    ...venue,
    type: venueType,
    amenities,
    price: {
      ...venue.price,
      type: priceType
    }
  };
};

// Convert string type values from JSON to enum values for strict typing
const convertService = (service: any): Service => {
  // Convert string service type to enum
  const serviceType = isServiceType(service.type) ? service.type : ServiceType.OTHER;
  
  // Convert price types in options
  const options = service.options.map((option: any) => ({
    ...option,
    price: {
      ...option.price,
      type: isPricingType(option.price.type) ? option.price.type : PricingType.FIXED
    }
  }));
  
  return {
    ...service,
    type: serviceType,
    options
  };
};

// Convert string type values from JSON to enum values for strict typing
const convertBooking = (booking: any): Booking => {
  // Convert string booking status to enum
  const status = isBookingStatus(booking.status) ? booking.status : BookingStatus.PENDING;
  
  // Convert string payment status to enum
  const paymentStatus = isPaymentStatus(booking.paymentStatus) ? booking.paymentStatus : PaymentStatus.PENDING;
  
  // Convert string event type to enum
  const eventType = Object.values(EventType).includes(booking.eventType as EventType) 
    ? booking.eventType as EventType 
    : EventType.OTHER;
  
  return {
    ...booking,
    status,
    paymentStatus,
    eventType
  };
};

// Convert string type values from JSON to enum values for strict typing
const convertUser = (user: any): User => {
  // Convert string role to enum
  const role = isUserRole(user.role) ? user.role : UserRole.CUSTOMER;

  return {
    ...user,
    role
  };
};

// Convert string type values from JSON to enum values for strict typing
const convertBusinessProfile = (profile: any): BusinessProfile => {
  // Convert verification status
  const verificationStatus = isVerificationStatus(profile.verificationStatus) 
    ? profile.verificationStatus as "pending" | "verified" | "rejected"
    : "pending";

  return {
    ...profile,
    verificationStatus
  };
};

/**
 * VENUE MOCK DATA FUNCTIONS
 */

// Get all venues with optional filtering
export const getVenues = (filters?: {
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
}): {
  venues: VenueSummary[];
  total: number;
  page: number;
  limit: number;
} => {
  let venues = venuesData.venues.map(venue => ({
    id: venue.id,
    name: venue.name,
    location: venue.location,
    type: isVenueType(venue.type) ? venue.type : VenueType.OTHER,
    rating: venue.rating,
    price: {
      ...venue.price,
      type: isPricingType(venue.price.type) ? venue.price.type : PricingType.FIXED
    },
    mainImage: venue.media[0]?.url || '',
    amenities: venue.amenities
      .filter((amenity: string) => Object.values(VenueAmenity).includes(amenity as VenueAmenity))
      .map((amenity: string) => amenity as VenueAmenity)
  }));

  // Apply filters
  if (filters) {
    if (filters.priceMin !== undefined) {
      venues = venues.filter(venue => venue.price.amount >= filters.priceMin!);
    }
    
    if (filters.priceMax !== undefined) {
      venues = venues.filter(venue => venue.price.amount <= filters.priceMax!);
    }
    
    if (filters.venueTypes && filters.venueTypes.length > 0) {
      venues = venues.filter(venue => filters.venueTypes!.includes(venue.type));
    }
    
    if (filters.priceTypes && filters.priceTypes.length > 0) {
      venues = venues.filter(venue => filters.priceTypes!.includes(venue.price.type));
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      venues = venues.filter(venue => 
        filters.amenities!.every(amenity => venue.amenities.includes(amenity))
      );
    }
    
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      venues = venues.filter(venue => 
        venue.location.en.toLowerCase().includes(locationLower) || 
        venue.location.sq.toLowerCase().includes(locationLower)
      );
    }
    
    if (filters.guests !== undefined) {
      // This would require capacity info, which is in the full venue object
      // For the summary, let's skip this filter
    }
  }

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedVenues = venues.slice(startIndex, endIndex);

  return {
    venues: paginatedVenues,
    total: venues.length,
    page,
    limit
  };
};

// Get venue by ID
export const getVenueById = (id: string): Venue | null => {
  const venue = venuesData.venues.find(venue => venue.id === id);
  return venue ? convertVenue(venue) : null;
};

// Create a new venue
export const createVenue = (venueData: any): { success: boolean; venueId?: string; error?: string } => {
  try {
    // In a real application, this would save to a database
    // For mock data, we can just generate a new ID
    const newId = `venue${Date.now()}`;
    
    return { success: true, venueId: newId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create venue' };
  }
};

// Update an existing venue
export const updateVenue = (
  id: string,
  venueData: Partial<Venue>
): { success: boolean; error?: string } => {
  try {
    // Find the venue first
    const venue = getVenueById(id);
    if (!venue) {
      return { success: false, error: 'Venue not found' };
    }
    
    // In a real application, this would update the database
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update venue' };
  }
};

// Delete a venue
export const deleteVenue = (id: string): { success: boolean; error?: string } => {
  try {
    // Find the venue first
    const venue = getVenueById(id);
    if (!venue) {
      return { success: false, error: 'Venue not found' };
    }
    
    // In a real application, this would delete from the database
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete venue' };
  }
};

/**
 * SERVICE MOCK DATA FUNCTIONS
 */

// Get all services with optional filtering
export const getServices = (filters?: {
  serviceTypes?: ServiceType[];
  providerId?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  date?: string;
  page?: number;
  limit?: number;
}): {
  services: ServiceSummary[];
  total: number;
  page: number;
  limit: number;
} => {
  let services = servicesData.services.map(service => {
    // Find the cheapest option for base price
    const baseOption = [...service.options].sort((a, b) => a.price.amount - b.price.amount)[0];
    
    return {
      id: service.id,
      name: service.name,
      type: isServiceType(service.type) ? service.type : ServiceType.OTHER,
      rating: service.rating,
      mainImage: service.media[0]?.url || '',
      basePrice: {
        ...baseOption.price,
        type: isPricingType(baseOption.price.type) ? baseOption.price.type : PricingType.FIXED
      },
      optionsCount: service.options.length
    };
  });

  // Apply filters
  if (filters) {
    if (filters.serviceTypes && filters.serviceTypes.length > 0) {
      services = services.filter(service => filters.serviceTypes!.includes(service.type));
    }
    
    if (filters.providerId) {
      // For full service objects, we'd check the provider ID
      services = services.filter(service => {
        const fullService = servicesData.services.find(s => s.id === service.id);
        return fullService?.providerId === filters.providerId;
      });
    }
    
    if (filters.priceMin !== undefined) {
      services = services.filter(service => service.basePrice.amount >= filters.priceMin!);
    }
    
    if (filters.priceMax !== undefined) {
      services = services.filter(service => service.basePrice.amount <= filters.priceMax!);
    }
  }

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedServices = services.slice(startIndex, endIndex);

  return {
    services: paginatedServices,
    total: services.length,
    page,
    limit
  };
};

// Get service by ID
export const getServiceById = (id: string): Service | null => {
  const service = servicesData.services.find(service => service.id === id);
  return service ? convertService(service) : null;
};

// Create a new service
export const createService = (serviceData: any): { success: boolean; serviceId?: string; error?: string } => {
  try {
    // In a real application, this would save to a database
    // For mock data, we can just generate a new ID
    const newId = `service${Date.now()}`;
    
    return { success: true, serviceId: newId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create service' };
  }
};

// Update an existing service
export const updateService = (
  id: string,
  serviceData: Partial<Service>
): { success: boolean; error?: string } => {
  try {
    // Find the service first
    const service = getServiceById(id);
    if (!service) {
      return { success: false, error: 'Service not found' };
    }
    
    // In a real application, this would update the database
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update service' };
  }
};

// Delete a service
export const deleteService = (id: string): { success: boolean; error?: string } => {
  try {
    // Find the service first
    const service = getServiceById(id);
    if (!service) {
      return { success: false, error: 'Service not found' };
    }
    
    // In a real application, this would delete from the database
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete service' };
  }
};

/**
 * Get services available for a specific venue type
 */
export const getServicesByVenueType = (venueType: VenueType): {
  serviceTypes: ServiceType[];
} => {
  // In a real application, this would filter services based on whether they're compatible with the venue type
  // For our mock data, we'll assume all service types are compatible and just return the unique types

  const allServices = servicesData.services.map(service => convertService(service));
  
  // Get unique service types
  const serviceTypes = Array.from(
    new Set(allServices.map(service => service.type))
  ) as ServiceType[];
  
  return { serviceTypes };
};

/**
 * BOOKING MOCK DATA FUNCTIONS
 */

// Get all bookings with optional filtering
export const getBookings = (filters?: {
  userId?: string;
  venueId?: string;
  serviceId?: string;
  status?: BookingStatus[];
  paymentStatus?: PaymentStatus[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
} => {
  let bookings = bookingsData.bookings.map(booking => convertBooking(booking));

  // Apply filters
  if (filters) {
    if (filters.userId) {
      bookings = bookings.filter(booking => booking.userId === filters.userId);
    }
    
    if (filters.venueId) {
      bookings = bookings.filter(booking => booking.venueId === filters.venueId);
    }
    
    if (filters.serviceId) {
      bookings = bookings.filter(booking => 
        booking.serviceOptions.some(option => option.serviceId === filters.serviceId)
      );
    }
    
    if (filters.status && filters.status.length > 0) {
      bookings = bookings.filter(booking => filters.status!.includes(booking.status));
    }
    
    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      bookings = bookings.filter(booking => filters.paymentStatus!.includes(booking.paymentStatus));
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      bookings = bookings.filter(booking => new Date(booking.startDateTime) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      bookings = bookings.filter(booking => new Date(booking.endDateTime) <= endDate);
    }
  }

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookings = bookings.slice(startIndex, endIndex);

  return {
    bookings: paginatedBookings,
    total: bookings.length,
    page,
    limit
  };
};

// Get booking by ID
export const getBookingById = (id: string): Booking | null => {
  const booking = bookingsData.bookings.find(booking => booking.id === id);
  return booking ? convertBooking(booking) : null;
};

// Create a new booking
export const createBooking = (bookingData: BookingCreateData): { success: boolean; bookingId?: string; error?: string } => {
  try {
    // In a real application, this would save to a database
    // For mock data, we can just generate a new ID
    const newId = `booking${Date.now()}`;
    
    return { success: true, bookingId: newId };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create booking' };
  }
};

// Update booking status
export const updateBookingStatus = (
  id: string,
  status: BookingStatus
): { success: boolean; error?: string } => {
  try {
    // Find the booking first
    const booking = getBookingById(id);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }
    
    // In a real application, this would update the database
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update booking status' };
  }
};

// Update payment status
export const updatePaymentStatus = (
  id: string,
  paymentStatus: PaymentStatus
): { success: boolean; error?: string } => {
  try {
    // Find the booking first
    const booking = getBookingById(id);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }
    
    // In a real application, this would update the database
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update payment status' };
  }
};

/**
 * USER MOCK DATA FUNCTIONS
 */

// Get user by ID
export const getUserById = (id: string): User | null => {
  const user = usersData.users.find(user => user.id === id);
  return user ? convertUser(user) : null;
};

// Get user by email
export const getUserByEmail = (email: string): User | null => {
  const user = usersData.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  return user ? convertUser(user) : null;
};

// Get business profile by user ID
export const getBusinessProfile = (userId: string): BusinessProfile | null => {
  const profile = usersData.businessProfiles.find(profile => profile.userId === userId);
  return profile ? convertBusinessProfile(profile) : null;
};

// Login with credentials
export const login = (credentials: LoginCredentials): { success: boolean; user?: User; error?: string } => {
  try {
    // In a real application, this would validate against a database
    // For mock data, let's just check if the email exists
    const user = getUserByEmail(credentials.email);
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // In a real application, you would check the password here
    
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

// Register a new user
export const registerUser = (userData: RegisterData): { success: boolean; user?: User; error?: string } => {
  try {
    // Check if a user with this email already exists
    if (getUserByEmail(userData.email)) {
      return { success: false, error: 'A user with this email already exists' };
    }
    
    // In a real application, this would save to a database
    // For mock data, we can just generate a new ID
    const newId = `user${Date.now()}`;
    
    const newUser: User = {
      id: newId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      displayName: `${userData.firstName} ${userData.lastName}`,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { success: true, user: newUser };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
};

// Register a business account
export const registerBusiness = (businessData: BusinessRegisterData): { 
  success: boolean; 
  user?: User; 
  businessProfile?: BusinessProfile; 
  error?: string 
} => {
  try {
    // Check if a user with this email already exists
    if (getUserByEmail(businessData.email)) {
      return { success: false, error: 'A user with this email already exists' };
    }
    
    // In a real application, this would save to a database
    // For mock data, we can just generate new IDs
    const newUserId = `business${Date.now()}`;
    const newProfileId = `bp${Date.now()}`;
    
    const newUser: User = {
      id: newUserId,
      email: businessData.email,
      firstName: businessData.firstName,
      lastName: businessData.lastName,
      displayName: `${businessData.firstName} ${businessData.lastName}`,
      phoneNumber: businessData.phoneNumber,
      role: businessData.role,
      address: businessData.businessAddress,
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newBusinessProfile: BusinessProfile = {
      id: newProfileId,
      userId: newUserId,
      businessName: businessData.businessName,
      businessDescription: businessData.businessDescription,
      contactEmail: businessData.contactEmail,
      contactPhone: businessData.contactPhone,
      businessAddress: businessData.businessAddress,
      businessHours: [
        { dayOfWeek: 0, open: false },
        { dayOfWeek: 1, open: true, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 2, open: true, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 3, open: true, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 4, open: true, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 5, open: true, startTime: "09:00", endTime: "17:00" },
        { dayOfWeek: 6, open: false }
      ],
      verificationStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { 
      success: true, 
      user: newUser, 
      businessProfile: newBusinessProfile 
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Business registration failed' };
  }
}; 