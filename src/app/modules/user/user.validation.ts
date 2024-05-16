import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'User Email is required.' }),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
        required_error: 'Password is required',
      })
      .refine((pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pass), {
        message:
          'Password must be minimum six characters, at least one letter and one number',
      }),
    // .min(3, { message: 'Password can not be less than 3 characters' })
    // .max(20, { message: 'Password can not be more than 20 characters' }),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
