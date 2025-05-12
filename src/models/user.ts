import { Address, BaseEntity } from './common';

/**
 * User role
 */
export enum UserRole {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  ADMIN = 'admin'
}

/**
 * User model
 */
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber?: string;
  profileImage?: string;
  role: UserRole;
  lastLogin?: string;
  address?: Address;
  preferences?: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };
  isActive: boolean;
  isVerified: boolean;
}

/**
 * Business profile specific information
 */
export interface BusinessProfile extends BaseEntity {
  userId: string;
  businessName: string;
  businessDescription: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  businessAddress: Address;
  businessHours: {
    dayOfWeek: number;  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    open: boolean;
    startTime?: string; // Format: "HH:MM", 24-hour
    endTime?: string;   // Format: "HH:MM", 24-hour
  }[];
  logo?: string;
  bannerImage?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  averageRating?: number;
  reviewCount?: number;
}

/**
 * Auth related data
 */
export interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
  businessProfile?: BusinessProfile;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
}

/**
 * Business registration data
 */
export interface BusinessRegisterData extends RegisterData {
  businessName: string;
  businessDescription: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: Address;
} 