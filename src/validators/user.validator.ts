import joi from 'joi';

import { regexConstant } from '../constatnts/regex.constant';
import { ERoles } from '../enums/roles.enum';
import { EUserType } from '../enums/user-type.enum';

export class UserValidator {
  static userType = joi.valid(...Object.values(EUserType));
  static userName = joi.string().min(2).max(50);
  static age = joi.number().min(18).max(100);
  static email = joi.string().regex(regexConstant.EMAIL).trim();
  static password = joi.string().regex(regexConstant.PASSWORD).trim();

  static update = joi.object({
    userName: this.userName,
    age: this.age,
  });

  static registerUser = joi.object({
    userType: this.userType.required(),
    email: this.email.required(),
    password: this.password.required(),
    userName: this.userName.required(),
    age: this.age.required(),
    roles: joi.valid(ERoles.Buyer, ERoles.Seller).required(),
  });

  static registerManager = joi.object({
    userType: this.userType.required(),
    userName: this.userName.required(),
    age: this.age.required(),
    email: this.email.required(),
    password: this.password.required(),
    roles: joi.valid(ERoles.Manager).required(),
  });

  static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static forgotPassword = joi.object({
    email: this.email.required(),
  });

  static setForgotPassword = joi.object({
    newPassword: this.password.required(),
  });

  static changePassword = joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}
