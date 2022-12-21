import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 23105,
  name: 'Franc Division Regional',
  enrollmentDate: dayjs('2022-12-20'),
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  homeAddress: 'PCI',
  emergencyContact: 'Garden transmit synergistic',
};

export const sampleWithPartialData: IStudent = {
  id: 62916,
  name: 'ivory deploy',
  enrollmentDate: dayjs('2022-12-20'),
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  homeAddress: 'Carolina Baby',
  emergencyContact: 'migration streamline',
};

export const sampleWithFullData: IStudent = {
  id: 65938,
  name: 'circuit',
  enrollmentDate: dayjs('2022-12-21'),
  graduationDate: dayjs('2022-12-21'),
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  homeAddress: 'GB Money multi-state',
  emergencyContact: 'Buckinghamshire Nuevo Direct',
};

export const sampleWithNewData: NewStudent = {
  name: 'Loti',
  enrollmentDate: dayjs('2022-12-21'),
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
  homeAddress: 'Forward Albania Handmade',
  emergencyContact: 'Money wireless',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
