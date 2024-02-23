import { Module } from '@nestjs/common';
import { UsersModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
