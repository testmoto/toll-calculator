export enum VehicleType {
  Motorbike = 'Motorbike',
  Tractor = 'Tractor',
  Emergency = 'Emergency',
  Diplomat = 'Diplomat',
  Foreign = 'Foreign',
  Military = 'Military',
  Car = 'Car',
}

export function isValidVehicleType(
  vehicleType: string,
): vehicleType is VehicleType {
  return Object.values(VehicleType).includes(vehicleType as VehicleType);
}
