import { useState, useCallback } from 'react';
import useUIStore from '../stores/uiStore';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useUIStore();

  const request = useCallback(async (apiCall, options = {}) => {
    const {
      showErrorToast = true,
      setGlobalLoading = false,
      onSuccess,
      onError
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      if (setGlobalLoading) {
        useUIStore.getState().setLoading(true);
      }

      const response = await apiCall();
      const data = response.data;

      if (onSuccess) {
        onSuccess(data);
      }

      return { success: true, data, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);

      if (showErrorToast) {
        showError(errorMessage);
      }

      if (onError) {
        onError(err);
      }

      return { success: false, data: null, error: errorMessage };
    } finally {
      setLoading(false);
      
      if (setGlobalLoading) {
        useUIStore.getState().setLoading(false);
      }
    }
  }, [showError]);

  const get = useCallback((url, options = {}) => {
    return request(() => api.get(url), options);
  }, [request]);

  const post = useCallback((url, data, options = {}) => {
    return request(() => api.post(url, data), options);
  }, [request]);

  const put = useCallback((url, data, options = {}) => {
    return request(() => api.put(url, data), options);
  }, [request]);

  const patch = useCallback((url, data, options = {}) => {
    return request(() => api.patch(url, data), options);
  }, [request]);

  const del = useCallback((url, options = {}) => {
    return request(() => api.delete(url), options);
  }, [request]);

  const upload = useCallback((url, formData, options = {}) => {
    const uploadOptions = {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers
      }
    };
    
    return request(() => api.post(url, formData, uploadOptions), options);
  }, [request]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    clearError
  };
};

// Specialized hooks for common operations
export const useAsyncOperation = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error, data };
};

export const useLazyLoad = (loadFunction, dependencies = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const load = useCallback(async () => {
    if (hasLoaded || loading) return;

    try {
      setLoading(true);
      setError(null);
      const result = await loadFunction();
      setData(result);
      setHasLoaded(true);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [loadFunction, hasLoaded, loading]);

  const reload = useCallback(() => {
    setHasLoaded(false);
    load();
  }, [load]);

  return { load, reload, loading, error, data, hasLoaded };
}; 