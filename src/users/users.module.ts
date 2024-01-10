import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),TransactionsModule ], // Importing the TypeORM module to define User as a feature
  providers: [UsersService], // Providing the UsersService for dependency injection
  exports: [UsersService], // Exporting UsersService to make it available to other modules if needed
  controllers: [UsersController], // Declaring the UsersController to handle HTTP requests
})
export class UsersModule {}
