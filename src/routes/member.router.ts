import { Router } from 'express';
import { memberController } from '../controllers/member.controller.js';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateProfileSchema } from '../schemas/member.schema.js';

const memberRouter = Router();

memberRouter.use(checkAuth);

// Admene
memberRouter.get('/all', checkAdmin, memberController.getAllMembers);

//  authenticated user  manage profile
memberRouter.get('/me', memberController.getOwnProfile);
memberRouter.put('/me', validateRequest(updateProfileSchema), memberController.updateOwnProfile);


export default memberRouter;