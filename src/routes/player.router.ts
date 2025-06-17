import { Router } from "express";
import { playerController } from "../controllers/player.controller.js";
import { checkAuth, checkAdmin } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { playerSchema } from "../schemas/player.schema.js";
import { commentSchema } from "../schemas/comment.schema.js";

const playerRouter = Router();

// --- Public Routes ---

playerRouter.get("/search", playerController.searchPlayers);

playerRouter.get("/", playerController.getAllPlayers); 

playerRouter.get("/:id", playerController.getPlayerById);

// --- Authenticated
playerRouter.post(
    "/:playerId/comments",
    checkAuth,
    validateRequest(commentSchema),
    playerController.addComment
);

// --- Admin Only 
playerRouter.post(
    "/",
    checkAuth,
    checkAdmin,
    validateRequest(playerSchema),
    playerController.createPlayer
);
playerRouter.put(
    "/:id",
    checkAuth,
    checkAdmin,
    validateRequest(playerSchema),
    playerController.updatePlayer
);
playerRouter.delete(
    "/:id",
    checkAuth,
    checkAdmin,
    playerController.deletePlayer
);

export default playerRouter;