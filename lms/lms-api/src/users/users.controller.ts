import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/purchases')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user purchases (course ids)' })
  getPurchases(@Param('id') id: string, @Req() req) {
    // Debug: log user identity and requested id
    // eslint-disable-next-line no-console
    console.log('[GET purchases] req.user=', req.user, ' requested id=', id);

    // Ensure user can only access their own purchases
    if (req.user.id !== id) {
      // eslint-disable-next-line no-console
      console.log('[GET purchases] unauthorized: req.user.id=', req.user.id, ' id=', id);
      throw new UnauthorizedException('You can only access your own purchases');
    }
    return this.usersService.getUserPurchases(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: any, @Req() req) {
    // Ensure user can only update their own profile
    if (req.user.id !== id) {
      throw new UnauthorizedException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string, @Req() req) {
    // Ensure user can only delete their own account
    if (req.user.id !== id) {
      throw new UnauthorizedException('You can only delete your own account');
    }
    return this.usersService.remove(id);
  }
}

