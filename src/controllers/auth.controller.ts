import { NextFunction, Request, Response } from 'express';

import { ITokenPayload, ITokensPair } from '../interfaces/token.interface';
import { IUser } from '../interfaces/users.interface';
import { authService } from '../services/auth.service';

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);

      return res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokensPair = await authService.login(req.body);

      return res.json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const refreshToken = req.res.locals.refreshToken as string;

      const tokensPair = await authService.refresh(tokenPayload, refreshToken);

      return res.status(201).json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const accessToken = req.res.locals.accessToken as string;

      await authService.logout(accessToken);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;

      await authService.logoutAll(tokenPayload.userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async activate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const actionToken = req.query.actionToken as string;

      await authService.activate(actionToken);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async sendActivationToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;

      await authService.sendActivationToken(tokenPayload);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals;
      await authService.forgotPassword(user as IUser);

      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.setForgotPassword(
        req.params.token as string,
        req.body.newPassword,
      );

      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId: userId } = req.res.locals.tokenPayload;
      await authService.changePassword(req.body, userId);

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
