import catchAsyncRequest from '../../utils/catchAsyncRequest';
import { UserServices } from './user.service';

const createUser = catchAsyncRequest(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  // sending response
  res.json({ success: true, data: result });
});

export const UserControllers = {
  createUser,
};
