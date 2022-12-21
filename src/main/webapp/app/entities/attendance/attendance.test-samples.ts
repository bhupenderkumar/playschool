import dayjs from 'dayjs/esm';

import { IAttendance, NewAttendance } from './attendance.model';

export const sampleWithRequiredData: IAttendance = {
  id: 67192,
  date: dayjs('2022-12-21T04:47'),
  present: true,
};

export const sampleWithPartialData: IAttendance = {
  id: 61584,
  date: dayjs('2022-12-20T15:51'),
  present: false,
};

export const sampleWithFullData: IAttendance = {
  id: 9030,
  date: dayjs('2022-12-21T05:06'),
  present: true,
};

export const sampleWithNewData: NewAttendance = {
  date: dayjs('2022-12-20T22:13'),
  present: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
