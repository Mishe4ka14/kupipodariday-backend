import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return user;
  }

  async findByQuery({ query }: FindUsersDto): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (users.length === 0) {
      throw new NotFoundException('Таких пользователей нет');
    }
    return users;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    return this.userRepository.save({ ...user, ...updateUserDto }); // оператор расширения
  }

  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
