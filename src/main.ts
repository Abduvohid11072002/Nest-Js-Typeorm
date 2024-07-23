import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = configService.get<string>('port');

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
