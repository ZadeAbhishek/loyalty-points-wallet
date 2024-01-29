import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

/*

Validators used in this project
1. IsEmail() : Use to check the data provided in email or not.
2. IsNotEmpty() : Altest some valu should be present
3. Match() : Check the the given regular expression
*/

export class LogInDto {
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  readonly Email: string; // User's email for login

  @IsNotEmpty()
  readonly Password: string; // User's password for login
}
