//#region imports
import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  Input,
  Select,
  Space,
  Stack,
  Text,
} from '@mantine/core';

import { parseISO } from 'date-fns';
import {
  FormEventHandler,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { fetchTollReport } from '../hooks/fetch-toll-report';
import { VehicleType } from './api/domain/vehicle-type';
import { TollReportOutput } from './api/dto/toll-report-output.dto';
import { getISODateString, getISOTimeString } from './api/lib/get-iso-date';

//#endregion

export default function Home() {
  const [toll, setToll] = useState(0);
  const [error, setError] = useState('');
  const [dates, setDates] = useState([] as Date[]);
  const vehicleRef = useRef(null as HTMLInputElement | null);
  const dateRef = useRef(null as HTMLInputElement | null);
  const timeRef = useRef(null as HTMLInputElement | null);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(ev => {
    ev.preventDefault();
    setError('');

    const date = parseISO(
      `${dateRef.current!.value}T${timeRef.current!.value}:00Z`,
    );

    if (isNaN(date.getTime())) {
      setError('Invalid date');
    } else {
      setDates(dates => [...dates, date]);
    }
  }, []);

  const handleDeleteItem = useCallback(
    (ev: SyntheticEvent<HTMLButtonElement>) => {
      const index = Number(ev.currentTarget.dataset.index ?? -1);
      setDates(dates => dates.filter((_, i) => i !== index));
    },
    [],
  );

  useEffect(
    function fetchDataOnDatesChange() {
      setError('');
      const vehicle = vehicleRef.current!.value as VehicleType;
      if (!vehicle) return;

      const cancelToken = new AbortController();
      fetchTollReport(vehicle, dates)
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
    [dates],
  );

  return (
    <Container size="sm" sx={containerStyle}>
      <form onSubmit={handleSubmit}>
        <Group grow>
          <Select
            sx={inputStyle}
            placeholder="Pick one"
            data={vehicleTypeOptions}
            ref={vehicleRef}
            defaultValue={VehicleType.Car}
          />
          <Input
            defaultValue={defaultDate}
            sx={inputStyle}
            type="date"
            ref={dateRef}
          ></Input>
          <Input
            defaultValue={defaultTime}
            sx={inputStyle}
            type="time"
            ref={timeRef}
          ></Input>
          <Button sx={inputStyle} type="submit">
            Add entry
          </Button>
        </Group>
      </form>
      <Space />
      <h1>Toll: {toll} kr</h1>
      <Space />
      <Stack>
        {error && (
          <Alert title="Error" color="red">
            {error}
          </Alert>
        )}
        {dates.map((date, id) => (
          <Card
            withBorder
            shadow="sm"
            radius="md"
            key={date.toISOString() + id}
          >
            <Group>
              <Stack sx={stackStyle}>
                <Text>
                  <b>{formatter.format(date)}</b>
                </Text>
                <Text size="sm">{date.toISOString()}</Text>
              </Stack>
              <Button
                variant="outline"
                color="gray"
                data-index={id}
                onClick={handleDeleteItem}
              >
                Remove
              </Button>
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

// form data
const vehicleTypeOptions = Object.values(VehicleType).map(vehicleType => ({
  value: vehicleType,
  label: vehicleType,
}));
const defaultDate = getISODateString(new Date());
const defaultTime = getISOTimeString(new Date());

// styles
const inputStyle = { minWidth: 120 };
const containerStyle = { padding: '2em' };
const stackStyle = { flexGrow: 1 };

// helpers
const formatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  hour12: false,
  minute: 'numeric',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});
