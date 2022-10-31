import {
  Body,
  Catch,
  createHandler,
  Post,
  ValidationPipe,
} from 'next-api-decorators';
import { createTollReport } from './app/create-toll-report';
import { InvalidVehicleException } from './app/exceptions/invalid-vehicle-exception';
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
