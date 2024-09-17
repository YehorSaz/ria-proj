import * as jwt from 'jsonwebtoken';

import { configs } from '../configs/configs';
import { EActionTokenType } from '../enums/actionTokenType';
import { ApiError } from '../errors/api.error';
import { ITokenPayload, ITokensPair } from '../interfaces/token.interface';

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: '5h',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: 'access' | 'refresh'): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case 'access':
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case 'refresh':
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError('Invalid token!', 401);
    }
  }

  public generateActionToken(
    payload: ITokenPayload,
    tokenType: EActionTokenType,
  ): string {
    let secret: string;

    switch (tokenType) {
      case EActionTokenType.forgotPassword:
        secret = configs.JWT_FORGOT_SECRET;
        break;
      case EActionTokenType.activate:
        secret = configs.JWT_ACTIVATE_SECRET;
        break;
    }

    return jwt.sign(payload, secret, {
      expiresIn: '1d',
    });
  }

  public checkActionToken(
    token: string,
    tokenType: EActionTokenType,
  ): ITokenPayload {
    try {
      let secret: string;

      switch (tokenType) {
        case EActionTokenType.forgotPassword:
          secret = configs.JWT_FORGOT_SECRET;
          break;
        case EActionTokenType.activate:
          secret = configs.JWT_ACTIVATE_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError('Token not valid!', 401);
    }
  }

  public findRolesInToken(token: string): string | null {
    try {
      const payload = this.checkToken(token, 'access');
      return payload.roles;
    } catch (accessError) {
      try {
        const payload = this.checkToken(token, 'refresh');
        return payload.roles;
      } catch (refreshError) {
        return null;
      }
    }
  }

  public findUserByToken(token: string): string {
    try {
      const payload = this.checkToken(token, 'access');
      return payload.userId;
    } catch (accessError) {
      try {
        const payload = this.checkToken(token, 'refresh');
        return payload.userId;
      } catch (refreshError) {
        return null;
      }
    }
  }
}

export const tokenService = new TokenService();
