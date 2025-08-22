import { Controller, Post, Body, Param, Put, Delete, Get, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async createCourse(@Body() body: { title: string }) {
    return this.coursesService.createCourse(body.title);
  }

  @Get()
  async list(@Query() query: any) {
    return this.coursesService.listCourses(query);
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.updateCourse(id, body);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    return this.coursesService.publishCourse(id);
  }

  @Post(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    return this.coursesService.unpublishCourse(id);
  }

  @Get(':id/analytics')
  async analytics(@Param('id') id: string) {
    return this.coursesService.getPurchasesAndRevenue(id);
  }

  @Get(':id')
  async getCourse(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.coursesService.getCourseById(id, userId);
  }
}
