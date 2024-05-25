import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../queryBuilder/QueryBuilder';
import { userSearchableFields } from './user.constants';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (userData: TUser) => {
  // check if user already exists
  const user = await User.findOne({ email: userData?.email });

  if (user) {
    throw new AppError(400, 'This Email already exists. Please Login');
  }

  // create user
  const result = await User.create(userData);

  return result;
};

const updateUserIntoDB = async (userId: string, payload: Partial<TUser>) => {
  //check if user exists
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found.');
  }

  // prevent user from changing email and password
  payload.email = user.email;
  payload.password = user.password;

  // Dynamically format name & address to update db
  const { name, address, ...remainingUserData } = payload;

  const modifiedUserData: Record<string, unknown> = {
    ...remainingUserData,
  };

  // process name
  if (name && Object.keys(name).length) {
    for (const [key, val] of Object.entries(name)) {
      modifiedUserData[`name.${key}`] = val;
    }
  }

  // process address
  if (address && Object.keys(address).length) {
    for (const [key, val] of Object.entries(address)) {
      modifiedUserData[`address.${key}`] = val;
    }
  }

  // update user info
  const result = await User.findByIdAndUpdate(user._id, modifiedUserData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder<TUser>(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await userQuery.modelQuery;
  const pagination = await userQuery.countTotal();

  return {
    pagination,
    data: result,
  };
};

const getUserFromDB = async (userId: string) => {
  const result = await User.findById(userId);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  return result;
};

const blockUserIntoDB = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  return {
    deletedCount: 0,
    modifiedCount: 1,
  };
};

const deleteUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  user.isDeleted = true;

  user.save();

  return {
    deletedCount: 0,
    modifiedCount: 1,
  };
};

const assignUserRoleIntoDB = async (
  userId: string,
  payload: { role: string },
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  user.role = payload.role;

  user.save();

  return {
    deletedCount: 0,
    modifiedCount: 1,
  };
};

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  getAllUsersFromDB,
  getUserFromDB,
  blockUserIntoDB,
  deleteUserFromDB,
  assignUserRoleIntoDB,
};
