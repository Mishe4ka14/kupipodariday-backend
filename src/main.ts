import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true }); //добавляем cors true чтобы принимать любые запросы
  app.use(helmet());

  await app.listen(3001);
}
bootstrap();
