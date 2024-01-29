import { IsNumber, IsNotEmpty , IsEmail , IsOptional } from 'class-validator';

/**
 * Validator use in current proejct
 * 1. IsNumber : To check the given Data is Number
 * 2. IsNotEmpty : To check if there atleast Some value
 * 3. MinLenght : Atlest 1 point must be deducted
 */

export class UpdatePointsDto {
  @IsNotEmpty()
  @IsNumber()
  Points: number; // Number of points to be earned or added

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  ReceiverEmail: string; // Number of points to be earned or added
}
