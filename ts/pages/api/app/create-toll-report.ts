import { TollDictionary } from '../constants/toll-dictionary';
import { TollReport } from '../domain/toll-report';
import { isValidVehicleType, VehicleType } from '../domain/vehicle-type';
import { InvalidVehicleException } from './exceptions/invalid-vehicle-exception';

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
    TollDictionary.isTollFreeVehicle(vehicleType) ||
    TollDictionary.isTollFreeDate(dates[0])
  ) {
    return new TollReport(0);
  }

  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const allRates = sortedDates.map(TollDictionary.getRate);

  // Group items by chunks of at most 1-hour periods,
  // starting from the first date
  let groupStartIndex = 0;
  const groups: number[][] = [];

  for (let i = 0; i < sortedDates.length; i++) {
    const groupStart = sortedDates[groupStartIndex];
    const date = sortedDates[i];

    // If the difference between the current date and the start of the group
    // is more than 1 hour, then we need to start a new group
    if (date.getTime() - groupStart.getTime() >= ONE_HOUR) {
      groups.push(allRates.slice(groupStartIndex, i));
      groupStartIndex = i;
    }

    // Last group would never exceed 1 hour, so we need to add it manually
    if (i === dates.length - 1) groups.push(allRates.slice(groupStartIndex));
  }

  const totalSum = groups.reduce((acc, cur) => acc + Math.max(...cur), 0);
  const adjustedSum = Math.min(totalSum, TollDictionary.getMaxTollPerDay());
  return new TollReport(adjustedSum);
}

const ONE_HOUR = 60 * 60 * 1000;
