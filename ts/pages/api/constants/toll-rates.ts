import { TollRate } from '../domain/toll-rate';

// from is inclusive, to is exclusive
const TOLL_RATES_CONFIG = [
  {
    from: '06:00',
    to: '06:30',
    rate: 8,
  },
  {
    from: '06:30',
    to: '07:00',
    rate: 13,
  },
  {
    from: '07:00',
    to: '08:00',
    rate: 18,
  },
  {
    from: '08:00',
    to: '08:30',
    rate: 13,
  },
  {
    from: '08:30',
    to: '15:00',
    rate: 8,
  },
  {
    from: '15:00',
    to: '15:30',
    rate: 13,
  },
  {
    from: '15:30',
    to: '17:00',
    rate: 18,
  },
  {
    from: '17:00',
    to: '18:00',
    rate: 13,
  },
  {
    from: '18:00',
    to: '18:30',
    rate: 8,
  },
];

export const TOLL_RATES = TOLL_RATES_CONFIG.map(configItem => {
  const [fromHour, fromMinute] = configItem.from.split(':');
  const [toHour, toMinute] = configItem.to.split(':');

  // offsets from start of day in ms
  const fromOffset = (Number(fromHour) * 60 + Number(fromMinute)) * 60 * 1000;
  const toOffset = (Number(toHour) * 60 + Number(toMinute)) * 60 * 1000;
  return new TollRate(fromOffset, toOffset, Number(configItem.rate));
});

export const MAX_TOLL_PER_DAY = 60;
