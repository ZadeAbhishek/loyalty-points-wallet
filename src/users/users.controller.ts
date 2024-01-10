import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // Importing the AuthGuard to protect routes
import { UsersService } from './users.service'; // Importing the UsersService to interact with user data
import { EarnInDto } from 'src/Dto/earnDto'; // Importing EarnInDto for earning points

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
}
