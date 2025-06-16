import Player from "../models/player.model.js";
import { ErrorWithStatus } from "../models/Errors.js";
export const playerService = {
    async getAllPlayers() {
        const players = await Player.find().select(
            { playerName: 1, image: 1, team: 1 } 
        ).populate('team').lean();
        return players;
    },
    async getPlayerById(id: string) {
        const player = await Player.findById(id).lean();
        if (!player) {
            throw new ErrorWithStatus({ message: 'Player not found', status: 404 });
        }   

        return player;
    },
    async searchPlayersByName(name: string) {
        const players = await Player.find({ playerName: { $regex: name, $options: 'id' } })
            .select({ playerName: 1, image: 1, team: 1 })
            .populate('team')
            .lean();
            
        if (players.length === 0) {
            throw new ErrorWithStatus({ message: 'No players found', status: 404 });
        }
        return players;
    }

}