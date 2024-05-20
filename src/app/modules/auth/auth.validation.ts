import { z } from 'zod';
import { emailRegEx } from '../../constants/validation.constants';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }).refine(
      (data) => emailRegEx.test(data),
      (value) => ({
        message: `${value} is not a valid email. Please enter a correct email`,
      }),
    ),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required.' }),
    newPassword: z.string({ required_error: 'New password is required.' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'User email is required.' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User id is required.' }),
    newPassword: z.string({ required_error: 'New Password is required.' }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
