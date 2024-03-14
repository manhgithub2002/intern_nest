import { UserService } from '../user.service';
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin: Tài khoản người dùng')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  //Admin: Tài khoản người dùng
  @Roles(UserRole.SUPRERADMIN, UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('')
  getAllUsers() {
    return this.userService.getUsers();
  }

  @Roles(UserRole.SUPRERADMIN, UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Roles(UserRole.SUPRERADMIN, UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post(':id/set-password')
  async setNewPassword(@Param('id') id: string) {
    await this.userService.adminSetNewPassword(id);

    return true;
  }
}
