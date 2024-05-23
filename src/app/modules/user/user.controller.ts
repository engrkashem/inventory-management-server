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
    status: 201,
    success: true,
    message: 'User profile updated successfully.',
    data: result,
    links,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
};
