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
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignUpDto } from 'src/Dto/signUp';
import { LogInDto } from 'src/Dto/lognIn';
import { UsersService } from 'src/users/users.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService:UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() logInDto: LogInDto) {
    const {email, password} = logInDto;
    console.log(logInDto.email)
    return this.authService.signIn(email,password);
  }

  @Post('register')
  signUp(@Body() signInDto: SignUpDto) {
    const { username, password, email} = signInDto;
    return this.authService.signUp(username, password, email);
  }

  @UseGuards(AuthGuard) // this will check if token is valid or not
  @Get('profile')
  async getProfile(@Request() req) {
    const userEmail = req.user.email; // Extract user email from the token payload
    const user = await this.userService.findOne(userEmail); // Fetch user data using the UsersService
    return user; // Return the complete user data
  }
}