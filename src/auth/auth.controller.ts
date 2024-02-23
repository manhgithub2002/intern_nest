import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUserDto';
import { LoginAuthDto } from './dto/loginAuthDto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { FireBaseLoginResponse } from './dto/loginResponseDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signUp(registerUserDto);
  }
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginAuthDto: LoginAuthDto,
  ) {
    return this.authService.signIn(res, loginAuthDto);
  }
  @Post('login-firebase')
  async SignInWithFirebase(@Req() req, @Res() res) {
    return this.authService.SignInWithFirebase(
      req.body as FireBaseLoginResponse,
      res,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req) {
    this.authService.signOut(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async sendRefreshToken(@Req() req, @Res() res) {
    const temp = await this.authService.refreshToken(
      res,
      req.user as JwtPayload & { tokenVersion: number },
    );
    return res.send(temp);
  }
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user['sub'];
  }

  @Post('send-otp')
  async sendOtp(@Req() req) {
    this.authService.sendOtpViaEmail(req.body.email as string);
  }

  @Post('verify-otp')
  async verifyOtp(@Req() req) {
    this.authService.verifyOtp(
      req.body.email as string,
      req.body.otp as string,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Req() req) {
    this.authService.forgotPassword(
      req.body.email as string,
      req.body.otp as string,
    );
  }

  @Post('recover-password')
  async recoverPassword(@Req() req) {
    this.authService.recoverPassword(
      req.body.email as string,
      req.body.otp as string,
    );
  }
}
