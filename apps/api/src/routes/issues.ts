import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { requireProjectAccess } from '../lib/access.js';
import { notFound } from '../lib/errors.js';
import { createIssueSchema, updateIssueSchema } from '../validators/issue.js';
import { formatIssueKey } from '@cms/shared';

const router = Router();

router.use(requireAuth);

const userSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
} as const;

router.get('/projects/:projectId/issues', async (req, res, next) => {
  try {
    const project = await requireProjectAccess(
      req.params.projectId,
      req.user!.id,
    );

    const issues = await prisma.issue.findMany({
      where: { projectId: project.id },
      include: {
        assignee: { select: userSelect },
        reporter: { select: userSelect },
      },
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({
      issues: issues.map((issue) => ({
        ...issue,
        key: formatIssueKey(project.key, issue.number),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/projects/:projectId/issues', async (req, res, next) => {
  try {
    const project = await requireProjectAccess(
      req.params.projectId,
      req.user!.id,
    );
    const body = createIssueSchema.parse(req.body);

    const issue = await prisma.$transaction(async (tx) => {
      const last = await tx.issue.findFirst({
        where: { projectId: project.id },
        orderBy: { number: 'desc' },
        select: { number: true },
      });
      const number = (last?.number ?? 0) + 1;

      return tx.issue.create({
        data: {
          number,
          title: body.title,
          description: body.description,
          status: body.status,
          priority: body.priority,
          order: body.order ?? 0,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
          assigneeId: body.assigneeId ?? null,
          projectId: project.id,
          reporterId: req.user!.id,
        },
        include: {
          assignee: { select: userSelect },
          reporter: { select: userSelect },
        },
      });
    });

    res.status(201).json({
      issue: {
        ...issue,
        key: formatIssueKey(project.key, issue.number),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/issues/:id', async (req, res, next) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: req.params.id },
      include: {
        project: true,
        assignee: { select: userSelect },
        reporter: { select: userSelect },
      },
    });
    if (!issue) throw notFound('Issue not found');

    await requireProjectAccess(issue.projectId, req.user!.id);

    res.json({
      issue: {
        ...issue,
        key: formatIssueKey(issue.project.key, issue.number),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/issues/:id', async (req, res, next) => {
  try {
    const existing = await prisma.issue.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    });
    if (!existing) throw notFound('Issue not found');

    await requireProjectAccess(existing.projectId, req.user!.id);
    const body = updateIssueSchema.parse(req.body);

    const issue = await prisma.issue.update({
      where: { id: existing.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.dueDate !== undefined && {
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        }),
      },
      include: {
        assignee: { select: userSelect },
        reporter: { select: userSelect },
        project: true,
      },
    });

    res.json({
      issue: {
        ...issue,
        key: formatIssueKey(issue.project.key, issue.number),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/issues/:id', async (req, res, next) => {
  try {
    const existing = await prisma.issue.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw notFound('Issue not found');

    await requireProjectAccess(existing.projectId, req.user!.id);
    await prisma.issue.delete({ where: { id: existing.id } });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
