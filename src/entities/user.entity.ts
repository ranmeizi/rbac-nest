import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

export enum EnumUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, comment: '昵称' })
  nickname: string;

  @Exclude()
  @Column({ type: 'varchar', length: 64, comment: '密码' })
  password: string;

  @Exclude()
  @Column({ type: 'varchar', length: 8, comment: '盐 每次更新密码时随机生成' })
  salt: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '邮箱(邮箱作为登陆验证的用户名)',
  })
  email: string;

  @Column({ type: 'varchar', length: 1000, comment: '头像url' })
  picture: string;

  @Column({
    type: 'enum',
    enum: EnumUserStatus,
    default: EnumUserStatus.ACTIVE,
    comment: '用户状态',
  })
  status: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable() // TypeORM 会自动创建 user_roles 关联表
  roles: Promise<Role[]>;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;
}
