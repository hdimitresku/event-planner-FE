/**
 * Booking API Service
 * 
 * This service handles all booking-related API calls.
 */

import { Booking, BookingCreateData, BookingStatus, PaymentStatus } from '../models/booking';
import { apiRequest, buildQueryString } from './apiService';
import * as mockDataService from '../data/mockDataService';

// Flag to determine if we should use mock data (during development)
const USE_MOCK_DATA = true;

interface BookingRequestData {
  venueId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  serviceOptionIds: string[];
  specialRequests?: string;
  metadata?: Record<string, any>;
}

/**
 * Get all bookings with optional filtering
 */
export const getBookings = async (filters?: {
  userId?: string;
  venueId?: string;
  serviceId?: string;
  status?: BookingStatus[];
  paymentStatus?: PaymentStatus[];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<Booking[]> => {
  try {
    const queryString = buildQueryString(filters);
    const endpoint = `/bookings${queryString}`;
    return await apiRequest<Booking[]>(endpoint, 'GET');
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
    if (USE_MOCK_DATA) {
      return mockDataService.getBookingById(id);
    }

    return await apiRequest<Booking>(`/bookings/${id}`);
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    return null;
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: BookingRequestData): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return mockDataService.createBooking(bookingData);
    // }

    const response = await apiRequest<{ id: string }>('/bookings', 'POST', bookingData);
    return { success: true, bookingId: response.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create booking' };
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
    if (USE_MOCK_DATA) {
      return mockDataService.updateBookingStatus(id, status);
    }

    await apiRequest<Booking>(`/bookings/${id}/status`, 'PATCH', { status });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update booking status' };
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  id: string,
  paymentStatus: PaymentStatus
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.updatePaymentStatus(id, paymentStatus);
    }

    await apiRequest<Booking>(`/bookings/${id}/payment`, 'PATCH', { paymentStatus });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update payment status' };
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (
  id: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<Booking>(`/bookings/${id}/cancel`, 'POST', { reason });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to cancel booking' };
  }
};

/**
 * Submit a review for a booking
 */
export const submitBookingReview = async (
  bookingId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<void>(`/bookings/${bookingId}/review`, 'POST', { rating, comment });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit review' };
  }
}; 