import { TollConfig } from '../config/toll-config';
import { TollReport } from '../domain/toll-report';
import { isValidVehicleType, VehicleType } from '../domain/vehicle-type';

export type CreateTollParams = {
  vehicleType: VehicleType;
  dates: Date[];
};

export function createTollReport({
  vehicleType,
  dates,
}: CreateTollParams): TollReport {
  if (!isValidVehicleType(vehicleType)) throw new InvalidVehicleException();
  if (dates.length === 0) return new TollReport(0);

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

    if (date.getTime() - groupStart.getTime() >= ONE_HOUR) {
      groups.push(allRates.slice(groupStartIndex, i));
      groupStartIndex = i;
    }

    if (i === dates.length - 1) groups.push(allRates.slice(groupStartIndex));
  }

  const totalSum = groups.reduce((acc, cur) => acc + Math.max(...cur), 0);
  const adjustedSum = Math.min(totalSum, TollConfig.getMaxTollPerDay());
  return new TollReport(adjustedSum);
}

const ONE_HOUR = 60 * 60 * 1000;

export class InvalidVehicleException extends Error {
  constructor() {
    super('Invalid vehicle type');
  }
}
