import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto';
import { Order } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order) private readonly orderModel: Repository<Order>,
  ) {}

  async findOne(id: string): Promise<Order | undefined> {
    return this.orderModel.findOne({
      where: { id },
      relations: ['user', 'service'], 
    });
  }

  async createOrder(newOrder: any) {
    const service = this.orderModel.create(newOrder);
    return await this.orderModel.save(service);
  }

  async updateOrder(id: string, updateData: UpdateOrderDto): Promise<Order> {
    await this.orderModel.update(id, updateData);
    return this.orderModel.findOne({ where: { id } });
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderModel.delete(id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find({
      relations: ['user', 'service'], 
    });
  }

}
