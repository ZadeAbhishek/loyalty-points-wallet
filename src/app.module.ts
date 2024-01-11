import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Transaction } from './transactions/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsController } from './transactions/transactions.controller';
import { PointTableModule } from './point-table/point-table.module';
import { Point_table } from './point-table/point-table.entity';
import { PointTableController } from './point-table/point-table.controller';
@Module({
  // Importing required modules and configuring the application
  imports: [
    AuthModule, // Importing the AuthModule for authentication-related functionalities
    UsersModule, // Importing the UsersModule for user-related functionalities
    TransactionsModule, // Importing the TransactionsModule for transaction functionalities
    // TypeOrmModule.forRoot({ // Configuring TypeORM for database connection
    //   type: 'postgres', // Database type (PostgreSQL)
    //   host: 'db', // Database host
    //   port: 5432, // Database port
    //   username: 'postgres', // Database username
    //   password: 'Hacker@55', // Database password
    //   database: 'postgres', // Database name
    //   entities: [User,Transaction,Point_table], // Database entities (e.g., User entity)
    //   synchronize: true, // Auto-sync database schema (caution in production)
    //   autoLoadEntities: true, // Auto-load entities from the given directories
    // }),
    // TypeOrmModule.forFeature([User, Transaction, Point_table]),
    PointTableModule, // Importing TypeORM entities into the application
  ],
  // Registering controllers and services within the module
  controllers: [AppController, TransactionsController, PointTableController], // Controllers handling HTTP requests
  providers: [AppService], // Services used within the application
})
export class AppModule {
  constructor(private dataSource: DataSource) {} // Injecting the DataSource dependency
}
