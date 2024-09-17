import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/api.error';
import { User } from '../models/User.model';
import { carRepository } from '../repositories/car.repository';
import { userRepository } from '../repositories/user.repository';
import { tokenService } from '../services/token.service';

class UserMiddleware {
  public async getByIdOrThrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await userRepository.findById(userId);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      req.res.locals = user;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkAccountType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = res.locals.accessToken;

      if (!token) {
        return next(new ApiError('No Token!', 401));
      }

      const userId = tokenService.findUserByToken(token);

      const user = await userRepository.findById(userId);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      const userCars = await carRepository.getOneByParams({ _userId: userId });

      if (!userCars) {
        next();
      } else {
        if (!user.isAccountPremium) {
          return next(
            new ApiError('Access denied. Premium account required.', 403),
          );
        } else {
          next();
        }
      }
    } catch (e) {
      next(e);
    }
  }

  public async isEmailUniq(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await userRepository.getOneByParams({ email });
      if (user) {
        return next(new ApiError('Email already exist', 409));
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public isUserExist<T>(field: keyof T) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const user = await User.findOne({ [field]: req.body[field] }).lean();

        if (!user) {
          return next(new ApiError('User not found', 404));
        }

        req.res.locals = user;

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public async checkUserStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.res.locals.accessToken;

      if (!token) {
        return next(new ApiError('No Token!', 401));
      }

      const userId = tokenService.findUserByToken(token);

      const user = await userRepository.findById(userId);

      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      if (user.isBlocked === true) {
        return next(new ApiError('User is blocked', 403));
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public checkRole(role: string | string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = res.locals.accessToken;

        if (!token) {
          return next(new ApiError('No Token!', 401));
        }
        const userRoles = tokenService.findRolesInToken(token);

        const userRolesArray = Array.isArray(userRoles)
          ? userRoles
          : [userRoles];

        const hasMatchingRole = Array.isArray(role)
          ? role.some((r) => userRolesArray.includes(r))
          : userRolesArray.includes(role);

        if (hasMatchingRole) {
          next();
        } else {
          return next(new ApiError('Access denied', 403));
        }
      } catch (e) {
        next(e);
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
