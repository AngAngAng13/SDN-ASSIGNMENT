import { z } from 'zod';

export const commentSchema = z.object({
    body: z.object({
        content: z.string({ required_error: 'Comment content is required' }).min(5),
        rating: z.coerce.number({ required_error: 'Rating is required' }).min(1).max(3),
    }),
});

export type CommentInput = z.infer<typeof commentSchema>['body'];