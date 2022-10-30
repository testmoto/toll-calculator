import { formatISO } from 'date-fns';
import { TollConfig } from '../config/toll-config';
import { TollReport } from '../domain/toll-report';
import { VehicleType } from '../domain/vehicle-type';

export function createTollReport({
  vehicleType,
  dates,
}: CreateTollParams): TollReport {
  if (dates.length === 0) return new TollReport(0);

  const commonDate = new Set(
    dates.map(i => formatISO(i, { representation: 'date' })),
  );

  if (commonDate.size > 1)
    throw new CalculateTollException('All dates must be on the same day');

  if (
    TollConfig.isTollFreeVehicle(vehicleType) ||
    TollConfig.isTollFreeDate(dates[0])
  ) {
    return new TollReport(0);
  }

  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const allRates = sortedDates.map(TollConfig.getRate);

  let groupStartIndex = 0;
  const groups: number[][] = [];

  for (let i = 0; i < sortedDates.length; i++) {
    const groupStart = sortedDates[groupStartIndex];
    const date = sortedDates[i];

    if (date.getTime() - groupStart.getTime() > ONE_HOUR) {
      groups.push(allRates.slice(groupStartIndex, i));
      groupStartIndex = i;
    }

    if (i === dates.length - 1) {
      groups.push(allRates.slice(groupStartIndex));
    }
  }

  const totalRate = groups.reduce((acc, cur) => {
    const maxRate = Math.max(...cur);
    return acc + maxRate;
  }, 0);

  return new TollReport(totalRate);
}

const ONE_HOUR = 60 * 60 * 1000;

export type CreateTollParams = {
  vehicleType: VehicleType;
  dates: Date[];
};

export class CalculateTollException extends Error {
  constructor(message: string) {
    super(message);
  }
}
