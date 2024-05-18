import { TGender, TRole } from './user.interface';

export const GENDER: TGender[] = ['male', 'female', 'other'];

export const ROLE: TRole[] = [
  'superAdmin',
  'admin',
  'manager',
  'user',
  'employee',
];

export const USER_ROLE = {
  user: 'user',
  manager: 'manager',
  admin: 'admin',
  superAdmin: 'superAdmin',
  employee: 'employee',
} as const;
