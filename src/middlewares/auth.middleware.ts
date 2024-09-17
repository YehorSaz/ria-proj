import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../errors/api.error';
import { tokenRepository } from '../repositories/token.repository';
import { tokenService } from '../services/token.service';

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessToken = req.get('Authorization').split('Bearer ')[1];
      if (!accessToken) {
        return next(new ApiError('No Token!', 401));
      }

      const payload = tokenService.checkToken(accessToken, 'access');

      const entity = await tokenRepository.findOne({ accessToken });

      if (!entity) {
        return next(new ApiError('Token not valid!', 401));
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.accessToken = accessToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.get('Authorization').split('Bearer ')[1];

      if (!refreshToken) {
        return next(new ApiError('No Token!', 401));
      }

      const payload = tokenService.checkToken(refreshToken, 'refresh');

      const entity = await tokenRepository.findOne({ refreshToken });

      if (!entity) {
        return next(new ApiError('Token not valid!', 401));
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
