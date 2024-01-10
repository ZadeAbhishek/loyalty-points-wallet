import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this class as an entity to be mapped to the database table
export class Point_table {
  @PrimaryGeneratedColumn() // Indicates the primary key column that auto-generates its value
  id: number; // Represents the unique identifier for the user

  @Column() // Indicates a basic column in the database
  Email: string; // Represents the email of the user

  @Column() 
  CurrPoints: number; // Represents the Current Points of the user

  @Column() 
  TotalPoints: number; // Represents the TotalPoints of the user

}