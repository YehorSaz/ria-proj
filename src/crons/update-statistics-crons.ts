import { CronJob } from 'cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ApiError } from '../errors/api.error';
import { statisticRepository } from '../repositories/statistic.repository';

dayjs.extend(utc);

const updateStatistic = async function () {
  try {
    await statisticRepository.findAndUpdateAveragePriceInRegion();
    await statisticRepository.findAndUpdateAveragePriceInCountry();
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};

export const updateCarStatistic = new CronJob('0 0 * * *', updateStatistic);
