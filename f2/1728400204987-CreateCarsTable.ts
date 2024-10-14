import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCarsTable1728400204987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cars',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            length: '36',
            default: 'UUID()',
          },
          {
            name: 'plate',
            type: 'varchar',
            length: '7',
            isNullable: false,
          },
          {
            name: 'brand',
            type: 'varchar',
            length: '45',
            isNullable: false,
          },
          {
            name: 'model',
            type: 'varchar',
            length: '90',
            isNullable: false,
          },
          {
            name: 'mileage',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'items',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'daily_price',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'deleted'],
            isNullable: false,
          },
          {
            name: 'registration_date',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'updated_time',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cars');
  }
}
