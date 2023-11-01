import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  refresh_token: string;

  @Column()
  email: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  create_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
