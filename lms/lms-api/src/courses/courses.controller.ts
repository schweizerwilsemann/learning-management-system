import { Controller, Post, Body, Param, Put, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RolesGuard from '../auth/roles.guard';
import Roles from '../auth/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async createCourse(@Body() body: { title: string }) {
    return this.coursesService.createCourse(body.title);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Query() query: any) {
    return this.coursesService.listCourses(query);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async updateCourse(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.updateCourse(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async publish(@Param('id') id: string) {
    return this.coursesService.publishCourse(id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async unpublish(@Param('id') id: string) {
    return this.coursesService.unpublishCourse(id);
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async analytics(@Param('id') id: string) {
    return this.coursesService.getPurchasesAndRevenue(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCourse(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.coursesService.getCourseById(id, userId);
  }
}
