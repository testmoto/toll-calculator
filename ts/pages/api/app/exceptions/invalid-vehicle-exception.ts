export class InvalidVehicleException extends Error {
  constructor() {
    super('Invalid vehicle type');
  }
}
