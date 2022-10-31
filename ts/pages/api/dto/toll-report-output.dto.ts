import { TollReport } from '../domain/toll-report';

export class TollReportOutput {
  static fromDomain(report: TollReport): TollReportOutput {
    return new TollReportOutput(report.total);
  }

  private constructor(public readonly total: number) {}
}
