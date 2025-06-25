import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum EnumVerifyCodeType {
  邮箱 = 1,
  短信 = 2,
}

export enum EnumVerifyCodeOperate {
  注册 = 1,
  重制密码 = 2,
  登陆 = 3,
}

@Entity('verify_code')
export class VerifyCode {
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

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;
}
