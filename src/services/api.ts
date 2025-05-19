/**
 * API Service
 * 
 * This service is responsible for all API calls.
 * Currently using mock data, but will be replaced with actual API calls.
 */

import {
  Venue, VenueSummary, Service, ServiceSummary,
  VenueType, VenueAmenity, PricingType, ServiceType,
  Booking, BookingCreateData, BookingStatus, EventType, PaymentStatus,
  User, BusinessProfile, LoginCredentials, RegisterData, BusinessRegisterData,
  UserRole
} from '../models';

// Base API config
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.eventspace.com/v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
const API_TIMEOUT = 10000; // 10 seconds

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Authentication token handling
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

// Helper for making API requests
const request = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  additionalHeaders?: Record<string, string>
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...defaultHeaders,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...additionalHeaders,
  };

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    // Add timeout for requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    options.signal = controller.signal;

    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const result = await response.json();
    return result as T;
  } catch (error) {
    // For now, let's return mock data for development
    return getMockData<T>(endpoint, method, data);
  }
};

// Temporary function to get mock data while API is not implemented
const getMockData = <T>(endpoint: string, method: string, data?: any): T => {
  // Mock data for different endpoints
  const mockData: Record<string, any> = {
    '/venues': mockVenues,
    '/venues/1': mockVenueDetail,
    '/services': mockServices,
    '/auth/login': { user: mockUser, accessToken: 'mock-token', refreshToken: 'mock-refresh-token', expiresAt: Date.now() + 3600000 },
  };

  const endpointKey = Object.keys(mockData).find(key => endpoint.startsWith(key)) || '';
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[endpointKey] as T);
    }, 500);
  });
};

/**
 * VENUE API FUNCTIONS
 */

/**
 * Get all venues with optional filtering
 */
export const getVenues = async (filters?: {
  priceMax?: number;
  venueTypes?: VenueType[];
  priceTypes?: PricingType[];
  amenities?: VenueAmenity[];
  location?: string;
  date?: string;
  guests?: number;
}): Promise<VenueSummary[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.priceMax) queryParams.append('priceMax', filters.priceMax.toString());
      if (filters.venueTypes?.length) queryParams.append('types', filters.venueTypes.join(','));
      if (filters.priceTypes?.length) queryParams.append('priceTypes', filters.priceTypes.join(','));
      if (filters.amenities?.length) queryParams.append('amenities', filters.amenities.join(','));
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.guests) queryParams.append('guests', filters.guests.toString());
    }
    
    const endpoint = `/venues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request<VenueSummary[]>(endpoint);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
};

/**
 * Get venue details by ID
 */
export const getVenueById = async (id: string): Promise<Venue | null> => {
  try {
    return await request<Venue>(`/venues/${id}`);
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
};

/**
 * Create a new venue
 */
export const createVenue = async (venueData: FormData): Promise<{ success: boolean; venueId?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'POST',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: venueData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to create venue' };
    }

    const result = await response.json();
    return { success: true, venueId: result.id };
  } catch (error) {
    // Mock response for development
    return { success: true, venueId: 'new-venue-' + Date.now() };
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
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'PUT',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: venueData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to update venue' };
    }

    return { success: true };
  } catch (error) {
    // Mock response for development
    return { success: true };
  }
};

/**
 * SERVICE API FUNCTIONS
 */

/**
 * Get all services with optional filtering
 */
export const getServices = async (filters?: {
  venueId?: string;
  serviceTypes?: ServiceType[];
}): Promise<ServiceSummary[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.venueId) queryParams.append('venueId', filters.venueId);
      if (filters.serviceTypes?.length) queryParams.append('types', filters.serviceTypes.join(','));
    }
    
    const endpoint = `/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request<ServiceSummary[]>(endpoint);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

/**
 * Get service details by ID
 */
export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    return await request<Service>(`/services/${id}`);
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
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: serviceData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to create service' };
    }

    const result = await response.json();
    return { success: true, serviceId: result.id };
  } catch (error) {
    // Mock response for development
    return { success: true, serviceId: 'new-service-' + Date.now() };
  }
};

/**
 * BOOKING API FUNCTIONS
 */

/**
 * Get bookings with optional filtering
 */
export const getBookings = async (filters?: {
  userId?: string;
  venueId?: string;
  status?: BookingStatus[];
  startDate?: string;
  endDate?: string;
}): Promise<Booking[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.venueId) queryParams.append('venueId', filters.venueId);
      if (filters.status?.length) queryParams.append('status', filters.status.join(','));
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
    }
    
    const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await request<Booking[]>(endpoint);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

/**
 * Get booking details by ID
 */
export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    return await request<Booking>(`/bookings/${id}`);
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    return null;
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: BookingCreateData): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
  try {
    const response = await request<{ id: string }>('/bookings', 'POST', bookingData);
    return { success: true, bookingId: response.id };
  } catch (error) {
    // Mock response for development
    return { success: true, bookingId: 'new-booking-' + Date.now() };
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> => {
  try {
    await request(`/bookings/${id}/status`, 'PUT', { status });
    return { success: true };
  } catch (error) {
    console.error(`Error updating booking ${id} status:`, error);
    return { success: false, error: 'Failed to update booking status' };
  }
};

/**
 * USER & AUTH API FUNCTIONS
 */

/**
 * Login with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await request<{ user: User; accessToken: string; refreshToken: string; expiresAt: number }>('/auth/login', 'POST', credentials);
    
    // Set auth token for future requests
    setAuthToken(response.accessToken);
    
    // Store tokens in localStorage (or better, in a secure cookie/storage)
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiry', response.expiresAt.toString());
    
    return { success: true, user: response.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Invalid email or password' };
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await request<{ user: User; accessToken: string; refreshToken: string; expiresAt: number }>('/auth/register', 'POST', userData);
    
    // Set auth token for future requests
    setAuthToken(response.accessToken);
    
    // Store tokens in localStorage (or better, in a secure cookie/storage)
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiry', response.expiresAt.toString());
    
    return { success: true, user: response.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to register user' };
  }
};

/**
 * Register a new business
 */
export const registerBusiness = async (businessData: BusinessRegisterData): Promise<{ success: boolean; user?: User; businessProfile?: BusinessProfile; error?: string }> => {
  try {
    const response = await request<{ user: User; businessProfile: BusinessProfile; accessToken: string; refreshToken: string; expiresAt: number }>('/auth/register/business', 'POST', businessData);
    
    // Set auth token for future requests
    setAuthToken(response.accessToken);
    
    // Store tokens in localStorage (or better, in a secure cookie/storage)
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiry', response.expiresAt.toString());
    
    return { success: true, user: response.user, businessProfile: response.businessProfile };
  } catch (error) {
    console.error('Business registration error:', error);
    return { success: false, error: 'Failed to register business' };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    return await request<User>('/users/me');
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Get business profile by user ID
 */
export const getBusinessProfile = async (userId: string): Promise<BusinessProfile | null> => {
  try {
    return await request<BusinessProfile>(`/business-profiles/user/${userId}`);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await request<{ accessToken: string; refreshToken: string; expiresAt: number }>('/auth/refresh', 'POST', { refreshToken });
    
    // Update tokens
    setAuthToken(response.accessToken);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiry', response.expiresAt.toString());
    
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear invalid tokens
    setAuthToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    
    return false;
  }
};

/**
 * MOCK DATA FOR DEVELOPMENT
 */

// Example mock venue data
const mockVenueDetail: Venue = {
  id: "1",
  name: {
    en: "Stunning Loft Space with City Views",
    sq: "Hapësirë Loft Mahnitëse me Pamje nga Qyteti",
  },
  description: {
    en: "This stunning loft space offers breathtaking views of the city skyline. With floor-to-ceiling windows, exposed brick walls, and modern amenities, it's perfect for photoshoots, corporate events, and intimate gatherings.",
    sq: "Kjo hapësirë mahnitëse loft ofron pamje mahnitëse të horizontit të qytetit. Me dritare nga dyshemeja në tavan, mure me tulla të ekspozuara dhe pajisje moderne, është perfekte për fotografi, evente korporative dhe mbledhje intime.",
  },
  type: VenueType.LOFT,
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  location: {
    en: "SoHo, New York",
    sq: "SoHo, New York",
  },
  media: [
    {
      id: "img1",
      url: "/placeholder.svg?height=600&width=800&text=Venue Interior",
      type: "image"
    },
    {
      id: "img2",
      url: "/placeholder.svg?height=600&width=800&text=Venue Exterior",
      type: "image"
    },
    {
      id: "img3",
      url: "/placeholder.svg?height=600&width=800&text=Venue Setup",
      type: "image"
    }
  ],
  amenities: [
    VenueAmenity.WIFI,
    VenueAmenity.SOUND_SYSTEM,
    VenueAmenity.KITCHEN,
    VenueAmenity.AV_EQUIPMENT,
    VenueAmenity.PARKING
  ],
  capacity: {
    min: 10,
    max: 100,
    recommended: 50
  },
  size: 3000, // square feet
  rating: {
    average: 4.9,
    count: 24
  },
  reviews: [
    {
      id: "rev1",
      userId: "user1",
      rating: 5,
      comment: "Amazing venue! The natural light was perfect for our photoshoot.",
      createdAt: "2023-03-15T00:00:00Z",
      updatedAt: "2023-03-15T00:00:00Z"
    },
    {
      id: "rev2",
      userId: "user2",
      rating: 5,
      comment: "We hosted our company's holiday party here and it was a hit!",
      createdAt: "2023-02-10T00:00:00Z",
      updatedAt: "2023-02-10T00:00:00Z"
    }
  ],
  price: {
    amount: 150,
    currency: "USD",
    type: PricingType.HOURLY
  },
  availability: {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Available all days
    startTime: "09:00",
    endTime: "22:00",
    exceptions: []
  },
  dayAvailability: {
    monday: "9:00 AM - 10:00 PM",
    tuesday: "9:00 AM - 10:00 PM",
    wednesday: "9:00 AM - 10:00 PM",
    thursday: "9:00 AM - 10:00 PM",
    friday: "9:00 AM - 12:00 AM",
    saturday: "10:00 AM - 12:00 AM",
    sunday: "10:00 AM - 10:00 PM",
  },
  ownerId: "owner1",
  active: true,
  features: [
    "3,000 sq ft open space",
    "Floor-to-ceiling windows",
    "Exposed brick walls",
    "Hardwood floors",
    "Elevator access",
    "Heating and air conditioning",
    "Restrooms",
    "Coat check area",
  ],
  host: {
    name: "Sarah Johnson",
    image: "/placeholder.svg?height=100&width=100&text=SJ",
    responseRate: 98,
    responseTime: "within an hour",
    joined: "January 2020",
  },
  createdAt: "2022-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z"
};

// Example mock venues list
const mockVenues: VenueSummary[] = [
  {
    id: "1",
    name: {
      en: "Stunning Loft Space",
      sq: "Hapësirë Loft Mahnitëse",
    },
    location: {
      en: "Manhattan, NY",
      sq: "Manhattan, NY",
    },
    rating: {
      average: 4.9,
      count: 24
    },
    price: {
      amount: 150,
      currency: "USD",
      type: PricingType.HOURLY
    },
    type: VenueType.LOFT,
    mainImage: "/placeholder.svg?height=300&width=400&text=Venue Image",
    amenities: [VenueAmenity.WIFI, VenueAmenity.SOUND_SYSTEM],
  },
  {
    id: "2",
    name: {
      en: "Rooftop Garden",
      sq: "Kopshti në Çati",
    },
    location: {
      en: "Brooklyn, NY",
      sq: "Brooklyn, NY",
    },
    rating: {
      average: 4.7,
      count: 18
    },
    price: {
      amount: 200,
      currency: "USD",
      type: PricingType.PER_PERSON
    },
    type: VenueType.OUTDOOR_SPACE,
    mainImage: "/placeholder.svg?height=300&width=400&text=Venue Image",
    amenities: [VenueAmenity.WIFI, VenueAmenity.KITCHEN],
  },
  {
    id: "3",
    name: {
      en: "Modern Gallery",
      sq: "Galeri Moderne",
    },
    location: {
      en: "Chelsea, NY",
      sq: "Chelsea, NY",
    },
    rating: {
      average: 4.8,
      count: 32
    },
    price: {
      amount: 300,
      currency: "USD",
      type: PricingType.FIXED
    },
    type: VenueType.PHOTOGRAPHY_STUDIO,
    mainImage: "/placeholder.svg?height=300&width=400&text=Venue Image",
    amenities: [VenueAmenity.WIFI, VenueAmenity.AV_EQUIPMENT],
  }
];

// Example mock services list
const mockServices: ServiceSummary[] = [
  {
    id: "1",
    name: {
      en: "Premium Catering",
      sq: "Katering Premium",
    },
    type: ServiceType.CATERING,
    rating: {
      average: 4.8,
      count: 42
    },
    mainImage: "/placeholder.svg?height=300&width=400&text=Service Image",
    basePrice: {
      amount: 45,
      currency: "USD",
      type: PricingType.PER_PERSON
    },
    optionsCount: 3
  },
  {
    id: "2",
    name: {
      en: "Professional DJ Services",
      sq: "Shërbime Profesionale DJ",
    },
    type: ServiceType.MUSIC,
    rating: {
      average: 4.9,
      count: 38
    },
    mainImage: "/placeholder.svg?height=300&width=400&text=Service Image",
    basePrice: {
      amount: 150,
      currency: "USD",
      type: PricingType.HOURLY
    },
    optionsCount: 2
  },
  {
    id: "3",
    name: {
      en: "Event Photography",
      sq: "Fotografi Eventesh",
    },
    type: ServiceType.PHOTOGRAPHY,
    rating: {
      average: 4.7,
      count: 27
    },
    mainImage: "/placeholder.svg?height=300&width=400&text=Service Image",
    basePrice: {
      amount: 200,
      currency: "USD",
      type: PricingType.FIXED
    },
    optionsCount: 3
  }
];

// Example mock user
const mockUser: User = {
  id: "user1",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  role: UserRole.HOST,
  isActive: true,
  isVerified: true,
  phoneNumber: "+1234567890",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z"
}; 