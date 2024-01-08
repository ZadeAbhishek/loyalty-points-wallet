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

  async signIn(Email:string, pass:string) {
    let user  = await this.usersService.findOne(Email);
    if (user?.Password !== pass) {
        console.log("Exception")
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, userEmail: user.Email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


  async signUp(username, password, email) {
    if(!username || !password || !email) throw new UnauthorizedException();
    let  user = new User();
    user.Name = username;
    user.Password = password;
    user.Email = email;
    user.Points = 0;
    return this.usersService.createOne(user);
  }
}


/* 
Of course in a real application, you wouldn't store a password in plain text. You'd instead use a 
library like bcrypt, with a salted one-way hash algorithm. With that approach, you'd only store hashed 
passwords, and then compare the stored password to a hashed version of the incoming password, thus never 
storing or exposing user passwords in plain text. 
*/
