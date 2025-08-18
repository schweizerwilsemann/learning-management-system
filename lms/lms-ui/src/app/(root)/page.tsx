import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CoursesList from "@/components/courses/CoursesList";
import SearchInput from "@/components/shared/SearchInput";
import CategoryItem from "@/components/categories/CategoryItem";

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

  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      courses: {
        where: {
          status: "PUBLISHED"
        },
        select: {
          id: true
        }
      }
    }
  });

  const categoriesWithCoursesCountFormatted = categories.map(category => ({
    ...category,
    courses: category.courses.length
  }));

  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      title: {
        contains: searchParams.title,
      },
      categoryId: searchParams.categoryId,
    },
    include: {
      category: true,
      thumbnail: {
        select: {
          key: true
        }
      },
      attachments: {
        orderBy: { createdAt: 'asc' }
      },
        chapters: {
        where: {
          isPublished: true
        },
        select: {
          id: true
        },
      },
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // normalize fields expected by existing components: imageUrl and price
  const s3Bucket = process.env.S3_BUCKET_NAME;
  const s3Endpoint = process.env.S3_ENDPOINT;
  const coursesNormalized = courses.map((c) => {
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