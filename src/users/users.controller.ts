import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // Importing the AuthGuard to protect routes
import { UsersService } from './users.service'; // Importing the UsersService to interact with user data
import { TransactionRequest } from 'src/Dto/trasactionRequestDto';
import { UpdatePointsDto } from 'src/Dto/updatePointsDto';

@Controller('users') // Controller handling user-related endpoints under '/users' route
export class UsersController {
  constructor(private userService: UsersService) {} // Injecting UsersService dependency

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const userEmail = req.user.userEmail; // Extract user email from the token payload
      const user = await this.userService.findOne(userEmail); // Fetch user data using the UsersService

      if (!user) {
        return { message: 'User not found' }; // Handle the scenario where the user doesn't exist
      }

      return user; // Return the complete user data
    } catch (error) {
      return { message: 'Error fetching user data' }; // Handle other potential errors
    }
  }
  
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Post('transactions')
  async getTransactions(@Request() req, @Body() timeStamps : TransactionRequest) {
    console.log(timeStamps.type);
     return this.userService.getTransactionsForUser(req.user.userEmail,timeStamps);
  }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Get('totalpoints')
    async getTotalPoints(@Request() req) {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.userService.getPoints(userEmail);
            if(!user) return {message:'No user Found'}
            return (await user).point_table.TotalPoints;
    }

        @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Get('validpoints')
    async getValidPoints(@Request() req) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.userService.getPoints(userEmail);
            if(!user) return {message:'No user Found'}
            return (await user).point_table.CurrPoints; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Put('earnPoints')
    async earnPoints(@Request() req, @Body() updatePointsDto:UpdatePointsDto ) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.userService.earnPoints(userEmail,updatePointsDto.Points)
            if(!user) return {message:'No user Found'}
            return {message: `SuccessFull Updated`}; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }


    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // Protecting this endpoint with authentication
    @Put('burnPoints')
    async burnPoints(@Request() req, @Body() updatePointsDto:UpdatePointsDto ) {
        try {
            const userEmail = req.user.userEmail; // Extract user email from the token payload
            let user = this.userService.burnPoints(userEmail,updatePointsDto.Points)
            if(!user) return {message:'No user Found'}
            return {message: 'SuccessFull Updated'}; //successfull return
        }catch(error){
            return {message: 'Error in Database Please Retry'}
        }
    }

}
