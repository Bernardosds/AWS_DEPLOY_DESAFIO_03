import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';

import ICustomer from '../interfaces/ICustomer'; 
import RentalRequest from '../../rental_requests/entities/rental_request'
@Entity('customers')
class Customer implements ICustomer{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  fullName!: string;

  @Column({ type: 'date' })
  birthDate!: Date;

  @Column({ type: 'varchar', length: 14 })
  cpf!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => RentalRequest, (rentalRequest) => rentalRequest.customer)
  rental_requests!: RentalRequest[];
}
  

export default Customer;
