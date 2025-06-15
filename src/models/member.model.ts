import mongoose from "mongoose";
const memberSchema = new mongoose.Schema({
    memberName:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    YOB:{
        type: Number, // epoch time 
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false, 
    },
   
},{timestamps: true});
const Member = mongoose.model('Member', memberSchema);
export default Member;

