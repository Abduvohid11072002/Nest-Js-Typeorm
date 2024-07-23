import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServiceDto, UpdateServiceDto } from 'src/dto';
import { Service } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(Service)
    private readonly serviceModel: Repository<Service>,
  ) { }

  async findOneByName(name: string): Promise<Service | undefined> {
    return this.serviceModel.findOne({ where: { name } });
  }

  async findOne(id: string): Promise<Service | undefined> {
    return this.serviceModel.findOneBy({ id });
  }

  async createService(newService: CreateServiceDto): Promise<Service> {
    const service = this.serviceModel.create({
      ...newService,
      price: newService.price.toString(),
    });
    return await this.serviceModel.save(service);
  }

  async updateService(id: string, updateData: UpdateServiceDto): Promise<Service> {
    await this.serviceModel.update(id, { ...updateData, price: updateData.price.toString() });
    return this.serviceModel.findOne({ where: { id } });
  }

  async deleteService(id: string): Promise<void> {
    await this.serviceModel.delete(id);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find();
  }
}
