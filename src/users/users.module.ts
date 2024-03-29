import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WishesModule],
  providers: [UsersService, BcryptService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
