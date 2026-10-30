import { z } from 'zod';
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from '@cms/shared';

export const createIssueSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(10000).optional(),
  status: z.enum(ISSUE_STATUSES).optional(),
  priority: z.enum(ISSUE_PRIORITIES).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  order: z.number().optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().max(10000).nullable().optional(),
  status: z.enum(ISSUE_STATUSES).optional(),
  priority: z.enum(ISSUE_PRIORITIES).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  order: z.number().optional(),
});
