import { FilterQuery } from 'mongoose';

import { ICar } from '../interfaces/cars.interface';
import { Car } from '../models/Car.model';

class CarRepository {
  public async getAll(): Promise<ICar[]> {
    return Car.find().populate('_userId');
  }

  public async getAllByParams(filter: FilterQuery<ICar>): Promise<ICar[]> {
    return Car.find(filter);
  }

  public async getOneByParams(params: FilterQuery<ICar>): Promise<ICar> {
    return Car.findOne(params);
  }

  public async findById(id: string): Promise<ICar> {
    return Car.findById(id);
  }

  public async createCar(dto: ICar, userId: string): Promise<ICar> {
    return Car.create({ ...dto, _userId: userId });
  }

  public async updateCar(carId: string, dto: Partial<ICar>): Promise<ICar> {
    return Car.findByIdAndUpdate(carId, dto, {
      returnDocument: 'after',
    });
  }

  public async updateCarPrices(
    filter: FilterQuery<ICar>,
    update: any,
  ): Promise<void> {
    try {
      await Car.updateMany(filter, update);
    } catch (e) {
      throw e;
    }
  }

  public async deleteCar(carId: string): Promise<void> {
    await Car.deleteOne({ _id: carId });
  }
}

export const carRepository = new CarRepository();
