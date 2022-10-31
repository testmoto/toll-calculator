import { NextApiRequest, NextApiResponse } from 'next';
import { InvalidVehicleException } from '../app/create-toll-report';

export function invalidVehicleInterceptor(
  error: InvalidVehicleException,
  _: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(400).json({
    message: error.message,
  });
}
