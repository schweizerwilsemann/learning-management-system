import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPurchasesData() {
    const dailyData: any = await this.prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "createdAt" >= CURRENT_DATE
`;

    const weeklyData: any = await this.prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "createdAt" >= CURRENT_DATE - INTERVAL '1 week'
    AND "createdAt" < CURRENT_DATE
`;

    const monthlyData: any = await this.prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
WHERE
    "createdAt" >= CURRENT_DATE - INTERVAL '1 month'
    AND "createdAt" < CURRENT_DATE
`;

    const allTimeData: any = await this.prisma.$queryRaw`
SELECT
    COUNT(*)::INTEGER AS total_purchases,
    SUM(price)::DECIMAL AS total_revenue
FROM
    "Purchase"
`;

    return {
      daily: { total_purchases: Number(dailyData[0].total_purchases), total_revenue: Number(dailyData[0].total_revenue) },
      weekly: { total_purchases: Number(weeklyData[0].total_purchases), total_revenue: Number(weeklyData[0].total_revenue) },
      monthly: { total_purchases: Number(monthlyData[0].total_purchases), total_revenue: Number(monthlyData[0].total_revenue) },
      allTime: { total_purchases: Number(allTimeData[0].total_purchases), total_revenue: Number(allTimeData[0].total_revenue) },
    };
  }

  async getUsersData() {
    const dailyData: any = await this.prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
        WHERE
          "createdAt" >= CURRENT_DATE
      `;

    const weeklyData: any = await this.prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
        WHERE
          "createdAt" >= CURRENT_DATE - INTERVAL '1 week'
          AND "createdAt" < CURRENT_DATE
      `;

    const monthlyData: any = await this.prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
        WHERE
          "createdAt" >= CURRENT_DATE - INTERVAL '1 month'
          AND "createdAt" < CURRENT_DATE
      `;

    const allTimeData: any = await this.prisma.$queryRaw`
        SELECT
          COUNT(*)::INTEGER AS total
        FROM
          "User"
      `;

    return {
      daily: dailyData[0].total,
      weekly: weeklyData[0].total,
      monthly: monthlyData[0].total,
      allTime: allTimeData[0].total,
    };
  }
}
