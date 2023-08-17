import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaExceptionsFilter } from './exceptions-filter/prisma.exeptions-filter';
import { InvalidRelationExceptionFilter } from './exceptions-filter/invalid-relation.exception-filter';
import { CatchAllErrorsExceptionFilter } from './exceptions-filter/catch-all-errors.exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new CatchAllErrorsExceptionFilter(),
    new PrismaExceptionsFilter(),
    new InvalidRelationExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nest 10 - Video API')
    .setDescription(
      'Nest 10 made to upload videos and save db data with prisma',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(3000);
}
bootstrap();
