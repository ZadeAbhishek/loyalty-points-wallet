import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * StopAtFirstError enable to stop server if recieve wrong data or unwanted data
   */
  app.useGlobalPipes(new ValidationPipe({stopAtFirstError: true})); // Enabling Validation pipelines globally to ensure correct endpoints
  await app.listen(3000);
}

bootstrap();

