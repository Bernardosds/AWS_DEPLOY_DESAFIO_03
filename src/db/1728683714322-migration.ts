import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1728683714322 implements MigrationInterface {
    name = 'Migration1728683714322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`registration_date\` \`registration_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`updated_time\` \`updated_time\` datetime NULL ON UPDATE CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`updated_time\` \`updated_time\` datetime NULL DEFAULT 'NULL' ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`cars\` CHANGE \`registration_date\` \`registration_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
    }

}
