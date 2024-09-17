import { Router } from 'express';

import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { commonMiddleware } from '../middlewares/common.middleware';
import { fileMiddleware } from '../middlewares/files.middleware';
import { userMiddleware } from '../middlewares/user.middleware';
import { UserValidator } from '../validators/user.validator';

const router = Router();

router.post(
  '/register',
  commonMiddleware.isBodyValid(UserValidator.registerUser),
  userMiddleware.isEmailUniq,
  authController.register,
);

router.post(
  '/regManager',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole('Admin'),
  commonMiddleware.isBodyValid(UserValidator.registerManager),
  userMiddleware.isEmailUniq,
  authController.register,
);

router.get(
  '/get-all',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  userController.getAll,
);

router.get(
  '/me',
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userController.getMe,
);

router.get(
  '/:userId',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  commonMiddleware.isIdValid('userId'),
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.put(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateUser,
);

router.patch(
  '/:userId/block',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  commonMiddleware.isIdValid('userId'),
  userController.blockUser,
);

router.patch(
  '/:userId/unblock',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  commonMiddleware.isIdValid('userId'),
  userController.unblockUser,
);

router.patch(
  '/:userId/setPremium',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  commonMiddleware.isIdValid('userId'),
  userController.setPremium,
);
router.patch(
  '/:userId/setBase',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  commonMiddleware.isIdValid('userId'),
  userController.setBase,
);

router.delete(
  '/:userId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('userId'),
  userController.deleteUser,
);

router.post(
  '/:userId/avatar',
  authMiddleware.checkAccessToken,
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar,
);

export const userRouter = router;
