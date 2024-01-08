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
    return this.authService.signIn(email,password);
  }

  @Post('register')
  signUp(@Body() signInDto: SignUpDto) {
    const { username, password, email} = signInDto;
    return this.authService.signUp(username, password, email);
  }
}