import { Metadata } from "next";
import api from '@/lib/apiClient';
import CategoriesTable, { columns } from "@/components/categories/CategoriesTable";

export const metadata: Metadata = {
    title: `Dashboard - Categories`,
};

const CategoriesPage = async () => {

    const res = await api.get('/categories');
    const categories = res?.data || [];
    const categoriesWithCoursesCountFormatted = categories.map((category: any) => ({
        ...category,
        courses: category.courses?.length || 0
    }));

    return (
        <div className="p-6">
            <CategoriesTable
                columns={columns}
                data={categoriesWithCoursesCountFormatted}
            />
        </div>
    );
};

export default CategoriesPage;