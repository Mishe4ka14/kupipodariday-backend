import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minimum?: number;

  @IsNotEmpty()
  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
