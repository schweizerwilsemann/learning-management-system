import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import api from '@/lib/apiClient';
import authOptions from "@/lib/auth";
import CoursesList from "@/components/courses/CoursesList";
import Banner from "@/components/shared/Banner";

export const metadata: Metadata = {
    title: `Courses - ${process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru'}`,
};

const CoursesPage = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/");
    }

    const sessionUserId = (session?.user as any)?.id;
    if (!sessionUserId) return redirect('/');
    const purchasesRes = await api.get(`/users/${sessionUserId}/purchases`);
    const courseIds: string[] = purchasesRes?.data || [];
    const coursesRes = await api.get(`/courses?ids=${courseIds.join(',')}`);
    const courses = coursesRes?.data?.courses || [];

    return (
        <>
            {courses.length === 0 && (
                <Banner
                    label="You have't purchased any course yet, purchase courses to see here."
                />
            )}
            <div className="px-6 pb-6 pt-2">
                <CoursesList
                    items={courses}
                    isCoursesPage={true}
                />
            </div>
        </>
    )
};

export default CoursesPage;