import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, ILike, Not, Repository } from 'typeorm';
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

  async isUserExist(
    username: string,
    email: string,
    id?: number,
  ): Promise<boolean> {
    let existingUser;
    if (id) {
      existingUser = await this.userRepository.findOne({
        where: [
          { id: Not(id), username },
          { id: Not(id), email },
        ],
      });
    } else {
      existingUser = await this.userRepository.findOne({
        where: [{ username }, { email }],
      });
    }
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ForbiddenException('Такое имя уже есть');
      }
      if (existingUser.email === email) {
        throw new ForbiddenException('Такая почта уже есть');
      }
    }
    return !!existingUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password,
    );

    await this.isUserExist(createUserDto.username, createUserDto.email);

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
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
    if (users.length === 0) {
      throw new NotFoundException('Таких пользователей нет');
    }
    return users;
  }

  async findOneByQuery(query: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOneOrFail(query);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { username } });
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

    const { username, email } = updateUserDto;
    await this.isUserExist(username, email, id);
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async removeOne(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
