import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('me')
  async findOwn(@Req() request): Promise<User> {
    const user = request.user;
    return await this.usersService.findById(user.id);
  }

  @Patch('me')
  async updateMe(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = req.user.id;
    // console.log(req.user);
    return await this.usersService.updateOneById(userId, updateUserDto);
  }
}
