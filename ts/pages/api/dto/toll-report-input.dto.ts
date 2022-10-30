import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsString } from 'class-validator';
import { VehicleType } from '../domain/vehicle-type';

export class TollReportInput {
  @IsString()
  @IsEnum(VehicleType)
  public readonly vehicleType!: VehicleType;

  @IsArray()
  @IsDate({ each: true })
  @Type(() => Date)
  public readonly dates!: Date[];
}
