import { Router } from 'express';
import { teamController } from '../controllers/team.controller.js';
import { checkAuth, checkAdmin } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { teamSchema } from '../schemas/team.schema.js';

const teamRouter = Router();

teamRouter.use(checkAuth, checkAdmin);

teamRouter.route('/')
    .get(teamController.getAllTeams)
    .post(validateRequest(teamSchema), teamController.createTeam);

teamRouter.route('/:id')
    .get(teamController.getTeamById)
    .put(validateRequest(teamSchema), teamController.updateTeam)
    .delete(teamController.deleteTeam);

export default teamRouter;