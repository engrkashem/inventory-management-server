import config from '../config';
import { USER_ROLE } from '../modules/user/user.constants';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const superAdminUser: TUser = {
  name: {
    firstName: 'MR.',
    lastName: 'Super Admin',
  },
  email: 'superAdmin@gmail.com',
  password: config.SUPER_ADMIN_PASS,
  gender: 'male',
  address: {
    street: '40/8-Ka',
    district: 'Khulna',
    division: 'Khulna',
    country: 'Bangladesh',
  },
  contactNo: '123456789',
  profilePic:
    'https://res.cloudinary.com/djn7wzals/image/upload/v1703391348/samples/animals/kitten-playing.gif',
  role: USER_ROLE.superAdmin,
};

const seedSuperAdmin = async () => {
  // check if super admin already exists
  const isSuperAdminExists = await User.findOne({
    role: USER_ROLE.superAdmin,
  });

  // if super admin is  not exists in db, then create super admin
  if (!isSuperAdminExists) {
    await User.create(superAdminUser);
  }
};

export default seedSuperAdmin;
