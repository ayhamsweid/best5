import 'dotenv/config';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { PrismaService } from './prisma/prisma.service';

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
    '/api/auth/login',
    rateLimit({
      windowMs: 1000 * 60 * 5,
      max: Number(process.env.RATE_LIMIT_LOGIN_MAX || 10),
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(
    '/api/analytics/track',
    rateLimit({
      windowMs: 1000 * 60,
      max: Number(process.env.RATE_LIMIT_TRACK_MAX || 60),
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(
    rateLimit({
      windowMs: 1000 * Number(process.env.RATE_LIMIT_WINDOW_SEC || 60),
      max: Number(process.env.RATE_LIMIT_MAX || 120)
    })
  );
  const prisma = app.get(PrismaService);
  const botRegex =
    /(googlebot|bingbot|yandexbot|duckduckbot|baiduspider|slurp|facebot|facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp|pinterest|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|applebot|claudebot|anthropic|openai|gptbot|perplexitybot|YouBot|CCBot|omgilibot|seznambot)/i;
  app.use(async (req: any, _res: any, next: any) => {
    if (req.method !== 'GET') return next();
    const pathName = req.path || '';
    if (pathName.startsWith('/api')) return next();
    if (pathName.startsWith('/uploads')) return next();
    if (pathName.startsWith('/assets')) return next();
    if (pathName === '/sitemap.xml' || pathName === '/robots.txt' || pathName === '/favicon.ico') return next();
    const ua = req.get('user-agent') || '';
    const match = ua.match(botRegex);
    if (!match) return next();
    const botName = match[0];
    try {
      await prisma.pageView.create({
        data: {
          path: pathName,
          lang: pathName.startsWith('/en') ? 'en' : pathName.startsWith('/ar') ? 'ar' : null,
          referrer: req.get('referer') || null,
          user_agent: ua || null,
          ip: req.ip,
          is_bot: true,
          bot_name: botName
        }
      });
    } catch {
      // ignore logging errors
    }
    return next();
  });
  app.use((req: any, res: any, next: any) => {
    if (!req.path.startsWith('/api')) return next();
    const method = req.method?.toUpperCase?.() || 'GET';
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();
    const allowList = ['/api/auth/login', '/api/auth/refresh'];
    if (allowList.includes(req.path)) return next();
    const hasAuthCookie = req.cookies?.access_token || req.cookies?.refresh_token;
    if (!hasAuthCookie) return next();
    const csrfCookie = req.cookies?.csrf_token;
    const csrfHeader = req.headers['x-csrf-token'];
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return res.status(403).json({ message: 'CSRF token invalid' });
    }
    return next();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'sitemap.xml', method: RequestMethod.GET }]
  });
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
