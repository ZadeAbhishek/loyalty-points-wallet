import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private userTransaction: Repository<Transaction>,
      ) {}

      // Save Transaction  
      async createTransaction(transaction: Transaction){
         return await this.userTransaction.save(transaction);

        }
       
        // Find Trasaction
        async findTransactionsByEmail(Email: string): Promise<Transaction[]> {
            // Using findBy() method to find transactions related to a specific email
            return await this.userTransaction.find({ where: { Email } });
        }
}
