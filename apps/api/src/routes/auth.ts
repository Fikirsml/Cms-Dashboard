import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import {
  hashPassword,
  verifyPassword,
  signToken,
  publicUser,
} from '../lib/auth.js';
import { conflict, unauthorized } from '../lib/errors.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.js';

const router = Router();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

/** POST /auth/register */
router.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (existing) throw conflict('Email already registered');

    const passwordHash = await hashPassword(body.password);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: body.email.toLowerCase(),
          name: body.name,
          passwordHash,
        },
      });

      let baseSlug = slugify(body.name) || 'workspace';
      let slug = baseSlug;
      let n = 1;
      while (await tx.workspace.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${n++}`;
      }

      const workspace = await tx.workspace.create({
        data: {
          name: `${body.name}'s Workspace`,
          slug,
          ownerId: user.id,
          members: {
            create: { userId: user.id, role: 'OWNER' },
          },
        },
      });

      return { user, workspace };
    });

    const token = signToken({
      userId: result.user.id,
      email: result.user.email,
    });

    res.status(201).json({
      token,
      user: publicUser(result.user),
      workspace: result.workspace,
    });
  } catch (err) {
    next(err);
  }
});

/** POST /auth/login */
router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (!user) throw unauthorized('Invalid email or password');

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) throw unauthorized('Invalid email or password');

    const token = signToken({ userId: user.id, email: user.email });

    res.json({
      token,
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
});

/** GET /auth/me */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });
    if (!user) throw unauthorized();

    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
