import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constants';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = Router();

/*** User routes ***/
router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.patch(
  '/update-my-profile',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateMyInfo,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getAllUsers,
);

router.get(
  '/get-me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.manager,
    USER_ROLE.employee,
    USER_ROLE.user,
  ),
  UserControllers.getMe,
);

router.get(
  '/:userId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getUser,
);

router.patch(
  '/:userId/block-user',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.blockUser,
);

router.delete(
  '/:userId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.deleteUser,
);

router.patch(
  '/:userId/assign-user-role',
  auth(USER_ROLE.superAdmin),
  validateRequest(UserValidations.assignUserRoleValidationSchema),
  UserControllers.assignUserRole,
);

export const UserRoutes = router;
