import { ICourse, NewCourse } from './course.model';

export const sampleWithRequiredData: ICourse = {
  id: 59109,
  name: 'multi-byte California',
  credits: 77622,
};

export const sampleWithPartialData: ICourse = {
  id: 61968,
  name: 'deposit Directives indigo',
  credits: 29564,
};

export const sampleWithFullData: ICourse = {
  id: 93488,
  name: 'Table calculating compress',
  credits: 44870,
};

export const sampleWithNewData: NewCourse = {
  name: 'Savings Savings',
  credits: 76106,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
