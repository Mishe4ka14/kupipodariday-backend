import {
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 64)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Length(0, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
