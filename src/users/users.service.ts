import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entitys/user.entity';
import { Transaction } from '../entitys/transaction.entity';
import { TransactionRequest } from 'src/Dto/trasactionRequest.dto';
import { Point_table } from '../entitys/point-table.entity';
import { UpdatePointsDto } from 'src/Dto/updatePoints.dto';

enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit"
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
  // There is no control associated with this
  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find().catch((error) => {
        console.error('Error finding all users:', error.message);
        throw new Error('Problem finding all users');
      });
    } catch (error) {
      console.error('Error finding all users:', error.message);
      throw new Error('Problem finding all users');
    }
  }

  // Create a new user in the database
  async createOne(user: User): Promise<User> {
    try {
      return this.usersRepository.save(user).catch((error) => {
        console.error('Error creating user:', error.message);
        throw new Error('Problem creating user');
      });
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Problem creating user');
    }
  }

  // Find a user by their email in the database
  async findOne(Email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { Email } });

      if (!user) {
        throw new NotFoundException(`${Email} not found`);
      }

      return user;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw new Error('Problem finding user by email');
    }
  }

  // Remove a user from the database by their ID
  // Not in use currently
  async remove(id: number): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      console.error('Error removing user:', error.message);
      throw new Error('Problem removing user');
    }
  }

  /**
   * @param email
   * @param query
   * @returns All transactions or transactions according to parameter
   */
  async getTransactionsForUser(email: string, query: TransactionRequest): Promise<Transaction[]> {
    try {
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

      if (query.type) {
        const Type = query.type;
        queryBuilder = queryBuilder.andWhere('transaction.Type = :Type', { Type });
      }

      if (query.senderEmail) {
        const SenderId = query.senderEmail;
        queryBuilder = queryBuilder.andWhere('transaction.SenderId = :SenderId', { SenderId });
      }

      return queryBuilder.getMany().catch((error) => {
        console.error('Error searching transactions:', error.message);
        throw new Error('Problem searching transactions');
      });
    } catch (error) {
      console.error('Error getting transactions for user:', error.message);
      throw new Error('Problem getting transactions for user');
    }
  }

  /**
   * @param statement
   * @param Type
   * @param senderUser
   * @param recieverUser
   * @returns Transaction object
   */
  async createUserTransaction(
    statement: string,
    Type: string,
    senderUser: User,
    recieverUser?: User
  ): Promise<Transaction> {
    try {
      const Email = senderUser.Email;
      const currUser = await this.usersRepository.findOne({ where: { Email } });

      const transaction = this.userTransaction.create({
        Email,
        Statement: statement,
        Type: Type,
        user: senderUser,
        CreatedTime: currUser.UserCreatedTime,
        SenderId: Type === TransactionType.CREDIT ? recieverUser?.Email : senderUser.Email,
        RecieverId: Type === TransactionType.CREDIT ? senderUser.Email : recieverUser?.Email,
      });

      return this.userTransaction.save(transaction).catch((error) => {
        console.error('Error creating transaction:', error.message);
        throw new Error('Failed to create transaction');
      });
    } catch (error) {
      console.error('Error creating transaction:', error.message);
      throw new Error('Failed to create transaction');
    }
  }

  // Find Transaction
  // Currently not in use
  async findUserTransactionsByEmail(Email: string): Promise<Transaction[]> {
    try {
      return this.userTransaction.find({ where: { Email } });
    } catch (error) {
      console.error('Error finding user transactions by email:', error.message);
      throw new Error('Problem finding user transactions by email');
    }
  }

  /**
   * @param email
   * @returns Points of User
   */
  async getPoints(email: string): Promise<User> {
    try {
      return this.usersRepository.findOne({
        relations: ['point_table'],
        where: { Email: email },
      });
    } catch (error) {
      console.error('Error getting points:', error.message);
      throw new Error('Problem getting points');
    }
  }

  /**
   * Function to earn points
   * @param Email
   * @param Points
   * @returns Success message
   */
  async earnPoints(Email: string, updatePointsDto: UpdatePointsDto): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['point_table'],
        where: { Email: Email },
      });

      if (!user) {
        return `${Email} not found`;
      }

      const pointsToUpdate = {
        CurrPoints: user.point_table.CurrPoints + updatePointsDto.Points,
        TotalPoints: user.point_table.TotalPoints + updatePointsDto.Points,
      };

      await this.pointTableRepository.update(user.point_table.id, pointsToUpdate);
      this.createUserTransaction(`Credited +${updatePointsDto.Points} pt`, TransactionType.CREDIT, user, user);

      return `${Email} credit successful`;
    } catch (error) {
      console.error('Error earning points:', error.message);
      throw new Error('Failed to earn points');
    }
  }

  /**
   * @param Email
   * @param updatePointsdto
   * @returns Success message
   */
  async burnPoints(Email: string, updatePointsdto: UpdatePointsDto): Promise<string> {
    try {
      // Check if the sender and receiver are the same, which is not possible.
      if (Email == updatePointsdto.ReceiverEmail) {
        return 'Receiver and sender both are the same. Please change.';
      }

      const user = await this.usersRepository.findOne({
        relations: ['point_table'],
        where: { Email: Email },
      });

      if (!user) {
        return `${Email} not found. Please check email and connection`;
      }

      // Check the current user point table and balance
      if (user.point_table.CurrPoints < updatePointsdto.Points) {
        return 'Insufficient Balance';
      }

      const receiverUser = await this.usersRepository.findOne({
        relations: ['point_table'],
        where: { Email: updatePointsdto.ReceiverEmail },
      });

      if (!receiverUser) {
        return `${updatePointsdto.ReceiverEmail} not found. Please check email address`;
      }

      const userPointsToUpdate = {
        CurrPoints: user.point_table.CurrPoints - updatePointsdto.Points,
      };

      await this.pointTableRepository.update(user.point_table.id, userPointsToUpdate);
      this.createUserTransaction(`Debited -${updatePointsdto.Points} pt`, TransactionType.DEBIT, user, receiverUser);

      const receiverPointsToUpdate = {
        CurrPoints: receiverUser.point_table.CurrPoints + updatePointsdto.Points,
        TotalPoints : receiverUser.point_table.TotalPoints + updatePointsdto.Points
        
      };

      await this.pointTableRepository.update(receiverUser.point_table.id, receiverPointsToUpdate);
      this.createUserTransaction(`Credited +${updatePointsdto.Points} pt`, TransactionType.CREDIT, receiverUser, user);

      return `${Email} debit successful`;
    } catch (error) {
      console.error('Error burning points:', error.message);
      throw new Error('Failed to burn points');
    }
  }
}
