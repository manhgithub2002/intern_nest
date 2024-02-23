import { UserService } from './user.service';
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from './user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Admin: Tài khoản người dùng
  @Roles(UserRole.SUPRERADMIN, UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('admin/users')
  getAllUsers() {
    return this.userService.getUsers();
  }

  @Roles(UserRole.SUPRERADMIN, UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('admin/users/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Roles(UserRole.SUPRERADMIN, UserRole.ADMIN)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('admin/users/:id/set-password')
  async setNewPassword(@Param('id') id: string) {
    await this.userService.adminSetNewPassword(id);

    return true;
  }

  // Tài khoản cá nhân
  @UseGuards(AccessTokenGuard)
  @Get('users/me')
  async getProfile(@Req() req) {
    console.log(req.user);

    const user = await this.userService.getUserById(req.user['sub']);

    const { id, password, ...result } = user;

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('users/change-password')
  async userChangePassword(@Req() req) {
    await this.userService.changePassword(
      req.user['sub'],
      req.body['newPassword'],
    );

    return true;
  }

  //Admin: Tài khoản nhân viên
}
