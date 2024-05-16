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

export type TRole = 'superAdmin' | 'admin' | 'manager' | 'user';

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
};
