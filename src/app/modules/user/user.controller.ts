import httpStatus from 'http-status';
import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const userRootUrl = `${config.BASE_URL}/users`;

const createUser = catchAsyncRequest(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  const links = {
    self: `POST: ${userRootUrl}/signup`,
  };

  // sending response
  sendResponse(res, {
    status: 201,
    success: true,
    message: 'User is created successfully.',
    data: result,
    links,
  });
});

const updateUser = catchAsyncRequest(async (req, res) => {
  const { _id: userId } = req.user;

  const result = await UserServices.updateUserIntoDB(userId, req.body);

  const links = {
    self: `PATCH: ${userRootUrl}`,
  };

  // sending response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully.',
    data: result,
    links,
  });
});

const getAllUsers = catchAsyncRequest(async (req, res) => {
  const { pagination, data } = await UserServices.getAllUsersFromDB(req.query);

  const links = {
    self: `GET: ${userRootUrl}?page=${pagination?.page}&limit=${pagination?.limit}`,
    prevPage:
      pagination?.page <= 1
        ? null
        : `GET: ${userRootUrl}?page=${pagination?.page - 1}&limit=${pagination?.limit}`,
    nextPage:
      pagination?.page >= pagination?.totalPage
        ? null
        : `GET: ${userRootUrl}?page=${pagination?.page + 1}&limit=${pagination?.limit}`,
  };

  // sending response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'All users retrieved successfully.',
    data,
    links,
  });
});

const getUser = catchAsyncRequest(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getUserFromDB(userId);

  const links = {
    self: `GET: ${userRootUrl}/${result?._id}`,
  };

  // sending response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'User data retrieved successfully.',
    data: result,
    links,
  });
});

const blockUser = catchAsyncRequest(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.blockUserIntoDB(userId);

  const links = {
    self: `PATCH: ${userRootUrl}/${result?._id}/block-user`,
  };

  // sending response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: `User with id ${userId} blocked successfully.`,
    data: result,
    links,
  });
});

const deleteUser = catchAsyncRequest(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.deleteUserFromDB(userId);

  const links = {
    self: `DELETE: ${userRootUrl}/${userId}`,
  };

  // sending response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: `User with id ${userId} deleted successfully.`,
    data: result,
    links,
  });
});

const assignUserRole = catchAsyncRequest(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.assignUserRoleIntoDB(userId, req.body);

  const links = {
    self: `PATCH: ${userRootUrl}/${result?._id}/assign-user-role`,
    user: `GET: ${userRootUrl}/${result?._id}`,
  };

  // sending response
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: `User with id ${userId} made ${req.body.role} successfully.`,
    data: result,
    links,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getUser,
  blockUser,
  deleteUser,
  assignUserRole,
};
