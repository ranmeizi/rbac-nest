import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserOssTable1763365298103 implements MigrationInterface {
    name = 'CreateUserOssTable1763365298103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_oss\` (\`id\` varchar(36) NOT NULL, \`ossUrl\` varchar(500) NULL COMMENT 'OSS URL地址', \`user_id\` varchar(255) NOT NULL, \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_4c193a8b958f094ef8de8de5fc\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_oss\` ADD CONSTRAINT \`FK_4c193a8b958f094ef8de8de5fcd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_oss\` DROP FOREIGN KEY \`FK_4c193a8b958f094ef8de8de5fcd\``);
        await queryRunner.query(`DROP INDEX \`REL_4c193a8b958f094ef8de8de5fc\` ON \`user_oss\``);
        await queryRunner.query(`DROP TABLE \`user_oss\``);
    }

}
