import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger, RawBodyRequest } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // ¡Esto es crucial!
  });

  // Configura manualmente solo los parsers necesarios
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Ejemplo')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth() // 👈 añade esquema Bearer
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Accede a la documentación en /api

  await app.listen(3000);
  Logger.log(`App running on: ${await app.getUrl()}`);
}
bootstrap();
