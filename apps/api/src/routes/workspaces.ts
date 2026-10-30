import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { requireWorkspaceMember } from '../lib/access.js';
import { conflict, forbidden } from '../lib/errors.js';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from '../validators/workspace.js';

const router = Router();

router.use(requireAuth);

/** GET /workspaces */
router.get('/', async (req, res, next) => {
  try {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: req.user!.id },
      include: {
        workspace: {
          include: {
            _count: { select: { projects: true, members: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      workspaces: memberships.map((m) => ({
        ...m.workspace,
        role: m.role,
      })),
    });
  } catch (err) {
    next(err);
  }
});

/** POST /workspaces */
router.post('/', async (req, res, next) => {
  try {
    const body = createWorkspaceSchema.parse(req.body);

    const existing = await prisma.workspace.findUnique({
      where: { slug: body.slug },
    });
    if (existing) throw conflict('Slug already taken');

    const workspace = await prisma.workspace.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        ownerId: req.user!.id,
        members: {
          create: { userId: req.user!.id, role: 'OWNER' },
        },
      },
    });

    res.status(201).json({ workspace });
  } catch (err) {
    next(err);
  }
});

/** GET /workspaces/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const membership = await requireWorkspaceMember(req.params.id, req.user!.id);

    const workspace = await prisma.workspace.findUnique({
      where: { id: req.params.id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        _count: { select: { projects: true } },
      },
    });

    res.json({ workspace, role: membership.role });
  } catch (err) {
    next(err);
  }
});

/** PATCH /workspaces/:id */
router.patch('/:id', async (req, res, next) => {
  try {
    const membership = await requireWorkspaceMember(req.params.id, req.user!.id);
    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw forbidden('Only owners and admins can update the workspace');
    }

    const body = updateWorkspaceSchema.parse(req.body);

    const workspace = await prisma.workspace.update({
      where: { id: req.params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    res.json({ workspace });
  } catch (err) {
    next(err);
  }
});

export default router;
