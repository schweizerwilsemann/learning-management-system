import { Controller, Post, Put, Delete, Body, Param, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() body: { name: string }) {
    return this.categoriesService.createCategory(body.name);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.categoriesService.updateCategory(id, body.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }

  @Get()
  async list() {
    return this.categoriesService.findAll();
  }
}
