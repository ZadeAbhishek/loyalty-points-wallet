import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/Dto/signUpDto';
import { LogInDto } from 'src/Dto/lognInDto';
import { UsersService } from 'src/users/users.service';

@Controller('auth') // Declaring a controller for handling authentication-related endpoints with the '/auth' route prefix
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @HttpCode(HttpStatus.OK) // Setting the HTTP response code for the following handler method
  @Post('login') // Handling POST requests to the '/auth/login' endpoint
  signIn(@Body() logInDto: LogInDto) { // Handling user sign-in
    return this.authService.signIn(logInDto); // Calling the authService to perform the sign-in operation
  }

  @Post('register') // Handling POST requests to the '/auth/register' endpoint
  signUp(@Body() signInDto: SignUpDto) { // Handling user sign-up
    return this.authService.signUp(signInDto); // Calling the authService to perform the sign-up operation
  }
}