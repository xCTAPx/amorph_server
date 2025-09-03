import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ESex } from '../types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  age: number;

  @Column()
  birth_date: Date;

  @Column()
  phone_number: string;

  @Column({ default: false })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  sex: ESex;

  @Column({ nullable: true })
  confirmation_token: string;

  @Column({ nullable: true })
  restore_token: string;
}
