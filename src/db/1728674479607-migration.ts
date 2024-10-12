import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728674479607 implements MigrationInterface {
    name = 'Migration1728674479607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cars\` (\`id\` varchar(36) NOT NULL, \`plate\` varchar(7) NOT NULL, \`brand\` varchar(45) NOT NULL, \`model\` varchar(90) NOT NULL, \`mileage\` int UNSIGNED NULL, \`year\` int NOT NULL, \`items\` varchar(255) NOT NULL, \`daily_price\` float NOT NULL, \`status\` enum ('active', 'inactive', 'deleted') NOT NULL, \`registration_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_time\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rental_requests\` (\`id\` varchar(36) NOT NULL, \`dateRequest\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`statusRequest\` enum ('active', 'inactive', 'deleted') NOT NULL, \`cpf_pedido\` varchar(255) NULL, \`cep\` varchar(255) NULL, \`cidade\` varchar(255) NULL, \`uf\` varchar(255) NULL, \`rentalTax\` decimal(10,2) NOT NULL DEFAULT '0.00', \`totalValue\` decimal(10,2) NOT NULL DEFAULT '0.00', \`startDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`endDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`cancelDate\` timestamp(6) NULL, \`finishData\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`fine\` int NOT NULL, \`customerId\` varchar(36) NULL, \`carsId\` varchar(36) NULL, UNIQUE INDEX \`REL_0959b110c27bcf5d747d1898f5\` (\`customerId\`), UNIQUE INDEX \`REL_4bef675828863288cc61ae2b15\` (\`carsId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`birthDate\` date NOT NULL, \`cpf\` varchar(14) NOT NULL, \`email\` varchar(100) NOT NULL, \`phone\` varchar(20) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rental_requests\` ADD CONSTRAINT \`FK_0959b110c27bcf5d747d1898f54\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rental_requests\` ADD CONSTRAINT \`FK_4bef675828863288cc61ae2b15a\` FOREIGN KEY (\`carsId\`) REFERENCES \`cars\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rental_requests\` DROP FOREIGN KEY \`FK_4bef675828863288cc61ae2b15a\``);
        await queryRunner.query(`ALTER TABLE \`rental_requests\` DROP FOREIGN KEY \`FK_0959b110c27bcf5d747d1898f54\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
        await queryRunner.query(`DROP INDEX \`REL_4bef675828863288cc61ae2b15\` ON \`rental_requests\``);
        await queryRunner.query(`DROP INDEX \`REL_0959b110c27bcf5d747d1898f5\` ON \`rental_requests\``);
        await queryRunner.query(`DROP TABLE \`rental_requests\``);
        await queryRunner.query(`DROP TABLE \`cars\``);
    }

}
