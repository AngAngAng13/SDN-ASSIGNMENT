import { Response, NextFunction } from "express";
import { memberService } from "../services/member.service.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const memberController = {
    // --- Admin ---
    getAllMembers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const members = await memberService.getAllMembers();
            res.status(200).json(members);
        } catch (error) {
            next(error);
        }
    },

    // --- Authenticated Member ---
    getOwnProfile: (req: AuthenticatedRequest, res: Response) => {
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...profile } = req.user!;
        res.status(200).json(profile);
    },

    updateOwnProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const memberId = req.user!.id.toString();
            const updatedProfile = await memberService.updateMemberProfile(memberId, req.body);
            res.status(200).json(updatedProfile);
        } catch (error) {
            next(error);
        }
    },
};