import dayjs from 'dayjs/esm';

import { IStudentIDCard, NewStudentIDCard } from './student-id-card.model';

export const sampleWithRequiredData: IStudentIDCard = {
  id: 4111,
  cardNumber: 'Account',
  issueDate: dayjs('2022-12-21'),
  expiryDate: dayjs('2022-12-21'),
};

export const sampleWithPartialData: IStudentIDCard = {
  id: 36210,
  cardNumber: 'Tasty Administrator',
  issueDate: dayjs('2022-12-20'),
  expiryDate: dayjs('2022-12-20'),
};

export const sampleWithFullData: IStudentIDCard = {
  id: 39079,
  cardNumber: 'e-services transition Salad',
  issueDate: dayjs('2022-12-21'),
  expiryDate: dayjs('2022-12-21'),
};

export const sampleWithNewData: NewStudentIDCard = {
  cardNumber: 'magenta',
  issueDate: dayjs('2022-12-20'),
  expiryDate: dayjs('2022-12-21'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
