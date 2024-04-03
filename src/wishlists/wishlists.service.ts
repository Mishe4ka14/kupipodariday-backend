import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
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
    const wishes = createWishlistDto.itemsId.map((id) => {
      return this.wishService.findById(id);
    });
    return Promise.all(wishes).then((items) => {
      const wishlist = this.wishlistRepository.create({
        ...createWishlistDto,
        items: items,
        owner: user,
      });
      return this.wishlistRepository.save(wishlist);
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({});
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }
    return wishlist;
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userID: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException('Такой коллекции нет');
    }
    if (userID !== wishlist.owner.id) {
      throw new NotAcceptableException('Нельзя редактировать чужие коллекции');
    }
    return this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async removeOne(id: number, userID: number): Promise<Wishlist> {
    const wishlist = await this.findWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    if (userID !== wishlist.owner.id) {
      throw new NotAcceptableException('Нельзя удалять чужие коллекции');
    }
    return this.wishlistRepository.remove(wishlist);
  }
}
