import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/loginAuthDto';
import { RegisterUserDto } from './dto/registerUserDto';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { User } from '../users/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { FireBaseLoginResponse } from './dto/loginResponseDto';
import admin from '../firebaseConfig';
import { MailerService } from '@nestjs-modules/mailer';
import otpGenerator from 'otp-generator';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.getUserByUsername(
      loginAuthDto.username,
    );
    if (user && user.password === loginAuthDto.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signUp(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userService.getUserByUsername(
      registerUserDto.username,
    );

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const password = await argon2.hash(registerUserDto.password);
    console.log(password);

    const user = new User();
    user.fullname = registerUserDto.fullname;
    user.username = registerUserDto.username;
    user.email = registerUserDto.email;
    user.password = password;

    await this.userService.storeUser(user);

    return {
      accessToken: this.createToken('accessToken', user),
      refreshToken: this.createToken('refreshToken', user),
      user,
    };
  }

  async signIn(res: Response, loginAuthDto: LoginAuthDto) {
    const user = await this.userService.getUserByUsername(
      loginAuthDto.username,
    );
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(
      user.password,
      loginAuthDto.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const { password, ...results } = user;

    const refreshToken = this.createToken('refreshToken', user);
    this.sendRefreshToken('withoutFirebase', res, user, refreshToken);

    return {
      accessToken: this.createToken('accessToken', user),
      refreshToken: refreshToken,
      user: results,
    };
  }

  async SignInWithFirebase(
    firebaseLoginResponse: FireBaseLoginResponse,
    res: Response,
  ) {
    const { idToken, refreshToken } = firebaseLoginResponse;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const existingUser = await this.userService.getUserByEmail(
        decodedToken.email,
      );

      //Had account loggin with Firebase in DB
      if (existingUser && existingUser.username === '') {
        //update time,refresh token
        this.sendRefreshToken('firebase', res, existingUser, refreshToken);

        return {
          accessToken: idToken,
          refreshToken: refreshToken,
          user: existingUser,
        };
      }
      //
      else if (!existingUser) {
        //insert new user
        const newUser = new User();
        newUser.fullname = decodedToken.name;
        newUser.username = '';
        newUser.email = decodedToken.email;
        newUser.password = '';

        await this.userService.storeUser(newUser);

        this.sendRefreshToken('firebase', res, newUser, refreshToken);

        return {
          accessToken: idToken,
          refreshToken: refreshToken,
          user: newUser,
        };
      }
      //Had account login without Firebase but same email
      else {
        throw new BadRequestException('Email already exists');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signOut(user: User) {}
  createToken(type: 'accessToken' | 'refreshToken', user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
        ...(type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {}),
      },
      type === 'accessToken'
        ? { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' }
        : { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );
  }

  sendRefreshToken = (
    type: 'withoutFirebase' | 'firebase',
    res: Response,
    user: User,
    refreshToken: string,
  ) => {
    res.cookie('type', type, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.cookie(
      process.env.REFRESH_TOKEN_COOKIE_NAME as string,
      type === 'firebase'
        ? this.createToken('refreshToken', user)
        : refreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      },
    );
  };

  async refreshToken(
    res: Response,
    refreshTokenPayload: JwtPayload & { tokenVersion: number },
  ) {
    const existingUser = await this.userService.getUserById(
      refreshTokenPayload.sub,
    );

    if (
      !existingUser ||
      existingUser.tokenVersion != refreshTokenPayload.tokenVersion
    ) {
      throw new BadRequestException('User does not exist');
    }
    const { password, ...result } = existingUser;

    const accessToken = this.createToken('accessToken', existingUser);
    const refreshToken = this.createToken('refreshToken', existingUser);

    this.sendRefreshToken('withoutFirebase', res, existingUser, refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: existingUser,
    };
  }

  async sendOtpViaEmail(email: string) {
    const code = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await this.mailerService.sendMail({
      to: email,
      subject: 'Wellcome to tinaMys',
      template: './welcome',
      context: {
        name: 'TinaMys',
      },
    });
  }

  async verifyOtp(email: string, otp: string) {}

  async forgotPassword(email: string, otp: string) {}

  async recoverPassword(email: string, otp: string) {}
}
