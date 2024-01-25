import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ nullable: false }) // Adjust based on your database schema
  Email: string;

  @Column({ nullable: false }) // Adjust based on your database schema
  Statement: string;
  
  @CreateDateColumn({ nullable: false, default: () => 'CURRENT_TIMESTAMP' }) // Adjust based on your database schema
  CreatedTime: Date;

  @CreateDateColumn({ nullable: false, default: () => 'CURRENT_TIMESTAMP' }) // Adjust based on your database schema
  UpdatedTime: Date;

  @Column() // Adjust based on your database schema
  Type: string;

  @ManyToOne(() => User, user => user.transactions)
  user: User;
}
