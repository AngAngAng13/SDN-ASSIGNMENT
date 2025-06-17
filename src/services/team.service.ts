import Team from '../models/team.model.js';
import { ErrorWithStatus } from '../models/Errors.js';
import { TeamInput } from '../schemas/team.schema.js';

export const teamService = {
    async createTeam(input: TeamInput) {
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
            throw new ErrorWithStatus({ message: 'Team not found', status: 404 });
        }
        return team;
    },

    async updateTeam(id: string, input: Partial<TeamInput>) {
        const team = await Team.findByIdAndUpdate(id, input, { new: true }).lean();
        if (!team) {
            throw new ErrorWithStatus({ message: 'Team not found', status: 404 });
        }
        return team;
    },

    async deleteTeam(id: string) {
        const result = await Team.findByIdAndDelete(id);
        if (!result) {
            throw new ErrorWithStatus({ message: 'Team not found', status: 404 });
        }
        return { message: 'Team deleted successfully' };
    },
};