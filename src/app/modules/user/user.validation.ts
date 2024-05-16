import { z } from 'zod';
import {
  emailRegEx,
  passwordRegEx,
} from '../../constants/validation.constants';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'User Email is required.' }).refine(
      (data) => emailRegEx.test(data),
      (value) => ({
        message: `${value} is not a valid email. Please enter a correct email`,
      }),
    ),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
        required_error: 'Password is required',
      })
      .refine((pass) => passwordRegEx.test(pass), {
        message:
          'Password must be minimum six characters, at least one letter and one number',
      }),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
