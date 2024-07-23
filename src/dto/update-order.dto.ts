import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './index';

export class UpdateOrderDto extends PartialType(CreateOrderDto) { }
