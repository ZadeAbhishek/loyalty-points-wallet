import {
  IsEmail,   
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength } from 'class-validator';

/*

Validators used in this project
1. IsEmail() : Use to check the data provided in email or not.
2. IsNotEmail() : Use to check if data is not the email type use to check redudancy
3. IsString(): To check if its String
4. IsAplpha(): To chech its Aplhabhet
5. MinLenght(): To check if the given lenght is more than or equal to min lenght
*/


export class SignUpDto {
  

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  readonly UserName: string; // User's chosen username for registration

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  readonly Password: string; // User's chosen password for registration
  
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
  readonly Email: string; // User's email for registration
}