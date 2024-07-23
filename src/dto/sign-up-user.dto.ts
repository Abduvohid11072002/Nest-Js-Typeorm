import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';
}
