import axios, { AxiosInstance, AxiosError } from 'axios';
import { showError, showSuccess } from './toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling success
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle different error types
    if (!error.response) {
      // Network error
      showError('Network error. Please check your connection.');
      return Promise.reject({
        statusCode: 0,
        message: 'Network error',
        error,
      });
    }

    const status = error.response.status;
    const data = error.response.data as any;

    // Extract error message from response
    const message =
      data?.message ||
      data?.error ||
      error.message ||
      `Error: ${status}`;

    // Show error toast
    showError(message);

    // Return standardized error object
    return Promise.reject({
      statusCode: status,
      message,
      data,
    });
  }
);

export default axiosInstance;

/**
 * Type for API responses
 */
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  statusCode?: number;
  message?: string;
  error?: string;
}

/**
 * Type for standardized error
 */
export interface ApiError {
  statusCode: number;
  message: string;
  data?: any;
}
