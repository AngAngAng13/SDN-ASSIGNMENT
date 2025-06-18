import { Router } from "express";
import { checkWebAuth, checkAdmin } from "../middlewares/auth.middleware.js";
import { playerService } from "../services/player.service.js";
import { teamService } from "../services/team.service.js";
import { memberService } from "../services/member.service.js";

const adminRouter = Router();

adminRouter.use(checkWebAuth, checkAdmin);

adminRouter.get("/dashboard", async (req, res, next) => {
  try {
    const players = await playerService.getAllPlayers();
    const teams = await teamService.getAllTeams();
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      players,
      teams,
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/members", async (req, res, next) => {
  try {
    const members = await memberService.getAllMembers();
    res.render("admin/members", {
      title: "Manage Members",
      members,
    });
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
