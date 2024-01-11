import { Injectable } from '@nestjs/common';
import { Point_table } from './point-table.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transactions/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
@Injectable()
export class PointTableService {
  
    constructor(
        @InjectRepository(Point_table)
        private point_table_db: Repository<Point_table>,
        private point_db : TransactionsService
      ) {}
     
      async  getPoints(Email:string): Promise<Point_table>{
        return await this.point_table_db.findOne({ where: { Email } });
    }

    async registerUser(Email:string){
       let user = new Point_table();
       user.CurrPoints = 0;
       user.TotalPoints = 0;
       user.Email = Email;
       return await this.point_table_db.save(user);
    }

    async earnPoints(Email: string, Points: number) {
        try {
          // Get user 
          const user = await this.point_table_db.findOne({ where: { Email } });
      
          if (!user) {
            throw new Error('User not found'); // Handle case when user is not found
          }
      
          // Increment points
          user.CurrPoints += Points;
          user.TotalPoints += Points;
      
          // Update user
          await this.point_table_db.update(user.id,user);

          // add to transaction table
          createTransaction(Email,`congo Credited +${(Points)} pt`,this.point_db);
      
          return; // Success, points updated
        } catch (error) {
          // Handle errors
          console.error('Error in earning points:', error.message);
          throw new Error('Failed to earn point'); // Rethrow the error for the caller to handle
        }
      }


      async burnPoints(Email: string, Points: number) {
        try {
          // Get user 
          const user = await this.point_table_db.findOne({ where: { Email } });
      
          if (!user) {
            throw new Error('User not found'); // Handle case when user is not found
          }
      
          // Increment points
          user.CurrPoints = user.CurrPoints == 0?0:user.CurrPoints - Points;
      
          // Update user
          await this.point_table_db.update(user.id,user);

         // add to transaction table
         createTransaction(Email,`Debited -${(Points)} pt`,this.point_db);
      
          return; // Success, points updated
        } catch (error) {
          // Handle errors
          console.error('Error in earning points:', error.message);
          throw new Error('Failed to earn points'); // Rethrow the error for the caller to handle
        }
      }
   
}

// commen functiont to create transaction
async function createTransaction(Email: string, statement: string , db:TransactionsService) {
    
    try {
      const transaction = new Transaction();
      transaction.Email = Email;
      transaction.Statement = statement;
      transaction.time = new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');

      await db.createTransaction(transaction);

      return; // Success, transaction created
    } catch (error) {
      console.error('Error creating transaction:', error.message);
      throw new Error('Failed to create transaction'); // Rethrow the error for the caller to handle
    }
  }
