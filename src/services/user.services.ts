import { UploadedFile } from 'express-fileupload';

import { EEmailAction } from '../enums/email.action.enum';
import { ApiError } from '../errors/api.error';
import { IUser } from '../interfaces/users.interface';
import { userRepository } from '../repositories/user.repository';
import { emailService } from './email.service';
import { EFileTypes, s3Service } from './s3.service';

class UserService {
  public async getAll(): Promise<IUser[]> {
    return userRepository.getAll();
  }

  public async getUserById(userId: string): Promise<IUser> {
    return userRepository.getUserById(userId);
  }

  public async updateUser(
    manageUserId: string,
    dto: Partial<IUser>,
    userId: string,
    roles: string,
  ): Promise<IUser> {
    this.checkUpdatePermission(userId, manageUserId, roles);
    return userRepository.updateOneById(manageUserId, dto);
  }

  public async deleteUser(
    manageUserId: string,
    userId: string,
    roles: string,
  ): Promise<void> {
    this.checkUpdatePermission(userId, manageUserId, roles);
    await userRepository.deleteUser(manageUserId);
  }

  public async getMe(userId: string): Promise<IUser> {
    return userRepository.findById(userId);
  }

  public async uploadAvatar(
    manageUserId: string,
    avatar: UploadedFile,
    userId: string,
    roles: string,
  ): Promise<IUser> {
    const user = await userRepository.getUserById(userId);
    this.checkUpdatePermission(userId, manageUserId, roles);

    const filePath = await s3Service.uploadFile(
      avatar,
      EFileTypes.User,
      manageUserId,
    );

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    return userRepository.updateOneById(manageUserId, {
      avatar: filePath,
    });
  }

  public async toPremium(userId: string): Promise<IUser> {
    const updatedUserData: Partial<IUser> = {
      isAccountPremium: true,
    };
    return userRepository.updateOneById(userId, updatedUserData);
  }
  public async toBase(userId: string): Promise<IUser> {
    const updatedUserData: Partial<IUser> = {
      isAccountPremium: false,
    };
    return userRepository.updateOneById(userId, updatedUserData);
  }

  public async blockUser(userId: string, roles: string): Promise<void> {
    await this.checkRole(roles);
    await userRepository.blockUser(userId);
  }

  public async unblockUser(userId: string, roles: string): Promise<void> {
    await this.checkRole(roles);
    await userRepository.unblockUser(userId);
  }

  public async getManagers(): Promise<IUser[]> {
    const managers = await userRepository.getByParams({
      roles: 'Manager',
    });

    if (!managers) {
      throw new ApiError('Manager not found', 404);
    }

    return managers;
  }

  public async sendMessageToManagers(email: string): Promise<void> {
    const managers = await this.getManagers();
    for (const manager of managers) {
      await emailService.sendMail(
        manager.email,
        EEmailAction.CHOOSE_OTHER_BRAND,
        { email },
      );
    }
  }

  private async checkRole(roles: string): Promise<void> {
    if (roles === 'Admin' || roles === 'Manager') {
      return;
    } else {
      throw new ApiError('You do not have permission to manage this user', 403);
    }
  }

  private checkUpdatePermission(
    userId: string,
    manageUserId: string,
    roles: string,
  ): void {
    if (roles === 'Admin' || roles === 'Manager') {
      return;
    }
    if (userId === manageUserId) {
      return;
    }
    throw new ApiError('You do not have permission to manage this user', 403);
  }
}

export const userService = new UserService();
