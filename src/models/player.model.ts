import mongoose from "mongoose";
import Comment from "./comment.model.js";
import "./team.model.js";
const playerSchema = new mongoose.Schema({
    playerName: {  type:String, required: true },
    image : { type: String, required: true },
    cost : { type: Number, required: true },
    isCaptain : { type: Boolean, default: false },
    information: { type: String, required: true },
    comments: [Comment.schema], 
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams',
        required: true,
    },
}, { timestamps: true });
const Player = mongoose.model('Player', playerSchema);
export default Player;