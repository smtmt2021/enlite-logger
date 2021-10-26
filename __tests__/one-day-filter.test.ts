/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import { OneDayFilter } from '../src/libs/one-day-filter';

const ONE_SECOUND = 1000;
const ONE_MINUTE = 60 * ONE_SECOUND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

test('one-day-filter', () => {
  const filter = new OneDayFilter();
  let t = 0;
  for (; t < ONE_DAY; t += ONE_MINUTE) {
    const time = new Date(2000, 0, 1, 0, 0, 0, t);
    filter.push({
      watt: 100,
      time
    });
  }
  expect(filter.hour).toMatchSnapshot();
  expect(filter.day).toMatchSnapshot();

  filter.push({
    watt: 600,
    time: new Date(2000, 0, 1, 0, 0, 0, t)
  });
  expect(filter.hour).toMatchSnapshot();
  expect(filter.day).toMatchSnapshot();

  for (let i = 0; i < 59; ++i) {
    t += ONE_MINUTE;
    const time = new Date(2000, 0, 1, 0, 0, 0, t);
    filter.push({
      watt: 600,
      time
    });
  }
  expect(filter.hour).toMatchSnapshot();
  expect(filter.day).toMatchSnapshot();
});
