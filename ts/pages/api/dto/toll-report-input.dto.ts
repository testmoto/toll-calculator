import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { VehicleType } from '../domain/vehicle-type';
import { IsSameDay } from '../validators/is-same-day.validator';

export class TollReportInput {
  @IsString()
  @IsEnum(VehicleType)
  public readonly vehicleType!: VehicleType;

  @IsArray()
  @IsDate({ each: true })
  @Type(() => Date)
  @IsSameDay()
  public readonly dates!: Date[];
}
