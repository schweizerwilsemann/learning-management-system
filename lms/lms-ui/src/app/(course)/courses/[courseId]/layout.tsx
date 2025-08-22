import { redirect } from "next/navigation";
import api from '@/lib/apiClient';
import CourseSidebar from "@/components/courses/CourseSidebar";
import CourseNavbar from "@/components/courses/CourseNavbar";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import Footer from "@/components/shared/Footer";

export default async function CourseLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { courseId: string },
}) {

    // Fetch course from backend API (includes published chapters and attachments)
    const courseRes = await api.get(`/courses/${params.courseId}`);
    const courseData = courseRes?.data;
    const course = courseData?.course || null;

    if (!course) {
        return redirect("/");
    }

    const session = await getServerSession(authOptions);

    // backend already returns isPurchased flag; if not present, derive from API
    let isPurchased = courseData?.isPurchased ?? false;
    // if not provided by API and we have a session user, ask backend explicitly
    const sessionUserId = (session?.user as any)?.id;
    if (!isPurchased && sessionUserId) {
        const p = await api.get(`/courses/${params.courseId}?userId=${sessionUserId}`);
        isPurchased = !!p?.data?.isPurchased;
    }

    return (
        <div className="h-full">
            <div className="h-20 md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course as any}
                    isPurchased={(session && isPurchased) ? true : false}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course as any}
                    isPurchased={(session && isPurchased) ? true : false}
                />
            </div>
            <main className="md:pl-80 pt-20 min-h-full" >
                {children}
            </main>
            <footer className="w-full md:pl-80 relative bottom-0 border-t" >
                <Footer />
            </footer>
        </div>
    );
};
