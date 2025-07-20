import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUser1751234567890 implements MigrationInterface {
    name = 'AddAvatarToUser1751234567890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(500) NULL COMMENT '用户头像URL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }
} 