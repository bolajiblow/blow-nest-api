import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Bookmarks Managment API')
    .setDescription('The API manages bookmarks')
    .setVersion('1.0')
    .addTag('bookmarks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes( new ValidationPipe(
    {
      whitelist: true
    }
  ) )
  await app.listen(4000);
}
bootstrap();
