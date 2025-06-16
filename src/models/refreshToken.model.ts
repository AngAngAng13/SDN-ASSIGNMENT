import mongoose from "mongoose";
const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
    },
    exp: {
        type: Date,
        required: true,
    },
    iat: {
        type: Date,
        required: true,
    }
}, { timestamps: true });
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;