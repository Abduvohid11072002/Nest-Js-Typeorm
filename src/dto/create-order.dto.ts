import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  service_id: string;

  @IsNotEmpty()
  @IsEnum(['PENDING', 'COMPLETED', 'CANCELLED'])
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}
