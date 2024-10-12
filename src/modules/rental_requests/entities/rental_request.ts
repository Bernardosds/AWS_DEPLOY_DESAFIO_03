
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import IRentalRequestEntity from "../interfaces/IRentalRequestEntity";

import { v4 as uuid } from 'uuid';
import Customer from "../../customers/entities/Customer";
import Cars from "../../cars/entities/Cars";
@Entity('rental_requests')

export default class RentalRequest implements IRentalRequestEntity {
    @PrimaryGeneratedColumn('uuid') 
    id!:string
  
    @CreateDateColumn({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    dateRequest!: Date;

    @Column('enum', {
    enum: ['active', 'inactive', 'deleted'],
    nullable: false,})
    statusRequest!: string;

    @Column({type: 'varchar', default: null})
    cep!: string;

    @Column({type: 'varchar', default: null})
    cidade!: string;
   
    @Column({type: 'varchar', default: null})
    uf!: string;
   
    @Column({type: 'decimal', precision:10, scale: 2, default: 0})
    rentalTax!: number;
   
    @Column({type: 'decimal', precision:10, scale: 2, default: 0})
    totalValue!: number;
   
    @CreateDateColumn({type: 'timestamp', nullable: true, default: null})
    startDate!: Date;
   
    @CreateDateColumn({type: 'timestamp', nullable: true, default: null})
    endDate!: Date;
   
    @DeleteDateColumn({type: 'timestamp', nullable: true})
    cancelDate!: Date
   
    @CreateDateColumn({type: 'timestamp', nullable: true})
    finishData!: Date

    @Column()
    fine!: number;

    @OneToOne(() => Customer, (customer) => customer.rentalRequest)
    @JoinColumn()
    customer!: Customer;

    @OneToOne(() => Cars, (cars) => cars.rentalRequest)
    @JoinColumn()
    cars!: Cars;
    


    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    
    }
   
    

}

