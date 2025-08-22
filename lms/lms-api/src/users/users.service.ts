import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; name?: string; image?: string; role?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name ?? null,
        image: data.image ?? null,
        // Prisma Role enum may be strict — cast to any to avoid TS mismatch here
        role: (data.role ?? 'STUDENT') as any,
      },
    });
  }

  async update(id: string, updateUserDto: any) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserPurchases(userId: string) {
    const purchases = await this.prisma.purchase.findMany({ where: { userId }, select: { courseId: true } });
    return purchases.map(p => p.courseId);
  }
}
