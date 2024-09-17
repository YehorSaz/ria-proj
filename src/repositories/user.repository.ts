import { FilterQuery } from 'mongoose';

import { IUser, IUserCredentials } from '../interfaces/users.interface';
import { User } from '../models/User.model';

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return User.find();
  }

  public async getUserById(userId: string): Promise<IUser> {
    return User.findById(userId);
  }

  public async getOneByParams(
    params: FilterQuery<IUser>,
    selection?: string[],
  ): Promise<IUser> {
    return User.findOne(params, selection);
  }

  public async getByParams(
    params: FilterQuery<IUser>,
    selection?: string[],
  ): Promise<IUser[]> {
    return User.find(params, selection);
  }

  public async findById(id: string): Promise<IUser> {
    return User.findById(id);
  }

  public async register(dto: IUserCredentials): Promise<IUser> {
    return User.create(dto);
  }

  public async updateOneById(
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser> {
    return User.findByIdAndUpdate(userId, dto, {
      returnDocument: 'after',
    });
  }

  public async setStatus(userId: string, status: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { status } });
  }

  public async deleteUser(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }

  public async blockUser(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { isBlocked: true } });
  }

  public async unblockUser(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { isBlocked: false } });
  }
}

export const userRepository = new UserRepository();
