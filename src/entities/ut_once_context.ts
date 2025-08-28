import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('ut_once_context')
export class OnceContextEntity {
  @PrimaryGeneratedColumn('uuid') // 独立主键（与业务无关）
  code: string;

  @Column({ type: 'json' })
  context: any;

  /** ttl 秒 */
  @Column({ type: 'int' })
  ttl: number;

  @Column({
    type: 'varchar',
    length: 1000,
    comment: '唯一标识',
    nullable: true,
  })
  uniqueId?: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'expires_at' })
  expiresAt: Date;

  @BeforeInsert()
  setExpiresAt() {
    const baseTime = new Date();
    this.expiresAt = new Date(baseTime.getTime() + this.ttl * 1000);
  }
}
