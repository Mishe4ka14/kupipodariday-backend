import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private userService: UsersService,
  ) {}

  async create(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    }
    return wish;
  }

  async findAllWishesByUserQuery(query: number | string): Promise<Wish[]> {
    const userQuery =
      typeof query === 'number'
        ? { id: query }
        : typeof query === 'string'
        ? { username: query }
        : (() => {
            throw new Error('Invalid query type');
          })();

    const wishes = await this.wishesRepository.find({
      where: { owner: userQuery },
    });
    return wishes;
  }

  async findLast(): Promise<Wish[]> {
    try {
      const wishes = await this.wishesRepository.find({
        order: { createdAt: 'DESC' },
        take: 40,
      });
      return wishes;
    } catch (error) {
      console.error('Ошибка при поиске подарков:', error);
      throw error;
    }
  }

  async findTop(): Promise<Wish[]> {
    try {
      const wishes = await this.wishesRepository.find({
        order: { copied: 'DESC' },
        take: 20,
      });
      return wishes;
    } catch (error) {
      console.error('Ошибка при поиске подарков:', error);
      throw error;
    }
  }

  // async updateOne(id: number, userID: number): Promise<void> {
  //   const wish = await this.findById(id);
  //   const user = await this.userService.findById(userID);
  //   if (!wish) {
  //     throw new NotFoundException('Подарок не найден');
  //   }
  //   // Сохраняем изменения в базе данных
  //   this.wishesRepository.create(user, wish);
  //   wish.copied += 1;
  //   await this.wishesRepository.save(wish);
  // }

  async copiedOne(id: number, userID: number): Promise<void> {
    const wish = await this.findById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    wish.copied += 1;
    await this.wishesRepository.save(wish);

    const user = await this.userService.findById(userID);

    const newWish: Wish = {
      ...wish,
      id: null,
      copied: 0,
      owner: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.create(user, newWish);
  }

  async removeOne(id: number): Promise<Wish> {
    const wish = await this.findById(id);
    if (!wish) {
      throw new Error(`Wish with id ${id} not found`);
    }
    await this.wishesRepository.delete(id);
    return wish;
  }
}
