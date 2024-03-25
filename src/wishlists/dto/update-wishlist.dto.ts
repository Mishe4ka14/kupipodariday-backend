import { IsString, IsUrl, IsArray, IsNumber } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
