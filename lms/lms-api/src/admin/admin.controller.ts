import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('analytics/purchases')
  async purchases() {
    return this.adminService.getPurchasesData();
  }

  @Get('analytics/users')
  async users() {
    return this.adminService.getUsersData();
  }
}
