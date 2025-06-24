import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import {
  EnumVerifyCodeOperate,
  EnumVerifyCodeType,
} from './verify_code.entity';

@Entity('verify_code_log')
export class VerifyCodeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'verify_code',
    length: 100,
    comment: '验证码',
  })
  verifyCode: string;

  @Column({
    type: 'enum',
    enum: EnumVerifyCodeType,
    comment: '验证码类型 1-邮箱 2-短信',
  })
  type: EnumVerifyCodeType;

  @Column({
    type: 'enum',
    enum: EnumVerifyCodeOperate,
    comment: '操作类型 1-注册 2-重置密码 3-登陆',
  })
  operate: EnumVerifyCodeOperate;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '目标地址',
  })
  target: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'IP地址',
  })
  ip: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;
}
