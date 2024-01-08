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
  import { AuthGuard } from '../auth/auth.guard';
  import { UsersService } from './users.service';
  import { EarnInDto } from 'src/Dto/earnDto';
  
  @Controller('users')
  export class UsersController {
    constructor(private userService: UsersService) {}
  
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard) // This checks if the token is valid
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
    @UseGuards(AuthGuard)
    @Get('score')
    async getCurrentScore(@Request() req) {
      try {
        const userEmail = req.user.userEmail; // Extract user email from the token payload
        console.log(req.user);
        const user = await this.userService.findOne(userEmail); // Fetch user data using the UsersService
  
        if (!user) {
          return { message: 'User not found' }; // Handle the scenario where the user doesn't exist
        }
        
        return user.Points; // Return the complete user Points
      } catch (error) {
        return { message: 'Error fetching user data' }; // Handle other potential errors
      }
    }
  
    @UseGuards(AuthGuard)
    @Put()
    async earnPoints(@Request() req, @Body() earnInDto: EarnInDto) {
      try {
        const userEmail = req.user.userEmail; // Extract user email from the token payload
        console.log(req.user.userEmail)
        const user = earnInDto.type === 'earn' ? 
          await this.userService.earn(userEmail, earnInDto.points) :
          await this.userService.burn(userEmail, earnInDto.points);
  
        if (!user) {
          return { message: 'User not found' }; // Handle the scenario where the user doesn't exist
        }
        
        return user; // Return the complete user Points
      } catch (error) {
        return { message: 'Error fetching user data' }; // Handle other potential errors
      }
    }
  }
  