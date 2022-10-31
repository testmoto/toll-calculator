import {
  Body,
  Catch,
  createHandler,
  Post,
  ValidationPipe,
} from 'next-api-decorators';
import {
  createTollReport,
  InvalidVehicleException,
} from './app/create-toll-report';
import { VehicleType } from './domain/vehicle-type';
import { TollReportInput } from './dto/toll-report-input.dto';
import { TollReportOutput } from './dto/toll-report-output.dto';
import { invalidVehicleInterceptor } from './interceptors/invalid-vehicle.interceptor';

@Catch(invalidVehicleInterceptor, InvalidVehicleException)
class TollReportController {
  @Post()
  public handle(@Body(ValidationPipe) input: TollReportInput) {
    const report = createTollReport(input);
    return TollReportOutput.fromDomain(report);
  }
}

export default createHandler(TollReportController);
