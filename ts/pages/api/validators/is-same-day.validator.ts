import { registerDecorator } from 'class-validator';

import { getISODateString } from '../lib/get-iso-date';

export function IsSameDay() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSameDay',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'All dates must be on the same day',
      },
      validator: {
        validate(values: any) {
          if (values.length === 0) return true;
          if (!isDateArray(values)) return false;
          const commonDate = new Set(
            values.map(date => getISODateString(date)),
          );
          return commonDate.size === 1;
        },
      },
    });
  };
}

function isDateArray(value: unknown): value is Date[] {
  return (
    Array.isArray(value) &&
    value.every(item => item instanceof Date && !isNaN(item.getTime()))
  );
}
