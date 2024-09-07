import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DB_CONN } from './constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.setGlobalPrefix('api');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Furniro API')
    .setDescription('This is the API for the Furniro web store')
    .setVersion('1.0')
    .addTag('amtis 2024s')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    '/api/stripe/webhook',
    require('body-parser').raw({ type: 'application/json' }),
  );
  await app.listen(3000);
}
bootstrap();
