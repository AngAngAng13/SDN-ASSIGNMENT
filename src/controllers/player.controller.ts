import { Request, Response, NextFunction } from "express";
import { playerService } from "../services/player.service.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import logger from "../config/logger.js";

export const playerController = {
  // --- Public ---
  searchPlayers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({ message: 'Search query "name" is required' });
        return;
      }
      const players = await playerService.searchPlayersByName(name as string);
      res.status(200).json(players);
    } catch (error) {
      next(error);
    }
  },
  getAllPlayers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teamName = req.query.teamName as string | undefined;
      const players = await playerService.getAllPlayers(teamName);
      res.status(200).json(players);
    } catch (error) {
      next(error);
    }
  },

  getPlayerById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playerService.getPlayerById(req.params.id);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  },

  // --- Admin ---
  createPlayer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playerService.createPlayer(req.body);
      res.status(201).json(player);
    } catch (error) {
      next(error);
    }
  },
  updatePlayer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playerService.updatePlayer(req.params.id, req.body);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  },
  deletePlayer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await playerService.deletePlayer(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  // --- Authenticated  ---
  addComment: async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    try {
      logger.info("authReq.user:", authReq);

      const memberId = authReq.user!.id.toString();
      const playerId = authReq.params.playerId;
      const player = await playerService.addComment(playerId, memberId, authReq.body);
      res.status(201).json(player);
    } catch (error) {
      logger.error("Failed to add comment:", error);
      next(error);
    }
  },
};
