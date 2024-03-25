import {
  IsString,
  IsUrl,
  IsNumber,
  Min,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @IsOptional()
  @IsString()
  description: string;
}
