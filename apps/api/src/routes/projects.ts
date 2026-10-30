import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import {
  requireWorkspaceMember,
  requireProjectAccess,
} from '../lib/access.js';
import { conflict } from '../lib/errors.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/project.js';

const router = Router();

router.use(requireAuth);

router.get('/workspaces/:workspaceId/projects', async (req, res, next) => {
  try {
    await requireWorkspaceMember(req.params.workspaceId, req.user!.id);

    const projects = await prisma.project.findMany({
      where: { workspaceId: req.params.workspaceId },
      include: {
        lead: { select: { id: true, name: true, email: true, avatarUrl: true } },
        _count: { select: { issues: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

router.post('/workspaces/:workspaceId/projects', async (req, res, next) => {
  try {
    await requireWorkspaceMember(req.params.workspaceId, req.user!.id);
    const body = createProjectSchema.parse(req.body);

    const existing = await prisma.project.findUnique({
      where: {
        workspaceId_key: {
          workspaceId: req.params.workspaceId,
          key: body.key,
        },
      },
    });
    if (existing) throw conflict('Project key already exists in this workspace');

    const project = await prisma.project.create({
      data: {
        name: body.name,
        key: body.key,
        description: body.description,
        status: body.status,
        leadId: body.leadId ?? null,
        workspaceId: req.params.workspaceId,
        creatorId: req.user!.id,
      },
      include: {
        lead: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
});

router.get('/projects/:id', async (req, res, next) => {
  try {
    const project = await requireProjectAccess(req.params.id, req.user!.id);

    const full = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        lead: { select: { id: true, name: true, email: true, avatarUrl: true } },
        creator: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        _count: { select: { issues: true } },
      },
    });

    res.json({ project: full });
  } catch (err) {
    next(err);
  }
});

router.patch('/projects/:id', async (req, res, next) => {
  try {
    await requireProjectAccess(req.params.id, req.user!.id);
    const body = updateProjectSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.leadId !== undefined && { leadId: body.leadId }),
      },
      include: {
        lead: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    res.json({ project });
  } catch (err) {
    next(err);
  }
});

router.delete('/projects/:id', async (req, res, next) => {
  try {
    await requireProjectAccess(req.params.id, req.user!.id);
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
