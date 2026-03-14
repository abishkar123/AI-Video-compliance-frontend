import { useCallback } from 'react';
import { showError, showSuccess, getErrorMessage } from './toast';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  [key: string]: any;
}

/**
 * Custom hook for handling API calls with toast notifications
 */
export const useApi = () => {
  const handleError = useCallback((error: unknown, defaultMessage = 'Something went wrong') => {
    const message = getErrorMessage(error) || defaultMessage;
    showError(message);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    showSuccess(message);
  }, []);

  const parseResponse = useCallback(async (response: Response): Promise<ApiResponse> => {
    try {
      return await response.json();
    } catch {
      return { error: 'Failed to parse response' };
    }
  }, []);

  return {
    handleError,
    handleSuccess,
    parseResponse,
  };
};
