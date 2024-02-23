import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  // app.use(new ValidationPipe());

  await app.listen(PORT, () =>
    console.log(
      `SERVER STARTED ON PORT ${PORT}. ENDPOINT ON http://localhost:${PORT}`,
    ),
  );
}
bootstrap();
