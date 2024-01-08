import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  // limit 50mb
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT || 3000);

  console.log(
    `Application is running on port: ${(await app.getUrl()).split(':').pop()}`,
  );
}
bootstrap();
