"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from '@/lib/apiClient';
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
            router.push("/");
            return;
        }

        const sessionUserId = (session?.user as any)?.id;
        if (!sessionUserId) {
            router.push("/");
            return;
        }

        const fetchCourses = async () => {
            try {
                setLoading(true);
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