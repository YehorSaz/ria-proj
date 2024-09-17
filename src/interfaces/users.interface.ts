import { ERoles } from '../enums/roles.enum';
import { EUserStatus } from '../enums/user-status.enum';
import { EUserType } from '../enums/user-type.enum';

export interface IUser {
  _id?: string;
  userType: EUserType;
  userName: string;
  age: number;
  email: string;
  password: string;
  status: EUserStatus;
  roles: ERoles;
  isBlocked: boolean;
  avatar: string;
  isAccountPremium: boolean;
  socketId: string;
}

export type IUserCredentials = Pick<IUser, 'email' | 'password'>;
export interface ISetNewPassword extends Pick<IUser, 'password'> {
  newPassword: string;
}
