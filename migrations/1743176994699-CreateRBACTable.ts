import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRBACTable1743176994699 implements MigrationInterface {
    name = 'CreateRBACTable1743176994699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL COMMENT '角色名', \`description\` varchar(100) NOT NULL COMMENT '角色描述', \`resource\` varchar(100) NOT NULL COMMENT '允许资源', \`action\` varchar(100) NOT NULL COMMENT '允许操作 (e.g., create, read, update, delete)', \`isSystem\` tinyint NOT NULL COMMENT '系统角色 不可修改', \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL COMMENT '角色名', \`description\` varchar(100) NOT NULL COMMENT '角色描述', \`isSystem\` tinyint NOT NULL COMMENT '系统角色 不可修改', \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permissions_permission\` (\`roleId\` int NOT NULL, \`permissionId\` int NOT NULL, INDEX \`IDX_b36cb2e04bc353ca4ede00d87b\` (\`roleId\`), INDEX \`IDX_bfbc9e263d4cea6d7a8c9eb3ad\` (\`permissionId\`), PRIMARY KEY (\`roleId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles_role\` (\`userId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_5f9286e6c25594c6b88c108db7\` (\`userId\`), INDEX \`IDX_4be2f7adf862634f5f803d246b\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`first_name\` varchar(50) NULL COMMENT '姓氏'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`last_name\` varchar(50) NULL COMMENT '名'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` ADD CONSTRAINT \`FK_b36cb2e04bc353ca4ede00d87b9\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` ADD CONSTRAINT \`FK_bfbc9e263d4cea6d7a8c9eb3ad2\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_5f9286e6c25594c6b88c108db77\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_4be2f7adf862634f5f803d246b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_4be2f7adf862634f5f803d246b8\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_5f9286e6c25594c6b88c108db77\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` DROP FOREIGN KEY \`FK_bfbc9e263d4cea6d7a8c9eb3ad2\``);
        await queryRunner.query(`ALTER TABLE \`role_permissions_permission\` DROP FOREIGN KEY \`FK_b36cb2e04bc353ca4ede00d87b9\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`update_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`create_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`last_name\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`first_name\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastName\` varchar(50) NULL COMMENT '名'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`firstName\` varchar(50) NULL COMMENT '姓氏'`);
        await queryRunner.query(`DROP INDEX \`IDX_4be2f7adf862634f5f803d246b\` ON \`user_roles_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_5f9286e6c25594c6b88c108db7\` ON \`user_roles_role\``);
        await queryRunner.query(`DROP TABLE \`user_roles_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_bfbc9e263d4cea6d7a8c9eb3ad\` ON \`role_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_b36cb2e04bc353ca4ede00d87b\` ON \`role_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`role_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}
