import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto';
import { OrderRepository } from './order.repository';
import { UserRepository } from 'src/user/user.repository';
import { ServiceRepository } from 'src/service/service.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const { user_id, service_id, status } = createOrderDto;

      const existUser = await this.userRepository.findOneById(user_id);

      const existService = await this.serviceRepository.findOne(service_id);

      if (!existUser || !existService) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      const newOrder = this.orderRepository.createOrder({
        user: existUser,
        service: existService,
        status,
      });
      return newOrder;
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
      const existOrder = await this.orderRepository.findAll();

      if (!existOrder) {
        return new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      return existOrder;
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
      const existOrder = await this.orderRepository.findOne(id);

      if (!existOrder) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
      return existOrder;
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const existOrder = await this.orderRepository.findOne(id);

      if (!existOrder) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      const existUser = await this.userRepository.findOneById(
        updateOrderDto?.user_id,
      );

      const existService = await this.serviceRepository.findOne(
        updateOrderDto?.service_id,
      );

      if (!existUser || !existService) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      const newOrder = await this.orderRepository.updateOrder(
        id,
        updateOrderDto,
      );

      return newOrder;
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
      const existOrder = await this.orderRepository.findOne(id);

      if (!existOrder) {
        return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      await this.orderRepository.deleteOrder(id);
      
      return {
        message: 'seccessfully deleted',
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
}
