import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { Transaction } from '../entitys/transaction.entity';
import { TransactionRequest } from 'src/Dto/trasactionRequestDto';
import { Point_table } from '../entitys/point-table.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';




enum TransactionType {
  CREDIT = "credit",
  DEBIT  = "debit"
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Transaction)
    private userTransaction: Repository<Transaction>,
    @InjectRepository(Point_table)
  private readonly pointTableRepository: Repository<Point_table>,
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
    return this.usersRepository.findOne({ where: { Email } });
  }

  // Remove a user from the database by their ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getTransactionsForUser(email: string, query : TransactionRequest): Promise<Transaction[]> {

    const user = await this.usersRepository.findOne({ relations: ['transactions'], where: { Email: email } });

    let queryBuilder = this.userTransaction.createQueryBuilder('transaction').where('transaction.user = :userId', { userId: user.Id });

    if (query.startTime) {
      const startTime = query.startTime;
      queryBuilder = queryBuilder.andWhere('transaction.UpdatedTime >= :startTime', { startTime });
    }

    if (query.endTime) {
      const endTime = query.endTime;
      queryBuilder = queryBuilder.andWhere('transaction.UpdatedTime <= :endTime', { endTime });
    }

    if(query.type){
      const Type = query.type;
      queryBuilder = queryBuilder.andWhere('transaction.Type = :Type', { Type });
    }

    return await queryBuilder.getMany();
  }

        // Save Transaction  
         async createUserTransaction(Email: string, statement: string, Type : string){
         const transaction = new Transaction();
          try {
            
            transaction.Email = Email;
            transaction.Statement = statement;
            transaction.Type = Type;
            const currUser =  await this.usersRepository.findOne({ where: { Email } }); // map user id to current transaction
            transaction.user = currUser;
            transaction.CreatedTime = currUser.UserCreatedTime;
            return await this.userTransaction.save(transaction);
      
            return; // Success, transaction created
          } catch (error) {
            console.error('Error creating transaction:', error.message);
            throw new Error('Failed to create transaction'); // Rethrow the error for the caller to handle
          }
 
         }
        
         // Find Trasaction
      async findUserTransactionsByEmail(Email: string): Promise<Transaction[]> {
             // Using findBy() method to find transactions related to a specific email
             return await this.userTransaction.find({ where: { Email } });
         }
         
         
         async  getPoints(email:string): Promise<User>{
        
          const points = await this.usersRepository.findOne({
            relations: ['point_table'],
            where: { Email: email }, // Assuming 'Email' is the property
          });
          
          return points
      }


      async earnPoints(Email: string, Points: number) {



        try {
          // Get user 
          const points = await this.usersRepository.findOne({
            relations: ['point_table'],
            where: { Email: Email }, // Assuming 'Email' is the property
          });
      
          if (!points) {
            throw new Error('User not found'); // Handle case when user is not found
          }
          
          const pointsToUpdate = {
            // Add the properties and values you want to update
            // For example:
            CurrPoints: points.point_table.CurrPoints + Points,
            TotalPoints: points.point_table.TotalPoints + Points,
            // otherProperty: 'new value',
          }
      
          // Update user
          console.log("Updated");

             // Update the point_table associated with the user
            await this.pointTableRepository.update(points.point_table.id, pointsToUpdate);


          // add to transaction table
          this.createUserTransaction(Email,`congo Credited +${(Points)} pt`,TransactionType.CREDIT)
      
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
          const points = await this.usersRepository.findOne({
            relations: ['point_table'],
            where: { Email: Email }, // Assuming 'Email' is the property
          });
      
          if (!points) {
            throw new Error('User not found'); // Handle case when user is not found
          }
          
          const pointsToUpdate = {
            // Add the properties and values you want to update
            // For example:
            CurrPoints: points.point_table.CurrPoints == 0?0:points.point_table.CurrPoints - Points,
            // otherProperty: 'new value',
          }
      
          // Update user

          //   // Get the point_table repository
          //    const pointTableRepository = Repository(Point_table);

          //    // Update the point_table associated with the user
          //   await pointTableRepository.update(points.point_table.id, pointsToUpdate);

          // // add to transaction table
          // this.createUserTransaction(Email,`Debited -${(Points)} pt`,TransactionType.DEBIT)
      
               // Update the point_table associated with the user
               await this.pointTableRepository.update(points.point_table.id, pointsToUpdate);


               // add to transaction table
               this.createUserTransaction(Email,`Debited -${(Points)} pt`,TransactionType.DEBIT)

          return; // Success, points updated
        } catch (error) {
          // Handle errors
          console.error('Error in earning points:', error.message);
          throw new Error('Failed to earn point'); // Rethrow the error for the caller to handle
        }

    

      }
}





