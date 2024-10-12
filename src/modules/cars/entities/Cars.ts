import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import CarStatus from '../interface/CarStatus';
import RentalRequest from '../../rental_requests/entities/rental_request';
@Entity('cars')
class Cars {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', length: 7, nullable: false })
  plate?: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  brand?: string;

  @Column({ type: 'varchar', length: 90, nullable: false })
  model?: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  mileage?: number;

  @Column({ type: 'int', nullable: false })
  year?: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  items?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  daily_price?: number;

  @Column('enum', {
    enum: ['active', 'inactive', 'deleted'],
    nullable: false,
  })
  status?: CarStatus;

  @OneToOne(() => RentalRequest, rentalRequest => rentalRequest.cars)
  rentalRequest!: RentalRequest;

  @Column('datetime', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  registration_date?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_time?: Date;
}

export default Cars;
