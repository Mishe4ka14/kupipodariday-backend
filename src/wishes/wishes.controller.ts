import {
  Body,
  Controller,
  Delete,
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

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(@Req() req, @Param('id') id: number): Promise<object> {
    console.log('asd');
    const userId = req.user.id;
    await this.wishesService.copiedOne(id, userId);
    return {};
  }

  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findById(id);
  }

  @Delete(':id')
  async deleteWish(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.removeOne(id);
  }
}
