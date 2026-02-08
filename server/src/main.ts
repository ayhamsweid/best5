import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.use(
    helmet({
      // Swagger UI relies on inline scripts/styles; disable CSP to avoid a blank page.
      contentSecurityPolicy: false
    })
  );
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    credentials: true
  });
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 1000 * Number(process.env.RATE_LIMIT_WINDOW_SEC || 60),
      max: Number(process.env.RATE_LIMIT_MAX || 120)
    })
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  app.useStaticAssets(path.resolve(uploadDir), { prefix: '/uploads' });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Besiktas City Guide API')
      .setDescription('Admin + public API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(4000);
}

bootstrap();
