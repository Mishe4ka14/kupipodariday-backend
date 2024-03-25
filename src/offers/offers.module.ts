import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}