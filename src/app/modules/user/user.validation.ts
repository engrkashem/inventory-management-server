import { z } from 'zod';
import {
  emailRegEx,
  passwordRegEx,
} from '../../constants/validation.constants';
import { GENDER, ROLE } from './user.constants';

const nameValidationSchema = z.object({
  firstName: z.string({ invalid_type_error: 'First name must be string' }),
  middleName: z
    .string({ invalid_type_error: 'Middle name must be string' })
    .optional(),
  lastName: z.string({ invalid_type_error: 'Last name must be string' }),
});

const addressValidationSchema = z.object({
  street: z.string({ invalid_type_error: 'Street must be string' }),
  district: z.string({ invalid_type_error: 'District must be string' }),
  division: z.string({ invalid_type_error: 'Division must be string' }),
  country: z.string({ invalid_type_error: 'Country name must be string' }),
});

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
    name: nameValidationSchema.optional(),
    address: addressValidationSchema.optional(),
    gender: z.enum([...GENDER] as [string, ...string[]]).optional(),
    contactNo: z
      .string({ invalid_type_error: 'Contact number must be string' })
      .optional(),
    profilePic: z
      .string({ invalid_type_error: 'Profile pic must be an url/string' })
      .optional(),
    role: z.enum([...ROLE] as [string, ...string[]]).optional(),
    isDeleted: z.boolean().optional(),
    isGoogleAuthenticated: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};
