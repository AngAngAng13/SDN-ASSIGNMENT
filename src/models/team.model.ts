import mongoose from "mongoose";
const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
  
}, { timestamps: true });
const Team = mongoose.model('Teams', teamSchema);
export default Team;