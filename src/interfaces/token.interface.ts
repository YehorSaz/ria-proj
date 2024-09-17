import { EActionTokenType } from '../enums/actionTokenType';

export interface ITokenPayload {
  userId: string;
  roles?: string;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
  _userId: string;
}

export interface IActionToken {
  token: string;
  type: EActionTokenType;
  _userId: string;
}
