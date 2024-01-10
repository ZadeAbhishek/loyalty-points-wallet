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

  // Add points to a user's account based on their email
  async earn(email: string, points: number): Promise<User | undefined> {
    let Email = email;
    let user = this.usersRepository.findOne({ where: { Email } });
    
    (await user).Points += points;
    this.usersRepository.update((await user).id, (await user));
    let transaction = new Transaction();
    transaction.Email = email;
    transaction.Statement = `Credited +${(points)} pt`;
    transaction.time = new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');
    await this.transactionService.createTransaction(transaction);
    
    
    return (await user);
  }

  // Deduct points from a user's account based on their email
  async burn(email: string, points: number): Promise<User | undefined> {
    let Email = email;
    let user = this.usersRepository.findOne({ where: { Email } });

    if ((await user).Points >= points) {
      (await user).Points -= points;
    } else {
      (await user).Points = 0;
    }
    
    this.usersRepository.update((await user).id, (await user)); // update user Points
    let transaction = new Transaction();
    transaction.Email = email;
    transaction.Statement = `Debited -${points} pt`;
    transaction.time = new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');
    await this.transactionService.createTransaction(transaction);
    
    return (await user);
  }
}
