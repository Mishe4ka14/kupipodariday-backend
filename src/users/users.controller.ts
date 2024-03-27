import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('me')
  async findOwn(@Req() user: User): Promise<User> {
    const id = user.id;
    return this.usersService.findById(id);
  }
}
