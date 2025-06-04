/**
 * User API Service
 * 
 * This service handles all user-related API calls.
 */

import { User, BusinessProfile, AuthData, LoginCredentials, RegisterData, BusinessRegisterData } from '../models/user';
import { apiRequest, setAuthToken } from './apiService';
import * as mockDataService from '../data/mockDataService';

// Flag to determine if we should use mock data (during development)
const USE_MOCK_DATA = false;

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      const result = mockDataService.login(credentials);
      if (result.success && result.user) {
        // Set mock token in local storage
        setAuthToken('mock-token');
      }
      return result;
    }

    const response = await apiRequest<AuthData>('/auth/login', 'POST', credentials);
    setAuthToken(response.accessToken);
    return { success: true, user: response.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    if (!USE_MOCK_DATA) {
      await apiRequest<void>('/auth/logout', 'POST');
    }
  } finally {
    setAuthToken(null);
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    if (USE_MOCK_DATA) {
      const result = mockDataService.registerUser(userData);
      if (result.success && result.user) {
        // Set mock token in local storage
        setAuthToken('mock-token');
      }
      return result;
    }

    const response = await apiRequest<AuthData>('/auth/register', 'POST', userData);
    setAuthToken(response.accessToken);
    return { success: true, user: response.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
};

/**
 * Register a business account
 */
export const registerBusiness = async (businessData: BusinessRegisterData): Promise<{ 
  success: boolean; 
  user?: User; 
  businessProfile?: BusinessProfile; 
  error?: string 
}> => {
  try {
    if (USE_MOCK_DATA) {
      const result = mockDataService.registerBusiness(businessData);
      if (result.success && result.user) {
        // Set mock token in local storage
        setAuthToken('mock-token');
      }
      return result;
    }

    const response = await apiRequest<{
      user: User;
      businessProfile: BusinessProfile;
      accessToken: string;
    }>('/auth/register/business', 'POST', businessData);
    
    setAuthToken(response.accessToken);
    return { 
      success: true, 
      user: response.user, 
      businessProfile: response.businessProfile 
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Business registration failed' };
  }
};

/**
 * Get current user information
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (USE_MOCK_DATA) {
      // In a real application, you'd use the ID from the token
      // For mock, we'll just return the first user
      return mockDataService.getUserById('user1');
    }

    return await apiRequest<User>('/users/me');
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Get logged in user information
 */
export const getLoggedInUser = async (): Promise<User | null> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.getUserById("3");
    }

    return await apiRequest<User>(`/users/me`);
  } catch (error) {
    console.error(`Error fetching current user:`, error);
    return null;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    // if (USE_MOCK_DATA) {
    //   return mockDataService.getUserById(id);
    // }

    return await apiRequest<User>(`/users/${id}`);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
};

/**
 * Get business profile
 */
export const getBusinessProfile = async (userId: string): Promise<BusinessProfile | null> => {
  try {
    if (USE_MOCK_DATA) {
      return mockDataService.getBusinessProfile(userId);
    }

    return await apiRequest<BusinessProfile>(`/users/${userId}/business-profile`);
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userData: Partial<User>
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<User>('/users/me', 'PATCH', userData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update profile' };
  }
};

/**
 * Update business profile
 */
export const updateBusinessProfile = async (
  businessData: Partial<BusinessProfile>
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<BusinessProfile>('/users/me/business-profile', 'PUT', businessData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update business profile' };
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (image: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    
    const response = await apiRequest<{ imageUrl: string }>(
      '/users/me/profile-image',
      'POST',
      formData,
      undefined,
      true
    );
    
    return { success: true, imageUrl: response.imageUrl };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to upload profile image' };
  }
};

/**
 * Change password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<void>('/users/me/password', 'PUT', { 
      currentPassword,
      newPassword 
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to change password' };
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<void>('/auth/password-reset', 'POST', { email });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to request password reset' };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiRequest<void>('/auth/password-reset/confirm', 'POST', { token, newPassword });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reset password' };
  }
}; 