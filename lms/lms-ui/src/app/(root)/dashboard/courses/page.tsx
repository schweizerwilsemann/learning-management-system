import { Metadata } from "next";
import api from '@/lib/apiClient';
import DataTable, { columns } from "@/components/courses/DataTable";
import { getServerSession } from 'next-auth';
import authOptions, { refreshJWTToken } from '@/lib/auth';

export const metadata: Metadata = {
    title: `Dashboard - Courses`,
};

const CoursesPage = async () => {

    let courses: any[] = [];
    try {
        // Try to obtain a backend JWT for this server-side request when next-auth
        // has a server session available.
        try {
            const session = await getServerSession(authOptions as any);
            const s = session as any;
            if (s?.user?.email) {
                // attempt to get a backend access token
                await refreshJWTToken(s.user.email);
            }
        } catch (e) {
            // ignore session/refresh errors - we'll handle the API call below
        }

        const res = await api.get('/courses');
        courses = res?.data?.courses || [];
    } catch (err) {
        // Log server-side and return an empty list so the dashboard doesn't crash
        // eslint-disable-next-line no-console
        console.error('Failed to load dashboard courses:', err);
        courses = [];
    }

    return (
        <div className="p-6">
            <DataTable
                columns={columns}
                data={courses}
            />
        </div>
    );
};

export default CoursesPage;