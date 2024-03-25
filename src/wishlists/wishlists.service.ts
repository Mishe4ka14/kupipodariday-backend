import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private userService: UsersService,
    private wishService: WishesService,
  ) {}

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const user = await this.userService.findById(userId);
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
    });
    return this.wishlistRepository.save(wishlist);
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({});
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
    });
    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }
    return wishlist;
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    }
    return this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async removeOne(id: number): Promise<void> {
    await this.wishlistRepository.delete(id);
  }
}
