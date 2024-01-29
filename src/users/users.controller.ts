import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // Importing the AuthGuard to protect routes
import { UsersService } from './users.service'; // Importing the UsersService to interact with user data
import { TransactionRequest } from 'src/Dto/trasactionRequestDto';
import { UpdatePointsDto } from 'src/Dto/updatePointsDto';
import { error } from 'console';


// We can use centralized approch for error handling working in porgress

@Controller('users') // Controller handling user-related endpoints under '/users' route
export class UsersController {
  constructor(private userService: UsersService) {} // Injecting UsersService dependency

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.userService.findOne(req.user.userEmail); // Fetch user data using the UsersService
      return user; // Return the complete user data
    } catch (error) {
      return { message: 'Error fetching user data' }; // Handle other potential errors
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Post('transactions')
  async getTransactions(
    @Request() req,
    @Body() timeStamps: TransactionRequest,
  ) {
    return this.userService.getTransactionsForUser(
      req.user.userEmail,
      timeStamps,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Get('totalpoints')
  async getTotalPoints(@Request() req) {
    return this.userService.getPoints(req.user.userEmail).then((user)=>{return user.point_table.TotalPoints}).catch((error)=>{throw new Error(error.message)});}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) 
  @Get('validpoints')
  async getValidPoints(@Request() req) {
      return this.userService.getPoints(req.user.userEmail).then((user)=>{return user.point_table.CurrPoints}).catch((error)=>{throw new Error(error.message)});
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) 
  @Put('earnPoints')
  async earnPoints(@Request() req, @Body() updatePointsDto: UpdatePointsDto) {
      return this.userService.earnPoints(
        req.user.userEmail,
        updatePointsDto).then((message)=>{return message}).catch((error)=>{throw new Error(error.message)})
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) 
  @Put('burnPoints')
  async burnPoints(@Request() req, @Body() updatePointsDto: UpdatePointsDto):Promise<Object> {
      return this.userService.burnPoints(
        req.user.userEmail,
        updatePointsDto).then((message)=>{return message}).catch((error)=>{throw new Error(error.message)});
  }
}
