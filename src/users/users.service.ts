import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
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

  async findManyByQuery({ query }: FindUsersDto): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (users.length === 0) {
      throw new NotFoundException('Таких пользователей нет');
    }
    return users;
  }

  async findOneByQuery(query: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOneOrFail(query);
  }

  async updateOneById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Такого пользователя нет');
    }
    if (updateUserDto.password) {
      const hashedPassword = await this.bcryptService.hashPassword(
        updateUserDto.password,
      );
      updateUserDto.password = hashedPassword;
    }
    return this.userRepository.save({ ...user, ...updateUserDto }); // оператор расширения
  }

  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
