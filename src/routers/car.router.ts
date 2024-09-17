import { Router } from 'express';

import { carController } from '../controllers/car.controller';
import { statisticController } from '../controllers/statistic.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { carMiddleware } from '../middlewares/car.middleware';
import { commonMiddleware } from '../middlewares/common.middleware';
import { fileMiddleware } from '../middlewares/files.middleware';
import { userMiddleware } from '../middlewares/user.middleware';
import { CarValidator } from '../validators/car.validator';

const router = Router();

router.get('/get-all', carController.getAll);
router.post(
  '/create',
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userMiddleware.checkAccountType,
  userMiddleware.checkRole(['Admin', 'Manager', 'Seller']),
  commonMiddleware.isBodyValid(CarValidator.create),
  commonMiddleware.checkDescriptionForBadWords,
  commonMiddleware.isChooseOtherBrand,
  carController.createCar,
);

router.get(
  '/:carId',
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);

router.get(
  '/:carId/stat',
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userMiddleware.checkAccountType,
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  statisticController.getPriceStatisticsByCarId,
);

router.get(
  '/:carId/views',
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userMiddleware.checkAccountType,
  commonMiddleware.isIdValid('carId'),
  carMiddleware.getByIdOrThrow,
  statisticController.getViewsStatisticsByCarId,
);

router.put(
  '/:carId',
  authMiddleware.checkAccessToken,
  userMiddleware.checkAccountType,
  commonMiddleware.isIdValid('carId'),
  commonMiddleware.isBodyValid(CarValidator.update),
  commonMiddleware.checkDescriptionForBadWords,
  carController.updateCar,
);

router.put(
  '/:carId/byManager',
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(['Admin', 'Manager']),
  commonMiddleware.isBodyValid(CarValidator.updateByManager),
  carController.updateCar,
);

router.post(
  '/:carId/add-photo',
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  commonMiddleware.isIdValid('carId'),
  fileMiddleware.isAvatarValid,
  carController.uploadImages,
);
router.delete(
  '/:carId',
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid('carId'),
  carController.deleteCar,
);

export const carRouter = router;
