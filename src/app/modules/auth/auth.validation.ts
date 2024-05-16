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

export const AuthValidations = {
  loginValidationSchema,
};
