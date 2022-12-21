import dayjs from 'dayjs/esm';

import { INote, NewNote } from './note.model';

export const sampleWithRequiredData: INote = {
  id: 79739,
  subject: 'deposit Liaison',
  message: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-12-20T22:59'),
};

export const sampleWithPartialData: INote = {
  id: 64759,
  subject: 'payment Garden Developer',
  message: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-12-21T00:41'),
};

export const sampleWithFullData: INote = {
  id: 33537,
  subject: 'Metal',
  message: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-12-20T18:49'),
};

export const sampleWithNewData: NewNote = {
  subject: 'Harbor Ouguiya cross-platform',
  message: '../fake-data/blob/hipster.txt',
  date: dayjs('2022-12-20T23:33'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
