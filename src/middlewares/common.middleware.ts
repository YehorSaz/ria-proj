import Filter from 'bad-words';
import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import mongoose from 'mongoose';

import { ApiError } from '../errors/api.error';
import { userRepository } from '../repositories/user.repository';
import { tokenService } from '../services/token.service';
import { userService } from '../services/user.services';
import { badWords } from '../validators/badWords';

class CommonMiddleware {
  public isIdValid(field: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[field];

        if (!mongoose.isObjectIdOrHexString(id)) {
          return next(new ApiError('Not valid ID', 400));
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);

        if (error) {
          return next(new ApiError(error.message, 400));
        }

        req.body = value;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public async checkDescriptionForBadWords(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (req.body.description) {
        const { description } = req.body;

        const filter = new Filter({ replaceRegex: /[A-Za-z0-9가-힣_]/g });
        filter.addWords(...badWords);
        const cleanedDescription = filter.clean(description);

        if (cleanedDescription !== description) {
          console.log('Found bad words');
          req.body.isValidDescription = false;
        } else {
          req.body.isValidDescription = true;
        }
      } else {
        req.body.isValidDescription = true;
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isChooseOtherBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { brand } = req.body;
      const token = req.get('Authorization').split('Bearer ')[1];

      const userId = tokenService.findUserByToken(token);
      const user = await userRepository.findById(userId);

      if (!user) {
        return next(new ApiError('User not found', 404));
      }
      if (brand === 'Other') {
        await userService.sendMessageToManagers(user.email);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
