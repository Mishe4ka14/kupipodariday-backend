import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly wishService: WishesService,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const user = await this.userService.findById(userId);
    const wish = await this.wishService.findById(createOfferDto.itemId);
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    return this.offersRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find();
  }

  async findById(id: number): Promise<Offer> {
    const wish = await this.offersRepository.findOneBy({ id });
    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    }
    return wish;
  }
}
