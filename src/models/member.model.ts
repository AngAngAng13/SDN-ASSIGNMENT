import mongoose from "mongoose";

export interface IMember extends mongoose.Document {
    membername: string;
    password: string;
    name: string;
    YOB: number;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const memberSchema = new mongoose.Schema({
    membername: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    YOB: {
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

const Member = mongoose.model<IMember>('Member', memberSchema);
export default Member;