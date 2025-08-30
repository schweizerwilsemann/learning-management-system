import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { refreshJWTToken } from '@/lib/auth';

export const useJWT = () => {
  const { data: session, status } = useSession();
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      if (status === 'loading') return;

      if (!session?.user?.email) {
        setIsTokenLoaded(true);
        return;
      }

      try {
        // Check if we already have a token in localStorage
        const storedToken = localStorage.getItem('jwt_token');
        
        if (storedToken) {
          setIsTokenLoaded(true);
          return;
        }

        // If no stored token, get a new one from the backend
        await refreshJWTToken(session.user.email);
        setIsTokenLoaded(true);
      } catch (error) {
        console.error('Error loading JWT token:', error);
        setIsTokenLoaded(true);
      }
    };

    loadToken();
  }, [session, status]);

  return { isTokenLoaded, status };
};
