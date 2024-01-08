<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

The purpose of this project is to learn NestJS through hands-on projects, named Loyalty Wallet App. A complete explanation of the code is provided below.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev

```


## Authentication 
### auth.controller.TypeScript
This `AuthController` handles authentication endpoints prefixed with '/auth'. The `signIn` method manages user login, extracting email and password from the request body, invoking the `authService` for authentication. The `signUp` method handles user registration, extracting username, password, and email, utilizing the `authService` to create a new user. Both methods correspond to POST requests to '/auth/login' and '/auth/register', returning appropriate responses based on authentication success or failure, all managed by the injected `AuthService` and `UsersService`. The controller ensures the HTTP response codes align with the operation status, responding with OK (200) for successful operations.
```ts 
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
    const { email, password } = logInDto; // Extracting email and password from the request body
    return this.authService.signIn(email, password); // Calling the authService to perform the sign-in operation
  }

  @Post('register') // Handling POST requests to the '/auth/register' endpoint
  signUp(@Body() signInDto: SignUpDto) { // Handling user sign-up
    const { username, password, email } = signInDto; // Extracting username, password, and email from the request body
    return this.authService.signUp(username, password, email); // Calling the authService to perform the sign-up operation
  }
}
``` 

### auth.guard.ts
This `AuthGuard`, implementing `CanActivate`, verifies incoming requests for authorization by extracting and validating a JWT token. It intercepts requests, extracts the token from the authorization header, and verifies its authenticity using the `JwtService` and a predefined secret. If the token is missing or invalid, it throws an `UnauthorizedException`, preventing unauthorized access. The verified token payload, if valid, is attached to the request object for use in subsequent route handlers. This guard ensures routes are only accessible with valid JWT tokens, enhancing security and controlling access to protected endpoints based on authentication status.
```ts
 import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extracting the request from the execution context
    const request = context.switchToHttp().getRequest();
    // Extracting the token from the request header
    const token = this.extractTokenFromHeader(request);

    // If no token is found, throw an UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verifying the token using the JwtService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      
      // 💡 Storing the payload in the request object for access in route handlers
      request['user'] = payload;
    } catch {
      // Catching any verification errors and throwing UnauthorizedException
      throw new UnauthorizedException();
    }
    
    return true;
  }

  // Function to extract the token from the Authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### auth.module.ts 
The `AuthModule` centralizes authentication functionalities by importing `UsersModule` for user operations and `JwtModule` for JWT handling. `JwtModule` is configured with a global scope, enabling its use across the application. It's provided with a secret key for token encryption and specifies token expiration (300 seconds). The module defines `AuthService` as a provider, catering to dependency injection needs. `AuthController` manages authentication routes and is accessible within this module. Additionally, `AuthService` is exported to be utilized in other modules for consistent and secure authentication processes, ensuring robustness and maintainability in handling authentication logic across the application.
```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule, // Importing the UsersModule to access user-related functionality
    JwtModule.register({ // Registering the JwtModule for JWT functionality
      global: true, // Indicates if the module is global-scoped
      secret: jwtConstants.secret, // Secret key used for signing tokens
      signOptions: { expiresIn: '300s' }, // Token expiration time set to 300 seconds (5 minutes)
    }),
  ],
  providers: [AuthService], // Providing the AuthService for dependency injection
  controllers: [AuthController], // Making the AuthController available within this module
  exports: [AuthService], // Exporting the AuthService to be used in other modules
})
export class AuthModule {} 
```

### auth.service.ts 
The `AuthService` manages user authentication with `signIn` and `signUp` methods. `signIn` validates provided credentials by fetching the user from `UsersService` based on the email, verifying the password. If the user exists and the password matches, it creates a JWT payload with user details and signs it using `JwtService`, returning an access token. For `signUp`, it ensures required fields (username, password, email) are provided, creating a new `User` entity and persisting it via `UsersService`. These methods enforce authentication security, verifying user credentials for sign-in and allowing new user registration while maintaining data integrity and secure token generation for access.
```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // Method for user sign-in
  async signIn(email: string, pass: string) {
    // Find user by email
    let user = await this.usersService.findOne(email);

    // Check if user exists and if the provided password matches
    if (!user || user.Password !== pass) {
      console.log("Exception");
      throw new UnauthorizedException(); // Throw UnauthorizedException if credentials are invalid
    }

    // Create JWT payload with user ID and email
    const payload = { sub: user.id, userEmail: user.Email };

    // Sign the payload and return an access token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Method for user sign-up
  async signUp(username: string, password: string, email: string) {
    // Check if required fields are provided, else throw UnauthorizedException
    if (!username || !password || !email) {
      throw new UnauthorizedException();
    }

    // Create a new User entity with provided details
    let user = new User();
    user.Name = username;
    user.Password = password;
    user.Email = email;
    user.Points = 0;

    // Create the user and return the created user
    return this.usersService.createOne(user);
  }
} 
```

## Users details
### user.entity.ts 
The TypeORM-decorated `User` class defines an entity for database storage, including columns for name, password, email, and points. It maps to a database table, ensuring structured data storage and retrieval for user-related information within a database management system.
```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this class as an entity to be mapped to the database table
export class User {
  @PrimaryGeneratedColumn() // Indicates the primary key column that auto-generates its value
  id: number; // Represents the unique identifier for the user

  @Column() // Indicates a basic column in the database
  Name: string; // Represents the name of the user

  @Column() 
  Password: string; // Represents the password of the user

  @Column() 
  Email: string; // Represents the email address of the user

  @Column() 
  Points: number; // Represents the points or credits associated with the user
} 
```

### users.controller.ts 
The `UsersController` manages user-related endpoints under `/users`, protected by `AuthGuard` to require authentication. `getProfile` fetches user data by email from token payload, returning user info. `getCurrentScore` retrieves user points. `earnPoints` updates points based on `EarnInDto`, adjusting user credits accordingly using `UsersService`.
```ts
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Get('score')
  async getCurrentScore(@Request() req) {
    try {
      const userEmail = req.user.userEmail; // Extract user email from the token payload
      const user = await this.userService.findOne(userEmail); // Fetch user data using the UsersService

      if (!user) {
        return { message: 'User not found' }; // Handle the scenario where the user doesn't exist
      }
      
      return user.Points; // Return the complete user Points
    } catch (error) {
      return { message: 'Error fetching user data' }; // Handle other potential errors
    }
  }

  @UseGuards(AuthGuard) // Protecting this endpoint with authentication
  @Put()
  async earnPoints(@Request() req, @Body() earnInDto: EarnInDto) {
    try {
      const userEmail = req.user.userEmail; // Extract user email from the token payload
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
```
### users.module.ts
The `UsersModule` integrates TypeORM to define `User` as a feature, providing `UsersService` for dependency injection. It exports `UsersService` and utilizes `UsersController` to manage HTTP requests.
```ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Importing the TypeORM module to define User as a feature
  providers: [UsersService], // Providing the UsersService for dependency injection
  exports: [UsersService], // Exporting UsersService to make it available to other modules if needed
  controllers: [UsersController], // Declaring the UsersController to handle HTTP requests
})
export class UsersModule {} 
```

### users.service.ts 
The `UsersService` utilizes TypeORM's repository to manage user data operations. It includes methods to retrieve all users, create new users, find users by email, remove users by ID, and handle user points. The `earn` method increments user points, while `burn` deducts points based on the provided email and points value. These operations interact with the `User` entity in the database, enabling functionalities like user creation, retrieval, and point adjustments while ensuring data integrity within the system.
```ts
import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Fetch all users from the database
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Create a new user in the database
  async createOne(user: User) {
    return this.usersRepository.save(user);
  }

  // Find a user by their email in the database
  async findOne(email: string): Promise<User | undefined> {
    let Email = email;
    return await this.usersRepository.findOne({ where: { Email } });
  }

  // Remove a user from the database by their ID
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Add points to a user's account based on their email
  async earn(email: string, points: number): Promise<User | undefined> {
    let Email = email;
    let user = this.usersRepository.findOne({ where: { Email } });
    
    (await user).Points += points;
    this.usersRepository.update((await user).id, (await user));
    
    return (await user);
  }

  // Deduct points from a user's account based on their email
  async burn(email: string, points: number): Promise<User | undefined> {
    let Email = email;
    let user = this.usersRepository.findOne({ where: { Email } });

    if ((await user).Points >= points) {
      (await user).Points -= points;
    } else {
      (await user).Points = 0;
    }
    
    this.usersRepository.update((await user).id, (await user));
    
    return (await user);
  }
}

```