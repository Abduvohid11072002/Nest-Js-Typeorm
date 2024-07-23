import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import {
  SignUpUserDto,
  SignInUserDto,
  RefreshTokenDto,
  VerifyOtpDto,
} from '../dto';


@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository,
    private readonly userService: UserService
  ){ }

  signup(signUpUserDto: SignUpUserDto) {
    return this.userService.signup(signUpUserDto);
  }

  signin(signInUserDto: SignInUserDto) {
    
  }

  otp_verify(otpDto: VerifyOtpDto) {
    return 
  }

  refresh_token(refreshTokenDto: RefreshTokenDto) {
    return 
  }

  getMe(request: any) {
    return 
  }


  logout( request: any) {
    return 
  }
}
