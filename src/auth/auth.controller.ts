import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpUserDto,
  SignInUserDto,
  RefreshTokenDto,
  VerifyOtpDto,
} from '../dto';
import { AuthGuard } from 'src/guards/authGuard';
import { RolesGuard } from 'src/guards/rolesGuard';
import { Role, Roles } from 'src/guards/rolesDecorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signup(signUpUserDto);
  }

  @Post('signin')
  signin(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signin(signInUserDto);
  }
  @Post('otp-verify')
  otp_verify(@Body() otpDto: VerifyOtpDto) {
    return this.authService.otp_verify(otpDto);
  }

  @Post('refresh-token')
  refresh_token(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh_token(refreshTokenDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get('getMe')
  getMe(@Req() request: Request) {
    return this.authService.getMe(request);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin,Role.User)
  @Get('logout')
  logout(@Req() request: Request) {
    return this.authService.logout(request);
  }
}
