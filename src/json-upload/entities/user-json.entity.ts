import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_json')
export class UserJson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @Column({ name: 'object_key' })
  objectKey: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
