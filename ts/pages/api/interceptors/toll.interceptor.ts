import { NextApiRequest, NextApiResponse } from 'next';
import { CalculateTollException } from '../app/create-toll-report';

export function tollInterceptor(
  err: CalculateTollException,
  __: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(400).json({ message: err.message });
}
