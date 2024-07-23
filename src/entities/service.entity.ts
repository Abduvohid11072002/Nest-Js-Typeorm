import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false, })
    description: string;

    @Column({ nullable: false, type: 'decimal' })
    price: string;

}
