import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('me')
  async findOwn(@Req() request): Promise<User> {
    const user = request.user;
    return await this.usersService.findById(user.id);
  }
}
