import { Metadata } from "next";
// prisma removed: backend API used instead
import CoursesList from "@/components/courses/CoursesList";
import SearchInput from "@/components/shared/SearchInput";
import CategoryItem from "@/components/categories/CategoryItem";
import api from '@/lib/apiClient';

export const metadata: Metadata = {
  title: `Home - ${process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru'}`,
};

interface HomePageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
};

const HomePage = async ({ searchParams }: HomePageProps) => {

  // Use axios api client for backend requests (server-side)
  const categoriesRes = await api.get('/categories');
  const categoriesData = categoriesRes?.data;
  const categoriesWithCoursesCountFormatted = Array.isArray(categoriesData)
    ? categoriesData
    : [];

  const params = new URLSearchParams();
  params.set('status', 'PUBLISHED');
  if (searchParams.title) params.set('title', searchParams.title);
  if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
  const coursesRes = await api.get(`/courses?${params.toString()}`);
  const coursesJson = coursesRes?.data;
  const courses = coursesJson?.courses || coursesJson || [];

  // normalize fields expected by existing components: imageUrl and price
  const s3Bucket = process.env.S3_BUCKET_NAME;
  const s3Endpoint = process.env.S3_ENDPOINT;
  const coursesNormalized = (courses as any[]).map((c: any) => {
    let imageUrl: string | null = null;
    if ((c as any).imageUrl) imageUrl = (c as any).imageUrl; // legacy fallback
    else if (c.thumbnail?.key && s3Bucket) imageUrl = `${s3Endpoint?.replace(/\/$/, '') || `https://${s3Bucket}.s3.amazonaws.com`}/${c.thumbnail.key}`;
    else if (c.attachments?.length) imageUrl = c.attachments[0].url;
    // price support: price or priceCents
    const price = (c as any).price ?? ((c as any).priceCents ? Math.round((c as any).priceCents / 100) : 0);
    return { ...c, imageUrl, price };
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
          {categoriesWithCoursesCountFormatted.map((item, index) => (
            <CategoryItem
              key={index}
              label={item.name}
              value={item.id}
              courses={item.courses}
            />
          ))}
        </div>
        <CoursesList
          items={coursesNormalized as any}
        />
      </div>
    </>
  )
};

export default HomePage;