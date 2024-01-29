import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Point_table } from './point-table.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column({ nullable: false })
  Name: string;

  @Column({ nullable: false })
  Password: string;

  @Column({ nullable: false })
  Email: string;

  @CreateDateColumn()
  UserCreatedTime: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToOne(() => Point_table, (point_table) => point_table.user, {
    cascade: true,
  })
  @JoinColumn()
  point_table: Point_table;
}
