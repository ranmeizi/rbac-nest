import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('once_context')
export class OnceContextEntity {
  @PrimaryGeneratedColumn('uuid') // 独立主键（与业务无关）
  code: string;

  @Column({ type: 'json' })
  context: any;

  /** ttl 秒 */
  @Column({ type: 'int' })
  ttl: number;

  @Column({ type: 'varchar', length: 1000, comment: '唯一标识' })
  uniqueId?: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setExpiresAt() {
    this.expiresAt = new Date(this.createdAt.getTime() + this.ttl * 1000);
  }
}
