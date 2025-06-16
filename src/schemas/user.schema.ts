import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    membername: z.string({ required_error: 'Member name is required' }).min(3, 'Member name must be at least 3 characters'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string({ required_error: 'Password confirmation is required'}),
    name: z.string({ required_error: 'Name is required' }),
    YOB: z.coerce.number({ required_error: 'Year of Birth is required' }).min(1900).max(new Date().getFullYear()),
    isAdmin: z.preprocess((val) => val === 'on', z.boolean()).optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], 
  }),
});

export const loginSchema = z.object({
  body: z.object({
    membername: z.string({ required_error: 'Member name is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: z.string({ required_error: 'New password is required' }).min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z.string({ required_error: 'Confirm new password is required' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"], 
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['cookies'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];