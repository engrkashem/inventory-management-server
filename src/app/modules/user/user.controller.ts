import config from '../../config';
import catchAsyncRequest from '../../utils/catchAsyncRequest';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const userRootUrl = `${config.BASE_URL}/users`;

const createUser = catchAsyncRequest(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  const links = {
    self: `POST: ${userRootUrl}/create-user`,
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

export const UserControllers = {
  createUser,
};
