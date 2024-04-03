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
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private wishesService: WishesService,
    private wishlistService: WishlistsService,
  ) {}
  @Post()
  @UseGuards(JwtGuard)
  async createWishlist(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const userID = req.user.id;
    return await this.wishlistService.create(userID, createWishlistDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  changeWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    const userID = req.user.id;
    return this.wishlistService.updateWishlist(id, updateWishlistDto, userID);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getWishlistById(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistService.findWishlistById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteWishlist(@Param('id') id: number, @Req() req): Promise<Wishlist> {
    const userID = req.user.id;
    return await this.wishlistService.removeOne(id, userID);
  }
}
