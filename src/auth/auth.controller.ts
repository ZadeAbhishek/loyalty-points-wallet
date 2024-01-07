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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log(signInDto.username, signInDto.password)
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @UseGuards(AuthGuard) // this will check if token is valid or not
  @Get('profile')
  getProfile(@Request() req) {

    return req.user;
  }
}