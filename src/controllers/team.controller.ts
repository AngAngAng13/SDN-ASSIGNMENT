import { Request, Response, NextFunction } from 'express';
import { teamService } from '../services/team.service.js';

export const teamController = {
    createTeam: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const team = await teamService.createTeam(req.body);
            res.status(201).json(team);
        } catch (error) {
            next(error);
        }
    },
    getAllTeams: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const teams = await teamService.getAllTeams();
            res.status(200).json(teams);
        } catch (error) {
            next(error);
        }
    },
    getTeamById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const team = await teamService.getTeamById(req.params.id);
            res.status(200).json(team);
        } catch (error) {
            next(error);
        }
    },
    updateTeam: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const team = await teamService.updateTeam(req.params.id, req.body);
            res.status(200).json(team);
        } catch (error) {
            next(error);
        }
    },
    deleteTeam: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await teamService.deleteTeam(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};