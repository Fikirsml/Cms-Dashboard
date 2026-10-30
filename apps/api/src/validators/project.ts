import { z } from 'zod';
import { PROJECT_STATUSES } from '@cms/shared';

const keyRegex = /^[A-Z][A-Z0-9]{1,9}$/;

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  key: z
    .string()
    .regex(keyRegex, 'Key must be 2–10 uppercase alphanumeric characters'),
  description: z.string().max(2000).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  leadId: z.string().cuid().nullable().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  leadId: z.string().cuid().nullable().optional(),
});
