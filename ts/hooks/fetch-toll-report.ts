import { TollReportOutput } from '../pages/api/dto/toll-report-output.dto';

export const fetchTollReport = async (
  vehicleType: string,
  dates: Date[],
): Promise<TollReportOutput> => {
  const res = await fetch('/api/toll-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vehicleType,
      dates,
    }),
  });
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};
