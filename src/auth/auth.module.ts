import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local/local.strategy';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,

    // регистрируем JwtModule асинхронно
    JwtModule.registerAsync({
      // импортируем ConfigModule для использования его внутри JwtModule
      imports: [ConfigModule],

      // фабрика для настройки JwtModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'), // получаем ключ из конфигурации
        signOptions: {
          expiresIn: configService.get<string>('jwt.ttl', '3000s'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, BcryptService],
  controllers: [AuthController],
})
export class AuthModule {}
