import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const { name, price, description } = createServiceDto;

      if (price < 0 || price === 0) {
        return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      const existService = await this.serviceRepository.findOneByName(name);

      if (existService) {
        return new HttpException('Already Exist', HttpStatus.BAD_REQUEST);
      }

      const newService = await this.serviceRepository.createService({
        name,
        price,
        description,
      });

      return newService;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const services = await this.serviceRepository.findAll();

      if (!services) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND)
      }
      return services;

    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const existService = await this.serviceRepository.findOne(id);

      if (!existService) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
      }
      return existService;
      
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      if (updateServiceDto?.price < 0 || updateServiceDto?.price === 0) {
        return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }

      const existService = await this.serviceRepository.findOne(id);

      if (!existService) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      const updatedService = await this.serviceRepository.updateService(
        id,
        updateServiceDto,
      );

      return updatedService;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const existService = await this.serviceRepository.findOne(id);

      if (!existService) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
      }
      
      await this.serviceRepository.deleteService(id);

      return {
        message: "Successfully deleted",
        statusCode: 200
      }

    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
