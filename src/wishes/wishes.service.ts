import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
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
    const wish = await this.wishesRepository.findOneBy({ id });
    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    }
    return wish;
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const wish = await this.findById(id);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async removeOne(id: number): Promise<void> {
    await this.wishesRepository.delete(id);
  }
}
