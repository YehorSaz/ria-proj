import { CronJob } from 'cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ApiError } from '../errors/api.error';
import { currencyService } from '../services/сurrencyService';

dayjs.extend(utc);

const updatePrices = async function () {
  try {
    await currencyService.updateExchangeRates();
    await currencyService.updatePriceInUAH();
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const updateCarPrices = new CronJob('0 0 * * *', updatePrices);
