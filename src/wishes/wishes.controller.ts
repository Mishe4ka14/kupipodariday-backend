import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(
    private userService: UsersService,
    private wishesService: WishesService,
  ) {}
  @Post()
  @UseGuards(JwtGuard)
  async createWish(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const userId = req.user.id;
    return await this.wishesService.create(userId, createWishDto);
  }

  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findById(id);
  }
}
