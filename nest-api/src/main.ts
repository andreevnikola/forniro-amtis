import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DB_CONN } from './constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Furniro API')
    .setDescription('This is the API for the Furniro web store')
    .setVersion('1.0')
    .addTag('amtis 2024s')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
