import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}
  async auth(user: User) {
    const { username, id: sub } = user;

    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }

  async validatePassword(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByQuery({
      select: { username: true, password: true, id: true },

      where: { username },
    });

    console.log(password);
    if (
      user &&
      (await this.bcryptService.comparePasswords(password, user.password))
    ) {
      /* Исключаем пароль из результата */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return user;
    }

    return null;
  }
}
