import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGoogleOAuth2Table1755747716523 implements MigrationInterface {
    name = 'CreateGoogleOAuth2Table1755747716523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`oa_google_account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sub\` varchar(255) NOT NULL COMMENT '唯一 google侧的唯一值', \`email\` varchar(100) NOT NULL COMMENT '谷歌绑定的邮箱', \`email_verified\` tinyint NOT NULL COMMENT '邮箱是否验证', \`name\` varchar(100) NOT NULL COMMENT 'google账号,不用于username,还是要让用户自己决定', \`given_name\` varchar(50) NOT NULL COMMENT '名', \`family_name\` varchar(50) NOT NULL COMMENT '姓氏', \`user_id\` varchar(36) NOT NULL COMMENT '绑定的userid', \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_62d7ac0f2f3dd55df57efb51a7\` (\`sub\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ut_once_context\` (\`code\` varchar(36) NOT NULL, \`context\` json NOT NULL, \`ttl\` int NOT NULL, \`uniqueId\` varchar(1000) NULL COMMENT '唯一标识', \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`expires_at\` datetime NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`first_name\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`last_name\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`nickname\` varchar(100) NULL COMMENT '昵称'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email_verified\` tinyint NOT NULL COMMENT '邮箱是否验证(true->已验证 false->需要验证) 有可能系统给置成false进行验证' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`mobile\` varchar(20) NULL COMMENT '手机号'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`mobile_verified\` tinyint NOT NULL COMMENT '邮箱是否验证(true->已验证 false->需要验证) 有可能系统给置成false进行验证' DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`picture\` varchar(1000) NULL COMMENT '头像url'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`username\` varchar(100) NOT NULL COMMENT '用户名'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(100) NULL COMMENT '邮箱(邮箱作为登陆验证的用户名)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(100) NOT NULL COMMENT '邮箱'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`username\` varchar(20) NOT NULL COMMENT '用户名'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`picture\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`mobile_verified\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`mobile\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email_verified\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`nickname\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`last_name\` varchar(50) NULL COMMENT '名'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`first_name\` varchar(50) NULL COMMENT '姓氏'`);
        await queryRunner.query(`DROP TABLE \`ut_once_context\``);
        await queryRunner.query(`DROP INDEX \`IDX_62d7ac0f2f3dd55df57efb51a7\` ON \`oa_google_account\``);
        await queryRunner.query(`DROP TABLE \`oa_google_account\``);
    }

}
