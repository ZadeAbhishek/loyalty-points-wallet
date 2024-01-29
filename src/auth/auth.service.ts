import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entitys/user.entity';
import { SignUpDto } from 'src/Dto/signUpDto';
import { Point_table } from '../entitys/point-table.entity';
import { LogInDto } from 'src/Dto/lognInDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Method for user sign-in
  async signIn(logInDto: LogInDto) {
    // Find user by email
    const user = await this.usersService.findOne(logInDto.Email);

    // Check if user exists and if the provided password matches
    if (!user || user.Password !== logInDto.Password) {
      throw new UnauthorizedException(); // Throw UnauthorizedException if credentials are invalid
    }

    // Create JWT payload with user ID and email
    const payload = { sub: user.Id, userEmail: user.Email };

    // Sign the payload and return an access token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Method for user sign-up
  async signUp(signInDto: SignUpDto) {
    // Check if required fields are provided, else throw UnauthorizedException
    if (!signInDto.UserName || !signInDto.Password || !signInDto.Email) {
      throw new UnauthorizedException();
    }

    // Create a new User entity with provided details
    const user = new User();
    user.Name = signInDto.UserName;
    user.Password = signInDto.Password;
    user.Email = signInDto.Email;

    // Initialize point_table for the user
    user.point_table = new Point_table();
    user.point_table.CurrPoints = 1000; // start ammount
    user.point_table.TotalPoints = 1000;
    user.point_table.Email = signInDto.Email;

    // Create the user and return the created user
    await this.usersService.createOne(user);

    return { message: `${signInDto.UserName} Registered Successfully` };
  }
}

/* 
Of course in a real application, you wouldn't store a password in plain text. 
You'd instead use a library like bcrypt, with a salted one-way hash algorithm. 
With that approach, you'd only store hashed passwords, and then compare the stored 
password to a hashed version of the incoming password, thus never storing or exposing 
user passwords in plain text.
*/
