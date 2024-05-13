import catchAsyncRequest from '../../utils/catchAsyncRequest';

const createUser = catchAsyncRequest(async (req, res) => {
  //   const { password, student: studentData } = req.body;

  // calling service function to send data to database
  //   const result = await UserServices.addStudentToDB(
  //     req.file,
  //     password,
  //     studentData,
  //   );

  // sending response
  res.json({ success: true });
});

export const UserControllers = {
  createUser,
};
