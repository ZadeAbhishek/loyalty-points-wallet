import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/transactions/transaction.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private transactionService : TransactionsService,
  ) {}

  // Fetch all users from the database
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Create a new user in the database
  async createOne(user: User) {
    return this.usersRepository.save(user);
  }

  // Find a user by their email in the database
  async findOne(email: string): Promise<User | undefined> {
    let Email = email;
    return await this.usersRepository.findOne({ where: { Email } });
  }

  // Remove a user from the database by their ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

}
