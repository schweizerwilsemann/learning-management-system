"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from '@/lib/apiClient';
import { getBearerToken } from '@/lib/apiClient';
import { refreshJWTToken } from '@/lib/auth';
import { useJWT } from '@/hooks/useJWT';
import CoursesList from "@/components/courses/CoursesList";
import Banner from "@/components/shared/Banner";

const CoursesPage = () => {
    const { data: session, status } = useSession();
    const { isTokenLoaded } = useJWT();
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "loading" || !isTokenLoaded) return;

        if (!session) {
            // Don't force a redirect. Show a friendly message and allow the UI
            // to render so a user can sign in or understand why there are no courses.
            setError("Please sign in to view your purchased courses.");
            setLoading(false);
            return;
        }

        const sessionUserId = (session?.user as any)?.id;
        if (!sessionUserId) {
            setError("Unable to determine user identity. Please sign in again.");
            setLoading(false);
            return;
        }

        const fetchCourses = async () => {
            try {
                setLoading(true);
                // debug: log session and in-memory token
                // eslint-disable-next-line no-console
                console.log('fetchCourses: session, bearerToken', session, getBearerToken());

                // If no in-memory token, try refreshing once
                if (!getBearerToken() && session?.user?.email) {
                    // eslint-disable-next-line no-console
                    console.log('fetchCourses: attempting refreshJWTToken fallback');
                    await refreshJWTToken((session?.user as any).email);
                    // eslint-disable-next-line no-console
                    console.log('fetchCourses: after refresh, bearerToken=', getBearerToken());
                }
                // Request the purchases for the authenticated user using their id.
                // The backend validates `req.user.id` against this id.
                const purchasesRes = await api.get(`/users/${sessionUserId}/purchases`);
                const courseIds: string[] = purchasesRes?.data || [];
                
                if (courseIds.length > 0) {
                    const coursesRes = await api.get(`/courses?ids=${courseIds.join(',')}`);
                    setCourses(coursesRes?.data?.courses || []);
                } else {
                    setCourses([]);
                }
            } catch (error: any) {
                console.error('Error loading courses:', error);
                setError("Error loading courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [session, status, isTokenLoaded, router]);

    if (status === "loading" || loading || !isTokenLoaded) {
        return (
            <div className="px-6 pb-6 pt-2">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <>
                <Banner label={error} />
                <div className="px-6 pb-6 pt-2">
                    <CoursesList items={[]} isCoursesPage={true} />
                </div>
            </>
        );
    }

    return (
        <>
            {courses.length === 0 && (
                <Banner
                    label="You haven't purchased any course yet, purchase courses to see here."
                />
            )}
            <div className="px-6 pb-6 pt-2">
                <CoursesList
                    items={courses}
                    isCoursesPage={true}
                />
            </div>
        </>
    );
};

export default CoursesPage;