import {
  Body,
  Catch,
  createHandler,
  Post,
  ValidationPipe,
} from 'next-api-decorators';
import {
  createTollReport,
  CalculateTollException,
} from '../app/create-toll-report';
import { TollReportInput } from '../dto/toll-report-input.dto';
import { tollInterceptor } from '../interceptors/toll.interceptor';

@Catch(tollInterceptor, CalculateTollException)
class TollReportController {
  @Post()
  public async calculateToll(@Body(ValidationPipe) input: TollReportInput) {
    return createTollReport(input);
  }
}

export default createHandler(TollReportController);
