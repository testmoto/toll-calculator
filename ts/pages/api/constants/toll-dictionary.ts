import { getDate, getMonth, getYear, isWeekend } from 'date-fns';
import { VehicleType } from '../domain/vehicle-type';
import { startOfUTCDay } from '../lib/start-of-utc-day';
import { TOLL_FREE_DATES_MAP } from './toll-free-dates';
import { TOLL_FREE_VEHICLES } from './toll-free-vehicles';
import { MAX_TOLL_PER_DAY, TOLL_RATES } from './toll-rates';

export class TollDictionary {
  static isTollFreeVehicle(vehicleType: VehicleType): boolean {
    return TOLL_FREE_VEHICLES.includes(vehicleType);
  }

  static isTollFreeDate(date: Date): boolean {
    if (isWeekend(date)) return true;

    const year = getYear(date).toString();
    const month = (getMonth(date) + 1).toString().padStart(2, '0');
    const day = getDate(date).toString().padStart(2, '0');

    return (
      !!TOLL_FREE_DATES_MAP[year]?.[month]?.[day] ||
      !!TOLL_FREE_DATES_MAP[year]?.[month]?.['*']
    );
  }

  static getRate(date: Date): number {
    const offset = date.getTime() - startOfUTCDay(date).getTime();
    const foundRate = TOLL_RATES.find(
      rate => rate.from <= offset && offset < rate.to,
    );
    return foundRate?.rate ?? 0;
  }

  static getMaxTollPerDay(): number {
    return MAX_TOLL_PER_DAY;
  }
}
