import { IsUrl, IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @Length(0, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
