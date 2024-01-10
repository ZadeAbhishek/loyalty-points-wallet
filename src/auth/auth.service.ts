import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { PointTableService } from 'src/point-table/point-table.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private pointTableService : PointTableService
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

    // Create the user and return the created user
    await  this.usersService.createOne(user);

    // register to point table
    await this.pointTableService.registerUser(email);

    return {message : `${username} Registed SuccesFull`};


  }
}

/* 
Of course in a real application, you wouldn't store a password in plain text. You'd instead use a 
library like bcrypt, with a salted one-way hash algorithm. With that approach, you'd only store hashed 
passwords, and then compare the stored password to a hashed version of the incoming password, thus never 
storing or exposing user passwords in plain text. 
*/

