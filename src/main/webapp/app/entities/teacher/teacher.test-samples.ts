import dayjs from 'dayjs/esm';

import { ITeacher, NewTeacher } from './teacher.model';

export const sampleWithRequiredData: ITeacher = {
  id: 42798,
  name: 'Kiribati Account',
  subject: 'bypass Berkshire web-readiness',
  hireDate: dayjs('2022-12-21'),
};

export const sampleWithPartialData: ITeacher = {
  id: 8142,
  name: 'District Account',
  subject: 'yellow Industrial Avon',
  hireDate: dayjs('2022-12-21'),
};

export const sampleWithFullData: ITeacher = {
  id: 74972,
  name: 'Cheese system indexing',
  subject: 'calculating',
  hireDate: dayjs('2022-12-20'),
};

export const sampleWithNewData: NewTeacher = {
  name: 'Practical Berkshire',
  subject: 'Drives Architect Greens',
  hireDate: dayjs('2022-12-20'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
