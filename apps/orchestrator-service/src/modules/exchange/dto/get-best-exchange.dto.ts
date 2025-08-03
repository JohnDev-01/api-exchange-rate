import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBestExchangeDto {
  @IsNotEmpty()
  @IsString()
  sourceCurrency: string;

  @IsNotEmpty()
  @IsString()
  targetCurrency: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}
