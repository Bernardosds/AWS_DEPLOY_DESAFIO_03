import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import CarStatus from '../interface/CarStatus';

@Entity('cars')
class Cars {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 7, nullable: false })
  plate?: string;

  @Column('varchar', { length: 45, nullable: false })
  brand?: string;

  @Column('varchar', { length: 90, nullable: false })
  model?: string;

  @Column('int', { unsigned: true, nullable: true })
  mileage?: number;

  @Column('int', { nullable: false })
  year?: number;

  @Column('varchar', { length: 255, nullable: false })
  items?: string;

  @Column('float', { nullable: false })
  daily_price?: number;

  @Column('enum', {
    enum: ['active', 'inactive', 'deleted'],
    nullable: false,
  })
  status?: CarStatus;

  @Column('datetime', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  registration_date?: Date;

  @Column('datetime', { nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_time?: Date;
}

export default Cars;