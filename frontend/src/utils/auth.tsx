import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuthBackendUrl } from '../config';

interface UserInfo {
  user_id: string;
  username: string;
  email: string;
  phone_number?: string;
}

interface CachedUserInfo {
  data: UserInfo;
  timestamp: number;
  token: string;
}

// Cache duration in milliseconds (15 minutes)
const CACHE_DURATION = 15 * 60 * 1000;
const CACHE_KEY = 'flixshare_user_cache';

// Cache utility functions
const cacheUtils = {
  get: (): CachedUserInfo | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch {
      return null;
    }
  },

  set: (userInfo: UserInfo, token: string): void => {
    try {
      const cacheData: CachedUserInfo = {
        data: userInfo,
        timestamp: Date.now(),
        token
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  isValid: (cached: CachedUserInfo, currentToken: string): boolean => {
    const now = Date.now();
    const isNotExpired = (now - cached.timestamp) < CACHE_DURATION;
    const isSameToken = cached.token === currentToken;
    return isNotExpired && isSameToken;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserInfo = useCallback(async (bypassCache = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        cacheUtils.clear();
        navigate('/auth/login');
        return;
      }

      // Check cache first unless bypassing
      if (!bypassCache) {
        const cached = cacheUtils.get();
        if (cached && cacheUtils.isValid(cached, token)) {
          setUser(cached.data);
          setLoading(false);
          return;
        }
      }

      // Make API request if cache miss or bypass requested
      const response = await axios.get(
        `${getAuthBackendUrl()}/auth/verify/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const userData = response.data;
      setUser(userData);
      
      // Cache the successful response
      cacheUtils.set(userData, token);
      
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear cache on authentication error
          cacheUtils.clear();
          navigate('/auth/login');
        }
        setError(error.response?.data?.error || 'Failed to fetch user info');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return { 
    user, 
    loading, 
    error, 
    refetchUser: fetchUserInfo,
    clearCache: cacheUtils.clear,
    refreshUser: () => fetchUserInfo(true)
  };
};