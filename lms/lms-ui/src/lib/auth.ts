import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import api from './apiClient';

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