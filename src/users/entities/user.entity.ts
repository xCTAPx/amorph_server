import {
  Column,
  CreateDateColumn,
  Entity,
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
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  birthDate: Date;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  sex: ESex;

  @CreateDateColumn()
  createdAt: Date;
}
