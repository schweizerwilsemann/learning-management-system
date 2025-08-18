"use server";
import prisma from "@/lib/prisma";
import { deleteMediaAction } from "./media";

interface PurchasesResult {
    total_purchases: number;
    total_revenue: number;
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const createCourseAction = async ({ title }: { title: string }) => {
    try {
        const slug = slugify(title);
        const instructorId = process.env.FALLBACK_INSTRUCTOR_ID || '';
        const course = await prisma.course.create({
            data: {
                title,
                slug,
                instructorId,
            }
        });
        return {
            message: 'Course created successfully!',
            success: true,
            course
        };
    } catch (error) {
        throw error;
    }
};

const updateCourseAction = async (courseId: string, values: any) => {
    try {
        // If a new image URL is provided, create an Attachment and keep link
        if (values.imageUrl) {
            await prisma.attachment.create({
                data: {
                    name: values.title || 'course-image',
                    url: values.imageUrl,
                    courseId: courseId,
                }
            });
            // remove the legacy imageUrl key from values so it doesn't error
            delete values.imageUrl;
        }
        // map price -> priceCents if provided
        if (values.price !== undefined) {
            values.priceCents = Math.round(values.price * 100);
            delete values.price;
        }

        const course = await prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                ...values,
            }
        });
        return {
            message: 'Course updated successfully!',
            success: true,
            course
        };
    } catch (error) {
        throw error;
    }
};

const deleteCourseAction = async (courseId: string) => {
    try {
        const deletedCourse = await prisma.course.delete({
            where: {
                id: courseId,
            }
        });
        // delete attachments media if they belong to S3
        const attachments = await prisma.attachment.findMany({ where: { courseId } });
        for (const a of attachments) {
            try { await deleteMediaAction(a.url); } catch {}
        }
        return {
            message: 'Course deleted successfully!',
            success: true,
            course: deletedCourse
        };
    } catch (error) {
        throw error;
    }
};

const publishCourseAction = async (courseId: string) => {
    try {
        const publishedCourse = await prisma.course.update({
            where: { id: courseId },
            data: { status: 'PUBLISHED' }
        });

        return {
            message: 'Course published successfully!',
            success: true,
            course: publishedCourse
        };
    } catch (error) {
        throw error;
    }
};

const unpublishCourseAction = async (courseId: string) => {
    try {
        const publishedCourse = await prisma.course.update({
            where: { id: courseId },
            data: { status: 'DRAFT' }
        });
        return {
            message: 'Course unpublished successfully!',
            success: true,
            course: publishedCourse
        };
    } catch (error) {
        throw error;
    }
};

const getPurchasesAndRevenueAction = async (courseId: string) => {
    try {
        const dailyData: PurchasesResult[] = await prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "courseId" = ${courseId}
    AND "createdAt" >= CURRENT_DATE
`;

        const weeklyData: PurchasesResult[] = await prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "courseId" = ${courseId}
    AND "createdAt" >= CURRENT_DATE - INTERVAL '1 week'
    AND "createdAt" < CURRENT_DATE
`;

        const monthlyData: PurchasesResult[] = await prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "courseId" = ${courseId}
    AND "createdAt" >= CURRENT_DATE - INTERVAL '1 month'
    AND "createdAt" < CURRENT_DATE
`;

        const allTimeData: PurchasesResult[] = await prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "courseId" = ${courseId}
`;
        const result: {
            daily: { total_purchases: number; total_revenue: number };
            weekly: { total_purchases: number; total_revenue: number };
            monthly: { total_purchases: number; total_revenue: number };
            allTime: { total_purchases: number; total_revenue: number };
        } = {
            daily: {
                total_purchases: Number(dailyData[0].total_purchases),
                total_revenue: Number(dailyData[0].total_revenue)
            },
            weekly: {
                total_purchases: Number(weeklyData[0].total_purchases),
                total_revenue: Number(weeklyData[0].total_revenue)
            },
            monthly: {
                total_purchases: Number(monthlyData[0].total_purchases),
                total_revenue: Number(monthlyData[0].total_revenue)
            },
            allTime: {
                total_purchases: Number(allTimeData[0].total_purchases),
                total_revenue: Number(allTimeData[0].total_revenue)
            }
        };
        return {
            message: 'Course analytics fetched successfully!',
            success: true,
            data: result,
        };
    } catch (error) {
        throw error;
    }
};

export {
    createCourseAction,
    updateCourseAction,
    deleteCourseAction,
    publishCourseAction,
    unpublishCourseAction,
    getPurchasesAndRevenueAction,
};