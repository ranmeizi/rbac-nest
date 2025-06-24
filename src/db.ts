import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { VerifyCode } from './entities/verify_code.entity';
import { VerifyCodeLog } from './entities/verify_code_log.entity';

// 加载对应环境的 .env 文件
if (!process.env.DB_HOST) {
  config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV, process.env);

// TypeORM DataSource 配置
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, Permission, VerifyCode, VerifyCodeLog],
  migrations: ['migrations/*.ts'],
  synchronize: false, // 生产环境必须设为 false
  logging: process.env.NODE_ENV === 'development',
};

// 创建 DataSource 实例 (用于迁移和 CLI 命令)
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
