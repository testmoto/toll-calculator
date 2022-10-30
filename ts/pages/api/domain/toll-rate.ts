export class TollRate {
  constructor(
    // ms offset from midnight, inclusive
    public readonly from: number,
    // ms offset from midnight, exclusive
    public readonly to: number,
    public readonly rate: number,
  ) {}
}
