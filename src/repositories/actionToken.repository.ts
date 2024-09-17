import { FilterQuery } from 'mongoose';

import { EActionTokenType } from '../enums/actionTokenType';
import { IActionToken } from '../interfaces/token.interface';
import { ActionTokenModel } from '../models/ActionToken.model';

export class ActionTokenRepository {
  public async create(dto: IActionToken): Promise<IActionToken> {
    return ActionTokenModel.create(dto);
  }

  public async findOne(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken> {
    return ActionTokenModel.findOne(params);
  }

  public async deleteOne(params: FilterQuery<IActionToken>): Promise<void> {
    await ActionTokenModel.deleteOne(params);
  }

  public async deleteManyByUserIdAndType(
    userId: string,
    type: EActionTokenType,
  ): Promise<void> {
    await ActionTokenModel.deleteMany({ _userId: userId, type });
  }
}

export const actionTokenRepository = new ActionTokenRepository();
