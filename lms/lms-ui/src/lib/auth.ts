import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import api, { setBearerToken } from './apiClient';

// Utility function to clear JWT token
export const clearJWTToken = () => {
  setBearerToken(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
};

// Utility function to refresh JWT token
export const refreshJWTToken = async (email: string) => {
  try {
    const response = await api.post('/auth/get-token', { email });
    if (response?.data?.access_token) {
      const token = response.data.access_token;
      setBearerToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', token);
      }
      return token;
    }
  } catch (error) {
    console.error('Error refreshing JWT token:', error);
    clearJWTToken();
  }
  return null;
};

const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
            async signIn({ user }) {
                try {
                    if (user?.email) {
                        // Ask backend to find or create the user
                        const res = await api.post('/auth/find-or-create', {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        });
                        
                        // Store JWT token if available
                        if (res?.data?.access_token) {
                            setBearerToken(res.data.access_token);
                            // Store token in localStorage for persistence
                            if (typeof window !== 'undefined') {
                                localStorage.setItem('jwt_token', res.data.access_token);
                            }
                        }
                        
                        return !!res?.data;
                    }
                    return false;
                } catch (error: any) {
                    return false;
                }
        },
        async session({ session, }) {
            try {
                const res = await api.post('/auth/find-or-create', { email: session.user?.email });
                const exist = res?.data;
                if (exist) {
                    // @ts-ignore
                    session.user.id = exist.id;
                    // @ts-ignore
                    session.user.role = (exist?.email === String(process.env.GMAIL_MAIL_USER_ID) ? "ADMIN" : exist?.role);
                    
                    // Store JWT token if available
                    if (exist?.access_token) {
                        setBearerToken(exist.access_token);
                        // Store token in localStorage for persistence
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('jwt_token', exist.access_token);
                        }
                    }
                }
                return session;
            } catch (error: any) {
                throw new Error(error.message);
            }
        },
    },
    pages: {
        error: '/',
        signIn: '/',
        signOut: '/',
    }
};

export default authOptions;