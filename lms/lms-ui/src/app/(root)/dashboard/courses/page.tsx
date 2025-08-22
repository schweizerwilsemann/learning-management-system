import { Metadata } from "next";
import api from '@/lib/apiClient';
import DataTable, { columns } from "@/components/courses/DataTable";

export const metadata: Metadata = {
    title: `Dashboard - Courses`,
};

const CoursesPage = async () => {

    const res = await api.get('/courses');
    const courses = res?.data?.courses || [];

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