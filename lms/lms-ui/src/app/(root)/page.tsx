import { Metadata } from "next";
// prisma removed: backend API used instead
import CoursesList from "@/components/courses/CoursesList";
import SearchInput from "@/components/shared/SearchInput";
import CategoryItem from "@/components/categories/CategoryItem";
import api from '@/lib/apiClient';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { refreshJWTToken } from '@/lib/auth';

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

  // If we have a logged-in next-auth session on the server, try to obtain a
  // backend JWT for server-side requests so protected endpoints don't return 401.
  try {
    const session = await getServerSession(authOptions as any);
    const s = session as any;
    if (s?.user?.email) {
      // attempt to refresh/get a JWT for this server request
      await refreshJWTToken(s.user.email);
    }
  } catch (err) {
    // ignore - we'll handle errors when calling the API below
    // eslint-disable-next-line no-console
    console.debug('No server session or failed to refresh JWT:', err);
  }

  // Use axios api client for backend requests (server-side)
  let categoriesWithCoursesCountFormatted: any[] = [];
  try {
    const categoriesRes = await api.get('/categories');
    const categoriesData = categoriesRes?.data;
    categoriesWithCoursesCountFormatted = Array.isArray(categoriesData) ? categoriesData : [];
  } catch (err) {
    // Log server-side so the build/render doesn't crash on 401 or other errors
    // Keep categories list empty as a graceful fallback
    // eslint-disable-next-line no-console
    console.error('Failed to load categories:', err);
    categoriesWithCoursesCountFormatted = [];
  }

  const params = new URLSearchParams();
  params.set('status', 'PUBLISHED');
  if (searchParams.title) params.set('title', searchParams.title);
  if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
  let courses: any[] = [];
  try {
    const coursesRes = await api.get(`/courses?${params.toString()}`);
    const coursesJson = coursesRes?.data;
    courses = coursesJson?.courses || coursesJson || [];
  } catch (err) {
    // Log server-side so the build/render doesn't crash on 401 or other errors
    // Return empty list of courses as a graceful fallback
    // eslint-disable-next-line no-console
    console.error('Failed to load courses:', err);
    courses = [];
  }

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