import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import Logging from 'library/Logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors;

  // set prefix /api
  app.setGlobalPrefix('/api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJs Tutorial Api Swagger')
    .setDescription('NestJs backend')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  Logging.info(`App is running on ${await app.getUrl()}`);
}
bootstrap();
