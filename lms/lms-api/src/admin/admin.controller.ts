import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RolesGuard from '../auth/roles.guard';
import Roles from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
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
