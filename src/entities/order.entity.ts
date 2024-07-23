import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Service, User } from './index';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  user_id: User;

  @ManyToOne((type) => Service, { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  service_id: Service;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
  })
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}
