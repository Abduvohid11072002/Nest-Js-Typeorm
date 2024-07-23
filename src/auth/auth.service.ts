import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import {
  SignUpUserDto,
  SignInUserDto,
  RefreshTokenDto,
  VerifyOtpDto,
} from '../dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signup(signUpUserDto: SignUpUserDto) {
    return this.userService.signup(signUpUserDto);
  }

  async otp_verify(otpDto: VerifyOtpDto) {
    try {
      const { otp, user_id } = otpDto;

      const existUser = await this.userRepository.findOneById(user_id);

      if (!existUser) {
        return new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      const existOtp = await this.userRepository.findOneOtp(existUser.id);

      if (!existOtp) {
        return new HttpException(
          'One Time Password not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (existOtp.otp !== otp) {
        return new HttpException(
          'Your One Time Password Incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.userRepository.updateUserStatus(existUser.id);

      await this.userRepository.deleteOtp(existOtp.id);

      return {
        message: 'Correct One Time Password',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signin(signInUserDto: SignInUserDto) {
    try {
      const { email, password } = signInUserDto;

      const existUser = await this.userRepository.findOneByEmail(email);

      if (!existUser) {
        return new HttpException('Invalid Email', HttpStatus.NOT_FOUND);
      }

      const checkPassword = await bcrypt.compare(password, existUser.password);

      if (!checkPassword) {
        return new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      }

      const accessTime = this.configService.get<string>('jwt.accessTime');
      const refreshTime = this.configService.get<string>('jwt.refreshTime');

      const accessToken = this.generateToken(
        {
          id: existUser.id,
          email,
          role: existUser.role,
          username: existUser.username,
        },
        accessTime,
      );

      const refreshToken = this.generateToken(
        {
          id: existUser.id,
          email,
          role: existUser.role,
          username: existUser.username,
        },
        refreshTime,
      );

      if (!accessToken || !refreshToken) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newRefresh = await this.userRepository.createAndUpdateToken({
        refresh: refreshToken,
        user_id: existUser.id,
      });

      if (!newRefresh) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateToken(
    payload: { id: string; email: string; role: string; username: string },
    time: string,
  ) {
    return this.jwtService.sign(payload, { expiresIn: time });
  }

  async refresh_token(refreshTokenDto: RefreshTokenDto) {
    try {
      const { user_id, refresh } = refreshTokenDto;

      const existUser = await this.userRepository.findOneById(user_id);

      if (!existUser) {
        return new HttpException('User not Found', HttpStatus.BAD_REQUEST);
      }

      const decode = await this.jwtService.verify(refresh);

      if (!decode) {
        return new HttpException('You must be signin', HttpStatus.BAD_REQUEST);
      }
      const { id, email, role, username } = decode;

      const accessTime = this.configService.get<string>('jwt.accessTime');
      const refreshTime = this.configService.get<string>('jwt.refreshTime');

      const accessToken = this.generateToken(
        { id, email, role, username },
        accessTime,
      );

      const refreshToken = this.generateToken(
        { id, email, role, username },
        refreshTime,
      );

      if (!accessToken || !refreshToken) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newRefresh = await this.userRepository.createAndUpdateToken({
        refresh: refreshToken,
        user_id: existUser.id,
      });

      if (!newRefresh) {
        return new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMe(request: any) {
    try {
      const existUser = await this.userRepository.findOneById(request.user.id);

      if (!existUser) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      const { password, ...rest } = existUser;
      return { ...rest };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(request: any) {
    try {
      const existToken = await this.userRepository.findOneToken(
        request.user.id,
      );

      if (!existToken) {
        return new HttpException('Not Found Token', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.deleteToken(existToken.id);

      return {
        message: 'Logout Successfully',
        accessToken: 'logout',
        refreshToken: 'logout',
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
