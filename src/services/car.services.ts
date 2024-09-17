import { UploadedFile } from 'express-fileupload';

import { ECurrency } from '../enums/currency.enum';
import { EEmailAction } from '../enums/email.action.enum';
import { ApiError } from '../errors/api.error';
import { ICar } from '../interfaces/cars.interface';
import { ExchangeRateData } from '../interfaces/currency.interface';
import { Car } from '../models/Car.model';
import { carRepository } from '../repositories/car.repository';
import { statisticRepository } from '../repositories/statistic.repository';
import { emailService } from './email.service';
import { EFileTypes, s3Service } from './s3.service';
import { userService } from './user.services';
import { currencyService } from './сurrencyService';

class CarService {
  public async getAll(): Promise<ICar[]> {
    return carRepository.getAll();
  }

  public async updateCar(
    carId: string,
    dto: Partial<ICar>,
    userId: string,
    roles: string,
  ): Promise<ICar> {
    await this.checkUpdatePermission(userId, carId, roles);
    const car = await Car.findById(carId);
    await carService.checkAnnouncementActive(car);
    if ('price' in dto) {
      dto.priceInUAH = await this.calculatePriceInUAH(
        dto.price,
        dto.currency,
        car.exchangeRates,
      );
      car.priceInUAH = dto.priceInUAH;
    }

    if (!dto.announcementActive) {
      dto.editCount = (car.editCount || 0) + 1;
    }

    return carRepository.updateCar(carId, dto);
  }

  public async createCar(dto: ICar, userId: string): Promise<ICar> {
    const exchangeRates = await currencyService.getExchangeRates();
    const priceInUAH = await this.calculatePriceInUAH(
      dto.price,
      dto.currency,
      exchangeRates,
    );

    const carData: ICar = {
      ...dto,
      _userId: userId,
      exchangeRates: {
        usd: exchangeRates.usd,
        eur: exchangeRates.eur,
        uah: exchangeRates.uah,
      },
      priceInUAH: priceInUAH,
    } as ICar;

    const newCar = await carRepository.createCar(carData, userId);

    await statisticRepository.createPriceStatisticForCar(newCar._id);

    return newCar;
  }

  public async calculatePriceInUAH(
    price: number,
    currency: ECurrency,
    exchangeRates: any,
  ): Promise<number> {
    if (currency === ECurrency.UAH) {
      return price;
    } else if (currency === ECurrency.USD) {
      return price * exchangeRates.usd;
    } else if (currency === ECurrency.EUR) {
      return price * exchangeRates.eur;
    }
  }

  public async deleteCar(
    carId: string,
    userId: string,
    roles: string,
  ): Promise<void> {
    await this.checkUpdatePermission(userId, carId, roles);
    await carRepository.deleteCar(carId);
  }

  public async uploadImages(
    carId: string,
    avatar: UploadedFile,
    userId: string,
    roles: string,
  ): Promise<ICar> {
    await this.checkUpdatePermission(userId, carId, roles);

    const filePath = await s3Service.uploadFile(avatar, EFileTypes.Car, carId);

    const car = await carRepository.getOneByParams({
      _id: carId,
    });

    car.avatar = [...(car.avatar || []), filePath];

    return carRepository.updateCar(carId, car);
  }

  public async updateCarPrices(exchangeRates: ExchangeRateData): Promise<void> {
    try {
      const update = {
        $set: {
          exchangeRates,
          lastExchangeRateUpdate: new Date(),
        },
      };

      await carRepository.updateCarPrices({}, update);
    } catch (e) {
      throw e;
    }
  }

  public async checkAnnouncementActive(dto: ICar): Promise<void> {
    const { announcementActive, editCount } = dto;

    const managers = await userService.getManagers();

    if (!announcementActive) {
      if (editCount && editCount >= 3) {
        for (const manager of managers) {
          await emailService.sendMail(
            manager.email,
            EEmailAction.ANNOUNCEMENT_BAD_WORDS,
            { _id: dto._id },
          );
        }

        throw new Error("You can't change your Announcement more 3 times");
      }
    }
  }

  public async checkUpdatePermission(
    userId: string,
    manageCarId: string,
    roles: string,
  ): Promise<ICar> {
    if (roles === 'Admin' || roles === 'Manager') {
      const car = await carRepository.getOneByParams({
        _id: manageCarId,
      });

      if (!car) {
        throw new ApiError('Car not found', 404);
      }

      return car;
    }

    const car = await carRepository.getOneByParams({
      _userId: userId,
      _id: manageCarId,
    });

    if (!car) {
      throw new ApiError('You do not have permission to manage this car', 403);
    }

    return car;
  }
}

export const carService = new CarService();
