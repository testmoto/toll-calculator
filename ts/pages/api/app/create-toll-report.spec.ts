import { VehicleType } from '../domain/vehicle-type';
import { createTollReport } from './create-toll-report';

describe('create-toll-report', () => {
  describe('positive cases', () => {
    it('should return 0 if no dates are passed', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [],
      });

      expect(result.total).toBe(0);
    });

    it('should return 0 if vehicle is toll-free', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Diplomat,
        dates: [
          new Date('2022-10-28T06:00:00.000Z'),
          new Date('2022-10-28T07:00:00.000Z'),
          new Date('2022-10-28T07:35:00.000Z'),
          new Date('2022-10-28T08:00:00.000Z'),
        ],
      });

      expect(result.total).toBe(0);
    });

    it('should return 0 if date is a weekend', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-10-30T06:00:00.000Z'),
          new Date('2022-10-30T07:00:00.000Z'),
          new Date('2022-10-30T07:35:00.000Z'),
          new Date('2022-10-30T08:00:00.000Z'),
        ],
      });

      expect(result.total).toBe(0);
    });

    it('should return 0 if date is toll-free', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2013-01-01T06:00:00.000Z'),
          new Date('2013-01-01T07:00:00.000Z'),
          new Date('2013-01-01T07:35:00.000Z'),
          new Date('2013-01-01T08:00:00.000Z'),
        ],
      });

      expect(result.total).toBe(0);
    });

    it('should return 0 if time is toll-free', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-01-01T00:00:00.000Z'),
          new Date('2022-01-01T03:00:00.000Z'),
          new Date('2022-01-01T22:35:00.000Z'),
          new Date('2022-01-01T23:00:00.000Z'),
        ],
      });

      expect(result.total).toBe(0);
    });

    it('should return one fee within hour', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-10-28T12:00:00.000Z'),
          new Date('2022-10-28T12:10:00.000Z'),
          new Date('2022-10-28T12:20:00.000Z'),
          new Date('2022-10-28T12:59:59.000Z'),
        ],
      });

      expect(result.total).toBe(8);
    });

    it('should return two fees within > hour', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-10-28T12:00:00.000Z'),
          new Date('2022-10-28T12:10:00.000Z'),
          new Date('2022-10-28T12:20:00.000Z'),
          new Date('2022-10-28T12:30:00.000Z'),
          new Date('2022-10-28T13:00:00.000Z'),
        ],
      });

      expect(result.total).toBe(16);
    });

    it('should return multiple fees when separation is > hour', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-10-28T06:00:00.000Z'), // 8
          new Date('2022-10-28T07:00:00.000Z'), // 18
          new Date('2022-10-28T08:00:00.000Z'), // 13
          new Date('2022-10-28T09:00:00.000Z'), // 8
          new Date('2022-10-28T10:00:00.000Z'), // 8
        ],
      });

      expect(result.total).toBe(55);
    });

    it('should return maximum fee of 60', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-10-28T06:00:00.000Z'), // 8
          new Date('2022-10-28T07:00:00.000Z'), // 18
          new Date('2022-10-28T08:00:00.000Z'), // 13
          new Date('2022-10-28T09:00:00.000Z'), // 8
          new Date('2022-10-28T10:00:00.000Z'), // 8
          new Date('2022-10-28T11:00:00.000Z'), // 8
          new Date('2022-10-28T12:00:00.000Z'), // 8
          new Date('2022-10-28T13:00:00.000Z'), // 8
          new Date('2022-10-28T14:00:00.000Z'), // 8
          new Date('2022-10-28T15:00:00.000Z'), // 13
          new Date('2022-10-28T16:00:00.000Z'), // 18
          new Date('2022-10-28T17:00:00.000Z'), // 13
          new Date('2022-10-28T18:00:00.000Z'), // 8
        ],
      });

      expect(result.total).toBe(60);
    });

    it('should return higher rates within hour', async () => {
      const result = createTollReport({
        vehicleType: VehicleType.Car,
        dates: [
          new Date('2022-10-28T06:25:00.000Z'), // 8
          new Date('2022-10-28T06:35:00.000Z'), // 13
          new Date('2022-10-28T07:10:00.000Z'), // 18 - highest
          new Date('2022-10-28T12:00:00.000Z'), // 8
          new Date('2022-10-28T13:00:00.000Z'), // 8
        ],
      });

      expect(result.total).toBe(34);
    });
  });

  describe('negative cases', () => {
    it('should throw if invalid vehicleType', async () => {
      expect(() =>
        createTollReport({
          vehicleType: 'invalid' as VehicleType,
          dates: [
            new Date('2022-10-28T12:00:00.000Z'),
            new Date('2022-10-28T12:10:00.000Z'),
            new Date('2022-10-28T12:20:00.000Z'),
            new Date('2022-10-28T12:30:00.000Z'),
            new Date('2022-10-28T13:00:00.000Z'),
          ],
        }),
      ).toThrowError('Invalid vehicle type');
    });

    it('should throw if invalid dates', async () => {
      expect(() =>
        createTollReport({
          vehicleType: VehicleType.Car,
          dates: [
            new Date('2022-10-28T12:00:00.000Z'),
            'invalid' as unknown as Date,
          ],
        }),
      ).toThrow();
    });
  });
});
