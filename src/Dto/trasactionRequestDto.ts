import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class TransactionRequest {

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value === '' ? undefined : value)) // Ignore empty string
    readonly startTime?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value === '' ? undefined : value)) // Ignore empty string
    readonly endTime?: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => (value === '' ? undefined : value)) // Ignore empty string
    readonly type?: string;
}
