import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/auth.guard'; // Importing the AuthGuard to protect routes
  import { TransactionsService } from './transactions.service';
  
  @Controller('transactions')
  export class TransactionsController {
    constructor(private transactionServices: TransactionsService) {} // Injecting UsersService dependency
  
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Get()
    async getTransactions(@Request() req) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            // Get User Data
            const usertransactions = this.transactionServices.findTransactionsByEmail(userEmail);

            if(!this.transactionServices) return {message: `No trasaction Found for ${userEmail}`};
            
            return usertransactions;
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
}
    
}
