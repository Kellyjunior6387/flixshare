import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  user_id: string;
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const response = await axios.get(
        'http://127.0.0.1:8080/auth/verify/',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          navigate('/auth/login');
        }
        setError(error.response?.data?.error || 'Failed to fetch user info');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return { user, loading, error, refetchUser: fetchUserInfo };
};