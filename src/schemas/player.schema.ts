import { z } from 'zod';

export const playerSchema = z.object({
    body: z.object({
        playerName: z.string({ required_error: 'Player name is required' }).min(2),
        image: z.string({ required_error: 'Image URL is required' }).url(),
        cost: z.coerce.number({ required_error: 'Cost is required' }).min(0),
        isCaptain: z.boolean().optional().default(false),
        information: z.string({ required_error: 'Information is required' }),
        team: z.string({ required_error: 'Team ID is required' }), 
    }),
});

export type PlayerInput = z.infer<typeof playerSchema>['body'];