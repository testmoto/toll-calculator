import { Button, Container, Radio, Input, Card } from '@nextui-org/react';
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { VehicleType } from './api/domain/vehicle-type';
import { TollReportOutput } from './api/dto/toll-report-output.dto';

export default function Home() {
  const [toll, setToll] = useState(0);
  const [error, setError] = useState(0);
  const [dates, setDates] = useState([] as Date[]);
  const dateRef = useRef(null as HTMLInputElement | null);
  const hoursRef = useRef(null as HTMLInputElement | null);
  const minutesRef = useRef(null as HTMLInputElement | null);
  const [vehicle, setVehicle] = useState('');

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(ev => {
    ev.preventDefault();
    const date = new Date(dateRef.current!.value);
    const hours = parseInt(hoursRef.current!.value, 10);
    const minutes = parseInt(minutesRef.current!.value, 10);
    date.setUTCHours(hours, minutes);
    setDates(dates => [...dates, date]);
  }, []);

  const handleDeleteItem = useCallback((index: number) => {
    setDates(dates => dates.filter((_, i) => i !== index));
  }, []);

  useEffect(
    function fetchDataOnDatesChange() {
      if (dates.length === 0 || !vehicle) return;

      const cancelToken = new AbortController();
      fetchData(vehicle, dates)
        .then((data: TollReportOutput) => {
          if (cancelToken.signal.aborted) return;
          setToll(data.total);
        })
        .catch(err => {
          if (cancelToken.signal.aborted) return;
          setError(err.message);
        });

      return () => cancelToken.abort();
    },
    [dates, vehicle],
  );

  return (
    <Container>
      <div>
        <form onSubmit={handleSubmit}>
          <Radio.Group onChange={setVehicle} label="Vehicle">
            {vehicleTypeOptions.map(item => (
              <Radio key={item} value={item}>
                {item}
              </Radio>
            ))}
            <Radio value="Invalid">Invalid</Radio>
          </Radio.Group>
          <Input type="string" ref={dateRef}></Input>
          <Input type="number" ref={hoursRef}></Input>
          <Input type="number" ref={minutesRef}></Input>
          <Button type="submit">Add entry</Button>
        </form>
      </div>
      <div>Current sum: {toll}</div>
      <div>Error: {error}</div>
      <div>
        {dates.map(date => (
          <Card key={date.toISOString()}>
            {date.toISOString()}
            <Button
              size="xs"
              onClick={() => handleDeleteItem(dates.indexOf(date))}
            >
              X
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}

const vehicleTypeOptions = Object.values(VehicleType);

const fetchData = async (vehicleType: string, dates: Date[]) => {
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
  return data;
};
