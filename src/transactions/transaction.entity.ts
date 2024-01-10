import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this class as an entity to be mapped to the database table
export class Transaction {
  @PrimaryGeneratedColumn() // Indicates the primary key column that auto-generates its value
  id: number; // Represents the unique identifier for the user

  @Column() // Indicates a basic column in the database
  Email: string; // Represents the email of the user

  @Column() 
  Statement: string; // Represents the statement of the user

  @Column() 
  time: string; // Represents the time of the user

}