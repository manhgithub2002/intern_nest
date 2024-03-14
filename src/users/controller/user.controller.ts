import { UserService } from '../user.service';
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user.entity';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Tài khoản cá nhân')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getProfile(@Req() req) {
    console.log(req.user);

    const user = await this.userService.getUserById(req.user['sub']);

    const { id, password, ...result } = user;

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('change-password')
  async userChangePassword(@Req() req) {
    await this.userService.changePassword(
      req.user['sub'],
      req.body['newPassword'],
    );

    return true;
  }

  //Admin: Tài khoản nhân viên
}
