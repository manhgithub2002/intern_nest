import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Mapping your success')
    .setDescription('Description document for Rest API')
    .setVersion('1.0')
    .addTag('default')
    .addTag('Xác thực')
    .addTag('Tài khoản cá nhân')
    .addTag('Admin: Tài khoản người dùng')
    .addTag('Admin: Thống kê tài khoản người dùng')
    .addTag('Admin: Tài khoản nhân viên')
    .addTag('Admin: Quản lý thẻ tags')
    .addTag('Xác thực')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () =>
    console.log(
      `SERVER STARTED ON PORT ${PORT}. ENDPOINT ON http://localhost:${PORT}`,
    ),
  );
}
bootstrap();
