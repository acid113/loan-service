import 'reflect-metadata';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '#/app.module';
import { MESSAGES } from '#/util/constants';

const PORT = process.env.PORT || 3000;

const corsOrigins = ['http://localhost:5173', 'http://localhost:4173'];

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () => new BadRequestException({ message: MESSAGES.INVALID_REQUEST_PAYLOAD }),
    })
  );

  const config = new DocumentBuilder().setTitle('Loan API').setDescription('REST API for managing loans').setVersion('1.0.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
}

bootstrap();
