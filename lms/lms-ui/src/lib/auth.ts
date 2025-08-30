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
                    // eslint-disable-next-line no-console
                    console.error('signIn: backend find-or-create failed', error);
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

                    // Prefer the role returned by the backend. Avoid implicitly
                    // mapping an env var to ADMIN here because that can cause
                    // accidental elevation if the env var is misconfigured.
                    // Fall back to STUDENT when role is missing.
                    // @ts-ignore
                    session.user.role = exist?.role ?? 'STUDENT';

                    // Store JWT token if available
                    if (exist?.access_token) {
                        setBearerToken(exist.access_token);
                        // Store token in localStorage for persistence
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('jwt_token', exist.access_token);
                        }
                    }

                    // Debug: log backend user payload so UI role rendering can be inspected
                    // eslint-disable-next-line no-console
                    console.debug('session backend user:', exist);
                }
                return session;
            } catch (error: any) {
                // Preserve and log full error for easier debugging
                // eslint-disable-next-line no-console
                console.error('session callback failed:', error);
                // Re-throw to let NextAuth surface the error properly
                throw error;
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