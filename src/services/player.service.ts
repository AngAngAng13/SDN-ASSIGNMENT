import Player from "../models/player.model.js";
import Team from "../models/team.model.js";
import { ErrorWithStatus } from "../models/Errors.js";
import { PlayerInput } from "../schemas/player.schema.js";
import { CommentInput } from "../schemas/comment.schema.js";
import mongoose from "mongoose";

export const playerService = {
  async getAllPlayers(teamName?: string) {
    const query: { team?: mongoose.Types.ObjectId } = {};

    if (teamName) {
      const team = await Team.findOne({ teamName: { $regex: new RegExp(teamName, "i") } });
      if (team) {
        query.team = team._id;
      } else {
        return [];
      }
    }
    return await Player.find(query).populate("team", "teamName").lean();
  },
  async getPlayerById(id: string) {
    const player = await Player.findById(id).populate("team").populate("comments.author", "name").lean();
    if (!player) {
      throw new ErrorWithStatus({ message: "Player not found", status: 404 });
    }
    return player;
  },

  async searchPlayersByName(name: string) {
    const players = await Player.find({ playerName: { $regex: name, $options: "i" } })
      .select({ playerName: 1, image: 1, team: 1 })
      .populate("team", "teamName")
      .lean();
    return players;
  },

  // --- ADMIN BELLOWwww ---
  async createPlayer(input: PlayerInput) {
    const player = new Player(input);
    await player.save();
    return player;
  },

  async updatePlayer(id: string, input: Partial<PlayerInput>) {
    const player = await Player.findByIdAndUpdate(id, input, { new: true });
    if (!player) {
      throw new ErrorWithStatus({ message: "Player not found", status: 404 });
    }
    return player;
  },

  async deletePlayer(id: string) {
    const result = await Player.findByIdAndDelete(id);
    if (!result) {
      throw new ErrorWithStatus({ message: "Player not found", status: 404 });
    }
    return { message: "Player deleted successfully" };
  },

  // --- Feedback/Commentoor ---
  async addComment(playerId: string, memberId: string, input: CommentInput) {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new ErrorWithStatus({ message: "Player not found", status: 404 });
    }

    const existingComment = player.comments.find((comment) =>
      (comment.author as mongoose.Types.ObjectId).equals(memberId)
    );

    if (existingComment) {
      throw new ErrorWithStatus({ message: "You have already commented on this player", status: 409 });
    }

    player.comments.push({ ...input, author: new mongoose.Types.ObjectId(memberId) });
    await player.save();
    return player;
  },
};
