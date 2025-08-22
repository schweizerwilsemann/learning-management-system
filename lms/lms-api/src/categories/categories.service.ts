import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string) {
    const category = await this.prisma.category.create({ data: { name } });
    return { success: true, message: 'Category created successfully', category };
  }

  async updateCategory(id: string, name: string) {
    const category = await this.prisma.category.update({ where: { id }, data: { name } });
    return { success: true, message: 'Category updated successfully', category };
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.delete({ where: { id } });
    return { success: true, message: 'Category deleted successfully', category };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        courses: { where: { status: 'PUBLISHED' }, select: { id: true } },
      },
    });
    return categories.map((c: any) => ({ ...c, courses: c.courses.length }));
  }
}
