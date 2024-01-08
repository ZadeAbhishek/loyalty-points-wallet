import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this class as an entity to be mapped to the database table
export class User {
  @PrimaryGeneratedColumn() // Indicates the primary key column that auto-generates its value
  id: number; // Represents the unique identifier for the user

  @Column() // Indicates a basic column in the database
  Name: string; // Represents the name of the user

  @Column() 
  Password: string; // Represents the password of the user

  @Column() 
  Email: string; // Represents the email address of the user

  @Column() 
  Points: number; // Represents the points or credits associated with the user
}