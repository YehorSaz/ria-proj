import { Router } from 'express';

import { authController } from '../controllers/auth.controller';
import { IUser } from '../interfaces/users.interface';
import { authMiddleware } from '../middlewares/auth.middleware';
import { commonMiddleware } from '../middlewares/common.middleware';
import { userMiddleware } from '../middlewares/user.middleware';
import { UserValidator } from '../validators/user.validator';

const router = Router();

router.post(
  '/login',
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);

router.post(
  '/refresh',
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
router.post('/logout', authMiddleware.checkAccessToken, authController.logout);
router.post(
  '/logout-all',
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

router.post('/activate', authController.activate);

router.post(
  '/forgot',
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  userMiddleware.isUserExist<IUser>('email'),
  authController.forgotPassword,
);

router.put(
  '/forgot/:token',
  commonMiddleware.isBodyValid(UserValidator.setForgotPassword),
  authController.setForgotPassword,
);

router.post(
  '/change',
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword,
);

export const authRouter = router;
