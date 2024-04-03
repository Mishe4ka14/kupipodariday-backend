import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

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

  @Patch(':id')
  @UseGuards(JwtGuard)
  async changeWishInfo(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<object> {
    const userId = req.user.id;
    await this.wishesService.updateOne(userId, id, updateWishDto);
    return {};
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(@Req() req, @Param('id') id: number): Promise<object> {
    const userId = req.user.id;
    await this.wishesService.copiedOne(id, userId);
    return {};
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteWish(@Param('id') id: number, @Req() req): Promise<Wish> {
    const userId = req.user.id;
    return await this.wishesService.removeOne(id, userId);
  }
}
