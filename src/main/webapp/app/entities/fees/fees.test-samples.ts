import dayjs from 'dayjs/esm';

import { IFees, NewFees } from './fees.model';

export const sampleWithRequiredData: IFees = {
  id: 48932,
  amount: 74394,
  dueDate: dayjs('2022-12-21'),
  paid: false,
};

export const sampleWithPartialData: IFees = {
  id: 57754,
  amount: 96372,
  dueDate: dayjs('2022-12-20'),
  paid: true,
};

export const sampleWithFullData: IFees = {
  id: 21259,
  amount: 87382,
  dueDate: dayjs('2022-12-20'),
  paid: false,
};

export const sampleWithNewData: NewFees = {
  amount: 87325,
  dueDate: dayjs('2022-12-20'),
  paid: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
