/**
 * Mock Data Service
 * 
 * This service provides mock data for development when no backend is available.
 */

import { VenueSummary, Venue, VenueType, VenueAmenity } from '../models/venue';
import { PricingType } from '../models/common';

// Mock venues data
const mockVenues: VenueSummary[] = [
  {
    id: "1",
    name: {
      en: "Grand Ballroom at The Plaza",
      sq: "Salla e Madhe e Bankueteve në The Plaza"
    },
    type: VenueType.PARTY_VENUE,
    address: {
      street: "768 5th Ave",
      city: "New York",
      state: "NY",
      zipCode: "10019",
      country: "United States"
    },
    capacity: {
      minimum: 100,
      maximum: 500,
      recommended: 300
    },
    price: {
      amount: 150,
      currency: "USD",
      type: PricingType.HOURLY
    },
    amenities: [
      VenueAmenity.WIFI,
      VenueAmenity.SOUND_SYSTEM,
      VenueAmenity.AV_EQUIPMENT,
      VenueAmenity.PARKING
    ],
    media: [
      {
        id: "img1",
        url: "https://images.unsplash.com/photo-1519167758481-83f29d8ae8e4?w=800&h=600&fit=crop",
        alt: "Grand Ballroom Interior",
        type: "image",
        isPrimary: true
      },
      {
        id: "img2", 
        url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop",
        alt: "Ballroom Setup",
        type: "image",
        isPrimary: false
      },
      {
        id: "img3",
        url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop", 
        alt: "Evening Event",
        type: "image",
        isPrimary: false
      }
    ],
    reviews: [
      {
        id: "rev1",
        userId: "user1",
        userName: "Sarah Johnson",
        rating: 5,
        comment: "Absolutely stunning venue with impeccable service!",
        date: "2024-01-15"
      },
      {
        id: "rev2",
        userId: "user2", 
        userName: "Michael Chen",
        rating: 5,
        comment: "Perfect for our corporate event. Highly recommended!",
        date: "2024-01-10"
      }
    ],
    operatingHours: {
      monday: { open: "08:00", close: "23:00", isClosed: false },
      tuesday: { open: "08:00", close: "23:00", isClosed: false },
      wednesday: { open: "08:00", close: "23:00", isClosed: false },
      thursday: { open: "08:00", close: "23:00", isClosed: false },
      friday: { open: "08:00", close: "24:00", isClosed: false },
      saturday: { open: "08:00", close: "24:00", isClosed: false },
      sunday: { open: "10:00", close: "22:00", isClosed: false }
    }
  },
  {
    id: "2",
    name: {
      en: "Modern Rooftop Loft",
      sq: "Loft Modern në Tarracë"
    },
    type: VenueType.PHOTOGRAPHY_STUDIO,
    address: {
      street: "15 Mercer St",
      city: "New York", 
      state: "NY",
      zipCode: "10013",
      country: "United States"
    },
    capacity: {
      minimum: 20,
      maximum: 100,
      recommended: 60
    },
    price: {
      amount: 85,
      currency: "USD",
      type: PricingType.HOURLY
    },
    amenities: [
      VenueAmenity.WIFI,
      VenueAmenity.AV_EQUIPMENT,
      VenueAmenity.KITCHEN
    ],
    media: [
      {
        id: "img4",
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
        alt: "Modern Loft Interior",
        type: "image",
        isPrimary: true
      },
      {
        id: "img5",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        alt: "Loft Event Setup",
        type: "image", 
        isPrimary: false
      },
      {
        id: "img6",
        url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop",
        alt: "Rooftop View",
        type: "image",
        isPrimary: false
      }
    ],
    reviews: [
      {
        id: "rev3",
        userId: "user3",
        userName: "Emma Rodriguez",
        rating: 4,
        comment: "Great space with amazing natural light for photography.",
        date: "2024-01-12"
      }
    ],
    operatingHours: {
      monday: { open: "09:00", close: "21:00", isClosed: false },
      tuesday: { open: "09:00", close: "21:00", isClosed: false },
      wednesday: { open: "09:00", close: "21:00", isClosed: false },
      thursday: { open: "09:00", close: "21:00", isClosed: false },
      friday: { open: "09:00", close: "22:00", isClosed: false },
      saturday: { open: "09:00", close: "22:00", isClosed: false },
      sunday: { open: "10:00", close: "20:00", isClosed: false }
    }
  },
  {
    id: "3",
    name: {
      en: "Executive Conference Center",
      sq: "Qendra Ekzekutive e Konferencave"
    },
    type: VenueType.MEETING_ROOM,
    address: {
      street: "200 Park Ave",
      city: "New York",
      state: "NY", 
      zipCode: "10166",
      country: "United States"
    },
    capacity: {
      minimum: 10,
      maximum: 50,
      recommended: 30
    },
    price: {
      amount: 200,
      currency: "USD",
      type: PricingType.PER_DAY
    },
    amenities: [
      VenueAmenity.WIFI,
      VenueAmenity.AV_EQUIPMENT,
      VenueAmenity.PARKING,
      VenueAmenity.KITCHEN
    ],
    media: [
      {
        id: "img7",
        url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop",
        alt: "Conference Room",
        type: "image",
        isPrimary: true
      },
      {
        id: "img8",
        url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        alt: "Meeting Setup",
        type: "image",
        isPrimary: false
      }
    ],
    reviews: [
      {
        id: "rev4",
        userId: "user4",
        userName: "David Kim",
        rating: 5,
        comment: "Professional environment perfect for business meetings.",
        date: "2024-01-08"
      }
    ],
    operatingHours: {
      monday: { open: "07:00", close: "19:00", isClosed: false },
      tuesday: { open: "07:00", close: "19:00", isClosed: false },
      wednesday: { open: "07:00", close: "19:00", isClosed: false },
      thursday: { open: "07:00", close: "19:00", isClosed: false },
      friday: { open: "07:00", close: "18:00", isClosed: false },
      saturday: { open: "09:00", close: "17:00", isClosed: false },
      sunday: { open: "10:00", close: "16:00", isClosed: true }
    }
  },
  {
    id: "4", 
    name: {
      en: "Garden Wedding Pavilion",
      sq: "Pavioni i Dasmës në Kopsht"
    },
    type: VenueType.WEDDING_VENUE,
    address: {
      street: "1 E 91st St",
      city: "New York",
      state: "NY",
      zipCode: "10128", 
      country: "United States"
    },
    capacity: {
      minimum: 50,
      maximum: 200,
      recommended: 120
    },
    price: {
      amount: 75,
      currency: "USD",
      type: PricingType.PER_PERSON
    },
    amenities: [
      VenueAmenity.WIFI,
      VenueAmenity.SOUND_SYSTEM,
      VenueAmenity.PARKING,
      VenueAmenity.KITCHEN
    ],
    media: [
      {
        id: "img9",
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
        alt: "Garden Wedding Setup",
        type: "image",
        isPrimary: true
      },
      {
        id: "img10",
        url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop",
        alt: "Garden Ceremony",
        type: "image",
        isPrimary: false
      },
      {
        id: "img11",
        url: "https://images.unsplash.com/photo-1520637836862-4d197d17c631?w=800&h=600&fit=crop",
        alt: "Reception Area",
        type: "image",
        isPrimary: false
      }
    ],
    reviews: [
      {
        id: "rev5",
        userId: "user5",
        userName: "Jessica Martinez",
        rating: 5,
        comment: "Our dream wedding venue! Absolutely magical garden setting.",
        date: "2024-01-05"
      },
      {
        id: "rev6",
        userId: "user6",
        userName: "Robert Wilson",
        rating: 4,
        comment: "Beautiful venue with excellent catering options.",
        date: "2024-01-03"
      }
    ],
    operatingHours: {
      monday: { open: "10:00", close: "22:00", isClosed: false },
      tuesday: { open: "10:00", close: "22:00", isClosed: false },
      wednesday: { open: "10:00", close: "22:00", isClosed: false },
      thursday: { open: "10:00", close: "22:00", isClosed: false },
      friday: { open: "10:00", close: "23:00", isClosed: false },
      saturday: { open: "08:00", close: "24:00", isClosed: false },
      sunday: { open: "08:00", close: "23:00", isClosed: false }
    }
  },
  {
    id: "5",
    name: {
      en: "Urban Outdoor Space",
      sq: "Hapësira Urbane në Natyrë"
    },
    type: VenueType.OUTDOOR_SPACE,
    address: {
      street: "Central Park West",
      city: "New York",
      state: "NY",
      zipCode: "10024",
      country: "United States"
    },
    capacity: {
      minimum: 25,
      maximum: 150,
      recommended: 80
    },
    price: {
      amount: 1200,
      currency: "USD", 
      type: PricingType.FIXED
    },
    amenities: [
      VenueAmenity.WIFI,
      VenueAmenity.PARKING
    ],
    media: [
      {
        id: "img12",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        alt: "Outdoor Event Space",
        type: "image",
        isPrimary: true
      },
      {
        id: "img13",
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
        alt: "Garden Party Setup",
        type: "image",
        isPrimary: false
      }
    ],
    reviews: [
      {
        id: "rev7",
        userId: "user7",
        userName: "Amanda Foster",
        rating: 4,
        comment: "Perfect for outdoor events with a city backdrop.",
        date: "2024-01-01"
      }
    ],
    operatingHours: {
      monday: { open: "08:00", close: "20:00", isClosed: false },
      tuesday: { open: "08:00", close: "20:00", isClosed: false },
      wednesday: { open: "08:00", close: "20:00", isClosed: false },
      thursday: { open: "08:00", close: "20:00", isClosed: false },
      friday: { open: "08:00", close: "21:00", isClosed: false },
      saturday: { open: "08:00", close: "21:00", isClosed: false },
      sunday: { open: "09:00", close: "20:00", isClosed: false }
    }
  }
];

/**
 * Mock service to simulate API calls with mock data
 */
export class MockDataService {
  
  /**
   * Get venues with optional filtering
   */
  static async getVenues(filters?: {
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
  }): Promise<VenueSummary[]> {
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredVenues = [...mockVenues];
    
    if (filters) {
      // Filter by price range
      if (filters.priceMax) {
        filteredVenues = filteredVenues.filter(venue => venue.price.amount <= filters.priceMax!);
      }
      if (filters.priceMin) {
        filteredVenues = filteredVenues.filter(venue => venue.price.amount >= filters.priceMin!);
      }
      
      // Filter by venue types
      if (filters.venueTypes && filters.venueTypes.length > 0) {
        filteredVenues = filteredVenues.filter(venue => 
          filters.venueTypes!.includes(venue.type)
        );
      }
      
      // Filter by price types
      if (filters.priceTypes && filters.priceTypes.length > 0) {
        filteredVenues = filteredVenues.filter(venue => 
          filters.priceTypes!.includes(venue.price.type)
        );
      }
      
      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        filteredVenues = filteredVenues.filter(venue => 
          filters.amenities!.every(amenity => venue.amenities.includes(amenity))
        );
      }
      
      // Filter by location
      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredVenues = filteredVenues.filter(venue => 
          venue.address.city.toLowerCase().includes(location) ||
          venue.address.state.toLowerCase().includes(location) ||
          venue.address.country.toLowerCase().includes(location)
        );
      }
      
      // Filter by guest capacity
      if (filters.guests) {
        filteredVenues = filteredVenues.filter(venue => 
          venue.capacity.minimum <= filters.guests! && 
          venue.capacity.maximum >= filters.guests!
        );
      }
    }
    
    return filteredVenues;
  }
  
  /**
   * Get venue by ID
   */
  static async getVenueById(id: string): Promise<VenueSummary | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const venue = mockVenues.find(v => v.id === id);
    return venue || null;
  }
  
  /**
   * Create a new venue (mock)
   */
  static async createVenue(venueData: any): Promise<{ success: boolean; venueId?: string; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful creation
    const newId = `venue_${Date.now()}`;
    return { success: true, venueId: newId };
  }
  
  /**
   * Update venue (mock)
   */
  static async updateVenue(id: string, venueData: any): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const venue = mockVenues.find(v => v.id === id);
    if (!venue) {
      return { success: false, error: 'Venue not found' };
    }
    
    return { success: true };
  }
  
  /**
   * Delete venue (mock)
   */
  static async deleteVenue(id: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockVenues.findIndex(v => v.id === id);
    if (index === -1) {
      return { success: false, error: 'Venue not found' };
    }
    
    return { success: true };
  }
}

export default MockDataService;
