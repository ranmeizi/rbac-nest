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

  @Column({ type: 'varchar', length: 100, comment: '用户名' })
  username: string;

  @Column({ type: 'varchar', length: 100, comment: '昵称', nullable: true })
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
    nullable: true,
  })
  email?: string;

  @Column({
    comment:
      '邮箱是否验证(true->已验证 false->需要验证) 有可能系统给置成false进行验证',
    name: 'email_verified',
    default: false,
  })
  emailVerified: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    comment: '手机号',
    nullable: true,
  })
  mobile?: string;

  @Column({
    comment:
      '邮箱是否验证(true->已验证 false->需要验证) 有可能系统给置成false进行验证',
    name: 'mobile_verified',
    default: false,
  })
  mobileVerified: boolean;

  @Column({ type: 'varchar', length: 1000, comment: '头像url', nullable: true })
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
