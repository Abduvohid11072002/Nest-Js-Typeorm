import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refresh: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
