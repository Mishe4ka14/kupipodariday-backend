import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(
    private wishesService: WishesService,
    private offerService: OffersService,
  ) {}
  @Post()
  @UseGuards(JwtGuard)
  async createOffer(
    @Req() req,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const userId = req.user.id;
    console.log(createOfferDto.itemId);
    return await this.offerService.create(userId, createOfferDto);
  }
}
