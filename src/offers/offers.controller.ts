import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private offerService: OffersService) {}
  @Post()
  @UseGuards(JwtGuard)
  async createOffer(
    @Req() req,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const userId = req.user.id;
    return await this.offerService.create(userId, createOfferDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll(): Promise<Offer[]> {
    return this.offerService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: number): Promise<Offer> {
    return this.offerService.findOfferById(id);
  }
}
