/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constants';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGender = 'male' | 'female' | 'other';

export type TAddress = {
  street: string;
  district: string;
  division: string;
  country: string;
};

export type TRole = keyof typeof USER_ROLE;

export type TUser = {
  name?: TUserName;
  email: string;
  password?: string;
  gender?: TGender;
  address?: TAddress;
  contactNo?: string;
  profilePic?: string;
  role: TRole;
  isDeleted: boolean;
  isGoogleAuthenticated: boolean;
  isBlocked: true;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
}
