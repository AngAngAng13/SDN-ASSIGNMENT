import { z } from 'zod';

export const teamSchema = z.object({
    body: z.object({
        teamName: z.string({ required_error: 'Team name is required' }).min(3),
    }),
});

export type TeamInput = z.infer<typeof teamSchema>['body'];