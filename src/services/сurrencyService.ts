import axios from 'axios';

import { currencyUrl } from '../constatnts/currency.constant';
import {
  ExchangeRate,
  ExchangeRateData,
} from '../interfaces/currency.interface';
import { carRepository } from '../repositories/car.repository';
import { carService } from './car.services';

class CurrencyService {
  async getExchangeRates(): Promise<ExchangeRateData> {
    try {
      const response = await axios.get<ExchangeRate[]>(currencyUrl);

      return {
        usd: parseFloat(
          response.data.find((rate) => rate.ccy === 'USD')?.sale || '0',
        ),
        eur: parseFloat(
          response.data.find((rate) => rate.ccy === 'EUR')?.sale || '0',
        ),
        uah: 1.0,
      };
    } catch (error) {
      throw error;
    }
  }
  async updateExchangeRates(): Promise<void> {
    try {
      const response = await axios.get<ExchangeRate[]>(currencyUrl);

      const updateObject: ExchangeRateData = {
        usd: parseFloat(
          response.data.find((rate) => rate.ccy === 'USD')?.sale || '0',
        ),
        eur: parseFloat(
          response.data.find((rate) => rate.ccy === 'EUR')?.sale || '0',
        ),
        uah: 1.0,
      };

      await carService.updateCarPrices(updateObject);
    } catch (error) {
      throw error;
    }
  }

  public async updatePriceInUAH(): Promise<void> {
    try {
      const cars = await carRepository.getAll();

      for (const car of cars) {
        car.priceInUAH = await carService.calculatePriceInUAH(
          car.price,
          car.currency,
          car.exchangeRates,
        );
        await car.save();
      }
    } catch (error) {
      throw new error();
    }
  }
}

export const currencyService = new CurrencyService();
