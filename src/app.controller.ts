import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Defines this class as a controller
export class AppController {
  constructor(private readonly appService: AppService) {} // Injects the AppService into the controller

  @Get() // Handles GET requests to the root route ('/')
  getHello(): string {
    return this.appService.getHello(); // Calls the getHello method from AppService
  }
}
