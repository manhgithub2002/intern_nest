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
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginAuthDto } from './dto/loginAuth.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { FireBaseLoginResponse } from './dto/firebaseLoginResponse.dto';
import { ApiTags } from '@nestjs/swagger';
import { SendOtpDto } from './dto/sendOtp.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { ForgotPasswordOtpDto } from './dto/forgotPasswordOtp.dto';
import { recoverPasswordOtpDto } from './dto/recoverPassword.dto';

@ApiTags('Xác thực')
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

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    this.authService.sendOtpViaEmail(sendOtpDto.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordOtpDto) {
    this.authService.forgotPassword(
      forgotPasswordDto.email,
      forgotPasswordDto.otp,
    );
  }

  @Post('recover-password')
  async recoverPassword(@Body() recoverPassword: recoverPasswordOtpDto) {
    this.authService.recoverPassword(
      recoverPassword.newPassword,
      recoverPassword.email,
      recoverPassword.otp,
    );
  }
}
