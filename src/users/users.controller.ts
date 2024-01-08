import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/auth.guard';
  import { UsersService } from './users.service';
  
  @Controller('users')
  export class UsersController {
    constructor(private userService: UsersService) {}
  
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // This checks if the token is valid
    @Get('profile')
    async getProfile(@Request() req) {
        console.log(req.user);
      try {
        const userEmail = req.user.userEmail; // Extract user email from the token payload
        console.log(userEmail);
        const user = await this.userService.findOne(userEmail); // Fetch user data using the UsersService
  
        if (!user) {
          return { message: 'User not found' }; // Handle the scenario where the user doesn't exist
        }
        
        console.log(user)
        return user; // Return the complete user data
      } catch (error) {
        return { message: 'Error fetching user data' }; // Handle other potential errors
      }
    }
  }
  