import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    content: {
        type: String, 
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
},{timestamps: true});
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;