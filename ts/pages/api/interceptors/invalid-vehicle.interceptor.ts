import { NextApiRequest, NextApiResponse } from 'next';
import { InvalidVehicleException } from '../app/exceptions/invalid-vehicle-exception';

export function invalidVehicleInterceptor(
  error: InvalidVehicleException,
  _: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(400).json({
    message: error.message,
  });
}
