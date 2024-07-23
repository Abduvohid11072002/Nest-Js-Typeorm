import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpUserDto } from 'src/dto';
import { UserRepository } from './user.repository';
import * as bcrypt from "bcrypt";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) { }
  
  async signup(signUpUserDto: SignUpUserDto) {
    try {
      const { email, password, ...rest } = signUpUserDto;

      const existUser = await this.userRepository.findOneByEmail(email);

      if (existUser) {
        return new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const bcryptSalt = Number(this.configService.get<string>('salt'));

      const hashedPassword = await bcrypt.hash(password, bcryptSalt);

      const newUser = await this.userRepository.createUser({
        password: hashedPassword,
        email,
        ...rest,
      });

      const otp = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');

      await this.mailerService.sendMail({
        to: email,
        subject: 'Your One Time Password ✔',
        html: `<h2>${otp}</h2>`,
      });

      await this.userRepository.createOtp({ user_id: newUser.id, otp });

      return {
        message: 'Successfully created',
        id: newUser.id,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
