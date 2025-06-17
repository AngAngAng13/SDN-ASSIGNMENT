import Member from '../models/member.model.js';
import { ErrorWithStatus } from '../models/Errors.js';
import { UpdateProfileInput } from '../schemas/member.schema.js';

export const memberService = {
    async getAllMembers() {
        return await Member.find().select('-password').lean();
    },

    async updateMemberProfile(memberId: string, input: UpdateProfileInput) {
        const updatedMember = await Member.findByIdAndUpdate(memberId, input, { new: true })
            .select('-password')
            .lean();

        if (!updatedMember) {
            throw new ErrorWithStatus({ message: 'Member not found', status: 404 });
        }
        return updatedMember;
    }
};