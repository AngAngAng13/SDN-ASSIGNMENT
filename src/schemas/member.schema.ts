import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        YOB: z.coerce.number().min(1900).max(new Date().getFullYear()).optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field (name or YOB) must be provided for update',
    }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];