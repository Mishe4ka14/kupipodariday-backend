import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}
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

  @Post('find')
  async findMany(@Body() query: FindUsersDto): Promise<User[]> {
    return await this.usersService.findManyByQuery(query);
  }

  @Get(':username')
  async findAnotherUser(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOneByUsername(username);
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() request): Promise<Wish[]> {
    const userId = request.user.id;
    return await this.wishesService.findAllWishesByUserQuery(userId);
  }

  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return await this.wishesService.findAllWishesByUserQuery(username);
  }
}
