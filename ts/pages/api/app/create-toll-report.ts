import { TollReport } from '../domain/toll-report';
import { VehicleType } from '../domain/vehicle-type';

export function createTollReport(params: CalculateTollParams): TollReport {
  const { vehicleType, dates } = params;

  return new TollReport(dates[0], 0);
}

export type CalculateTollParams = {
  vehicleType: VehicleType;
  dates: Date[];
};

export class CalculateTollException extends Error {
  constructor(message: string) {
    super(message);
  }
}
