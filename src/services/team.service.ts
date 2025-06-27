import Team from "../models/team.model.js";
import { ErrorWithStatus } from "../models/Errors.js";
import { TeamInput } from "../schemas/team.schema.js";
import Player from "../models/player.model.js";
import logger from "../config/logger.js";
export const teamService = {
  async createTeam(input: TeamInput) {
    const existingTeam = await Team.findOne({
      teamName: { $regex: `^${input.teamName}$`, $options: "i" },
    });

    if (existingTeam) {
      throw new ErrorWithStatus({ message: "A team with this name already exists.", status: 409 });
    }
    const team = new Team(input);
    await team.save();
    return team;
  },

  async getAllTeams() {
    return await Team.find().lean();
  },

  async getTeamById(id: string) {
    const team = await Team.findById(id).lean();
    if (!team) {
      throw new ErrorWithStatus({ message: "Team not found", status: 404 });
    }
    return team;
  },

  async updateTeam(id: string, input: Partial<TeamInput>) {
    const team = await Team.findByIdAndUpdate(id, input, { new: true }).lean();
    if (!team) {
      throw new ErrorWithStatus({ message: "Team not found", status: 404 });
    }
    return team;
  },

  async deleteTeam(id: string) {
    const team = await Team.findById(id);
    if (!team) {
      throw new ErrorWithStatus({ message: "Team not found", status: 404 });
    }

    try {
      const playersToDelete = await Player.find({ team: team._id });
      const playerCount = playersToDelete.length;

      if (playerCount > 0) {
        await Player.deleteMany({ team: team._id });
      }

      await Team.findByIdAndDelete(id);

      return { message: `Team and ${playerCount} associated player(s) deleted successfully.` };
    } catch (error) {
      logger.error("Error during sequential deletion:", error);
      throw new ErrorWithStatus({ message: "Failed to delete team and players.", status: 500 });
    }
  },

  async getTeamPlayerCount(teamId: string): Promise<number> {
    return Player.countDocuments({ team: teamId });
  },
};
