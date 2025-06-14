import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos (imágenes)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);

  // dentro de bootstrap
  Logger.log(`App running on: ${await app.getUrl()}`);
  Logger.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
}
bootstrap();
