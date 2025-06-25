import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVerifyCodeTable1750755620386 implements MigrationInterface {
    name = 'CreateVerifyCodeTable1750755620386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`verify_code\` (\`id\` int NOT NULL AUTO_INCREMENT, \`verify_code\` varchar(100) NOT NULL COMMENT '验证码', \`type\` enum ('1', '2') NOT NULL COMMENT '验证码类型 1-邮箱 2-短信', \`operate\` enum ('1', '2', '3') NOT NULL COMMENT '操作类型 1-注册 2-重置密码 3-登陆', \`target\` varchar(255) NOT NULL COMMENT '目标地址', \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verify_code_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`verify_code\` varchar(100) NOT NULL COMMENT '验证码', \`type\` enum ('1', '2') NOT NULL COMMENT '验证码类型 1-邮箱 2-短信', \`operate\` enum ('1', '2', '3') NOT NULL COMMENT '操作类型 1-注册 2-重置密码 3-登陆', \`target\` varchar(255) NOT NULL COMMENT '目标地址', \`ip\` varchar(50) NOT NULL COMMENT 'IP地址', \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`verify_code_log\``);
        await queryRunner.query(`DROP TABLE \`verify_code\``);
    }

}
