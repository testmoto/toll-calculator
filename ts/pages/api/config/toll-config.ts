import { getDate, getMonth, getYear, isWeekend, startOfDay } from 'date-fns';
import { TollRate } from '../domain/toll-rate';
import { VehicleType } from '../domain/vehicle-type';
import { startOfUTCDay } from '../lib/start-of-utc-day';
import tollFreeDatesRaw from './toll-free-dates.json';
import tollFreeVehiclesRaw from './toll-free-vehicles.json';
import ratesRaw from './toll-rates.json';

export class TollConfig {
  static isTollFreeVehicle(vehicleType: VehicleType): boolean {
    return tollFreeVehicles.includes(vehicleType);
  }

  static isTollFreeDate(date: Date): boolean {
    if (isWeekend(date)) return true;

    const year = getYear(date).toString();
    const month = (getMonth(date) + 1).toString().padStart(2, '0');
    const day = getDate(date).toString();

    return (
      !!tollFreeDates[year]?.[month]?.[day] ||
      !!tollFreeDates[year]?.[month]?.['*']
    );
  }

  static getRate(date: Date): number {
    const offset = date.getTime() - startOfUTCDay(date).getTime();
    const foundRate = rates.find(i => i.from <= offset && offset < i.to);
    return foundRate?.rate ? foundRate.rate : 0;
  }
}

const tollFreeVehicles = tollFreeVehiclesRaw as VehicleType[];

const tollFreeDates = tollFreeDatesRaw.reduce((acc, cur) => {
  const [year, month, day] = cur.split('-');
  if (!acc[year]) acc[year] = {};
  if (!acc[year][month]) acc[year][month] = {};
  if (!acc[year][month][day]) acc[year][month][day] = true;
  return acc;
}, {} as Record<string, Record<string, Record<string, boolean>>>);

const rates = ratesRaw.map(i => {
  const [fromHour, fromMinute] = i.from.split(':');
  const [toHour, toMinute] = i.to.split(':');

  // offsets from start of day in ms
  const fromOffset = (Number(fromHour) * 60 + Number(fromMinute)) * 60 * 1000;
  const toOffset = (Number(toHour) * 60 + Number(toMinute)) * 60 * 1000;
  return new TollRate(fromOffset, toOffset, Number(i.rate));
});
