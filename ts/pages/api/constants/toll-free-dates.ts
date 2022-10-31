const TOLL_FREE_DATES = [
  '2013-01-01',
  '2013-03-28',
  '2013-03-29',
  '2013-04-01',
  '2013-04-30',
  '2013-05-01',
  '2013-05-08',
  '2013-05-09',
  '2013-06-05',
  '2013-06-06',
  '2013-07-*',
  '2013-11-01',
  '2013-12-24',
  '2013-12-25',
  '2013-12-26',
  '2013-12-31',
];

export const TOLL_FREE_DATES_MAP = TOLL_FREE_DATES.reduce((acc, cur) => {
  const [year, month, day] = cur.split('-');
  if (!acc[year]) acc[year] = {};
  if (!acc[year][month]) acc[year][month] = {};
  if (!acc[year][month][day]) acc[year][month][day] = true;
  return acc;
}, {} as Record<string, Record<string, Record<string, boolean>>>);
