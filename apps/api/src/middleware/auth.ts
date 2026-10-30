import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/auth.js';
import { unauthorized } from '../lib/errors.js';

export type AuthUser = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(unauthorized('Missing or invalid Authorization header'));
  }

  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
}
