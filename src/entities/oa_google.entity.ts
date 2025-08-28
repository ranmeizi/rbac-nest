import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('oa_google_account')
export class OAuth2GoogleEntity {
  @PrimaryGeneratedColumn() // 独立主键（与业务无关）
  id: number;

  @Column({ unique: true, length: 255, comment: '唯一 google侧的唯一值' })
  sub: string;

  @Column({ type: 'varchar', length: 100, comment: '谷歌绑定的邮箱' })
  email: string;

  @Column({ comment: '邮箱是否验证', name: 'email_verified' })
  emailVerified: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'google账号,不用于username,还是要让用户自己决定',
  })
  name: string;

  @Column({ type: 'varchar', length: 50, comment: '名', name: 'given_name' })
  givenName: string;

  @Column({ type: 'varchar', length: 50, comment: '姓氏', name: 'family_name' })
  familyName: string;

  @Column({ length: 36, comment: '绑定的userid', name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;
}
