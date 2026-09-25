import 'dotenv/config';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { PrismaService } from './prisma/prisma.service';
import { timingSafeEqual } from 'crypto';
import { csrfProtection } from './common/csrf-protection';

const secureEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
  const ssrInternalToken = process.env.SSR_INTERNAL_TOKEN?.trim() || '';
  if (process.env.NODE_ENV === 'production' && ssrInternalToken.length < 32) {
    throw new Error('SSR_INTERNAL_TOKEN must contain at least 32 characters in production');
  }
  app.set('trust proxy', Number.isInteger(trustProxyHops) && trustProxyHops > 0 ? trustProxyHops : false);
  app.use(helmet());
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
    '/api/seo/render',
    rateLimit({
      windowMs: 1000 * 60,
      max: Number(process.env.RATE_LIMIT_SEO_MAX || 30),
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(
    rateLimit({
      windowMs: 1000 * Number(process.env.RATE_LIMIT_WINDOW_SEC || 60),
      max: Number(process.env.RATE_LIMIT_MAX || 120),
      skip: (req) => {
        if (req.path.startsWith('/uploads/')) return true;
        const remoteAddress = req.socket.remoteAddress || '';
        const isPrivateDockerAddress =
          remoteAddress.startsWith('172.') ||
          remoteAddress.startsWith('10.') ||
          remoteAddress.startsWith('192.168.') ||
          remoteAddress.startsWith('::ffff:172.') ||
          remoteAddress.startsWith('::ffff:10.') ||
          remoteAddress.startsWith('::ffff:192.168.');
        const suppliedToken = typeof req.headers['x-ssr-internal-token'] === 'string'
          ? req.headers['x-ssr-internal-token']
          : '';
        return req.method === 'GET' && isPrivateDockerAddress && Boolean(ssrInternalToken) && secureEqual(suppliedToken, ssrInternalToken);
      }
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
  app.use(csrfProtection);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'sitemap.xml', method: RequestMethod.GET }]
  });
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  app.useStaticAssets(path.resolve(uploadDir), {
    prefix: '/uploads',
    setHeaders: (res, filePath) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
      const safeImage = /\.(png|jpe?g|webp|gif)$/i.test(filePath);
      if (!safeImage) {
        res.setHeader('Content-Disposition', 'attachment');
      }
    }
  });

  await app.listen(4000);
}

bootstrap();
