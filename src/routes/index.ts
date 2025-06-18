import express, { Request, Response, Router, NextFunction } from "express";
import { playerService } from "../services/player.service.js";
import { teamService } from "../services/team.service.js";
import logger from "../config/logger.js";
import { checkWebAuth } from "../middlewares/auth.middleware.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const players = await playerService.getAllPlayers();
    const teams = await teamService.getAllTeams();

    const captainCount = players.filter((p) => p.isCaptain).length;

    res.render("index", {
      title: "SportHub",
      players,
      teams,
      captainCount,
    });
  } catch (error) {
    console.error("Failed to load data for index page:", error);
    res.status(500).render("error", {
      message: "Failed to load player data.",
      error: process.env.NODE_ENV === "development" ? error : {},
    });
  }
});

router.get("/players/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playerId = req.params.id;
    const player = await playerService.getPlayerById(playerId);
    logger.info(player);
    if (!player) {
      return res.status(404).render("error", {
        message: "Player Not Found",
        error: { status: 404 },
      });
    }

    res.render("player-detail", {
      title: player.playerName,
      player: player,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/register", (req: Request, res: Response) => {
  res.render("register", { title: "Register" });
});

router.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Login" });
});
router.get("/profile", checkWebAuth, (req: AuthenticatedRequest, res: Response) => {
  res.render("profile", {
    title: "Profile",
    user: req.user,
  });
});
export default router;
