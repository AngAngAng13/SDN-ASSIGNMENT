import { Request, Response } from 'express';
import Member from '../models/member.model.js';
import { ErrorWithStatus } from '../models/Errors.js';
import { authService } from '../services/auth.js';
import { time } from 'console';

export const userController = {
  register: async (req: Request, res: Response) => {
  //timeout for testing
  await new Promise(resolve => setTimeout(resolve, 12000));
  const { membername, password, name, YOB, isAdmin } = req.body;
  if (!membername || !password || !name || !YOB) {
    throw new ErrorWithStatus({ message: 'Missing required fields', status: 400 });
  }
  const existingMember = await Member.findOne({ memberName: membername });
  if (existingMember) {
    throw new ErrorWithStatus({ message: 'Member already exists', status: 409 });
  }
  const hashedPassword = await authService.encryptPassword(password);
  const member = new Member({
    memberName: membername,
    password: hashedPassword,
    name: name,
    YOB: YOB,
    isAdmin: isAdmin,
  });

    const savedMember = await member.save();
    if (!savedMember) {
      throw new ErrorWithStatus({ message: 'Failed to create member', status: 500 });
    }
    res.status(201).json({ message: 'Member created successfully', data: savedMember });
  },
};
