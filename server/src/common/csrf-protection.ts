import { Request, RequestHandler, Response, NextFunction } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT_PATHS = new Set(['/api/auth/login']);

export const csrfProtection: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.path.startsWith('/api')) return next();
  const method = req.method?.toUpperCase?.() || 'GET';
  if (SAFE_METHODS.has(method) || CSRF_EXEMPT_PATHS.has(req.path)) return next();

  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const hasAuthCookie = cookies?.access_token || cookies?.refresh_token;
  if (!hasAuthCookie) return next();

  const csrfCookie = cookies?.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];
  if (typeof csrfCookie !== 'string' || typeof csrfHeader !== 'string' || csrfCookie !== csrfHeader) {
    res.status(403).json({ message: 'CSRF token invalid' });
    return;
  }
  next();
};
