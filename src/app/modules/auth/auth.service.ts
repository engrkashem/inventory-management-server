import { User } from '../user/user.model';
import { TLogin } from './auth.interface';

const loginIntoDB = async (payload: TLogin) => {
  const { email, password } = payload;

  // check if user exists in db
  const user = await User.isUserExistsByEmail(email);
  console.log(user);

  return user;
};

export const AuthServices = {
  loginIntoDB,
};
