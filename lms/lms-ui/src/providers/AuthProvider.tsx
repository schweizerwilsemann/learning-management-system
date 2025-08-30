"use client";
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { setBearerToken } from '@/lib/apiClient';

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        // Initialize JWT token from localStorage on app load
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('jwt_token');
            if (storedToken) {
                setBearerToken(storedToken);
            }
        }
    }, []);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
};

export default AuthProvider;