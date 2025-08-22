import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  private slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async listCourses(query: any) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.title) where.title = { contains: query.title };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.ids) {
      const ids = String(query.ids).split(',').map((s) => s.trim()).filter(Boolean);
      if (ids.length) where.id = { in: ids };
    }

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        Category: true,
        thumbnail: { select: { key: true } },
        Attachment: { orderBy: { createdAt: 'asc' } },
        Chapter: { where: { isPublished: true }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, courses };
  }

  async createCourse(title: string) {
    const slug = this.slugify(title);
    const instructorId = process.env.FALLBACK_INSTRUCTOR_ID || '';
    const course = await this.prisma.course.create({ data: { title, slug, instructorId } });
    return { message: 'Course created successfully!', success: true, course };
  }

  async updateCourse(courseId: string, values: any) {
    if (values.imageUrl) {
      await this.prisma.attachment.create({
        data: { name: values.title || 'course-image', url: values.imageUrl, courseId },
      });
      delete values.imageUrl;
    }
    if (values.price !== undefined) {
      values.priceCents = Math.round(values.price * 100);
      delete values.price;
    }
    const course = await this.prisma.course.update({ where: { id: courseId }, data: { ...values } });
    return { message: 'Course updated successfully!', success: true, course };
  }

  async deleteCourse(courseId: string) {
    const deletedCourse = await this.prisma.course.delete({ where: { id: courseId } });
    const attachments = await this.prisma.attachment.findMany({ where: { courseId } });
    for (const a of attachments) {
      try {
        // best-effort: if media belongs to S3 it should be deleted by media service
      } catch {}
    }
    return { message: 'Course deleted successfully!', success: true, course: deletedCourse };
  }

  async publishCourse(courseId: string) {
    const publishedCourse = await this.prisma.course.update({ where: { id: courseId }, data: { status: 'PUBLISHED' } });
    return { message: 'Course published successfully!', success: true, course: publishedCourse };
  }

  async unpublishCourse(courseId: string) {
    const publishedCourse = await this.prisma.course.update({ where: { id: courseId }, data: { status: 'DRAFT' } });
    return { message: 'Course unpublished successfully!', success: true, course: publishedCourse };
  }

  async getPurchasesAndRevenue(courseId: string) {
    const dailyData: any = await this.prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "courseId" = ${courseId}
    AND "createdAt" >= CURRENT_DATE
`;

    const weeklyData: any = await this.prisma.$queryRaw`
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

    const monthlyData: any = await this.prisma.$queryRaw`
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

    const allTimeData: any = await this.prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "courseId" = ${courseId}
`;

    const result = {
      daily: { total_purchases: Number(dailyData[0].total_purchases), total_revenue: Number(dailyData[0].total_revenue) },
      weekly: { total_purchases: Number(weeklyData[0].total_purchases), total_revenue: Number(weeklyData[0].total_revenue) },
      monthly: { total_purchases: Number(monthlyData[0].total_purchases), total_revenue: Number(monthlyData[0].total_revenue) },
      allTime: { total_purchases: Number(allTimeData[0].total_purchases), total_revenue: Number(allTimeData[0].total_revenue) },
    };

    return { message: 'Course analytics fetched successfully!', success: true, data: result };
  }

  async getCourseById(courseId: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        thumbnail: { select: { key: true } },
        Attachment: { orderBy: { createdAt: 'asc' } },
        Chapter: { where: { isPublished: true }, orderBy: { position: 'asc' } },
      },
    });

    if (!course) return { success: false, message: 'Course not found' };

    let isPurchased = false;
    if (userId) {
      const purchase = await this.prisma.purchase.findFirst({ where: { courseId, userId } });
      isPurchased = !!purchase;
    }

    return { success: true, course, isPurchased };
  }
}
