/**
 * Base API Service
 * 
 * This service contains the core API request functionality.
 */

// Base API config
// const API_BASE_URL = process.env.VITE_API_URL || 'https://api.eventspace.com/v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Authentication token handling
let authToken: string | null = localStorage.getItem('accessToken');

// Flag to determine if we should use mock data (during development)
export const USE_MOCK_DATA = false;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {``
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAuthToken = (): string | null => {
  authToken = localStorage.getItem('accessToken');

  return authToken;
};

/**
 * Generic request helper for making API requests
 */
export const apiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: any,
  additionalHeaders?: Record<string, string>,
  useFormData: boolean = false
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
    ...additionalHeaders,
  };

  // Remove content-type for FormData as it will be set automatically with the correct boundary
  if (useFormData && data instanceof FormData) {
    delete headers['Content-Type'];
  }

  const options: RequestInit = {
    method,
    headers,
    body: useFormData ? data : (data ? JSON.stringify(data) : undefined),
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

    // Check if response is empty
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const result = await response.json();
      return result as T;
    } else {
      return {} as T;
    }
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
};

/**
 * Helper to build query string from filter object
 */
export const buildQueryString = (filters?: Record<string, any>): string => {
  if (!filters) return '';

  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.append(key, value.join(','));
        }
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}; 