import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './index';

export class UpdateServiceDto extends PartialType(CreateServiceDto) { }
