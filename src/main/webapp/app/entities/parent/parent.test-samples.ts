import { IParent, NewParent } from './parent.model';

export const sampleWithRequiredData: IParent = {
  id: 76908,
  name: 'Communications',
  email: 'Dave61@gmail.com',
  phone: '(209) 540-3322',
};

export const sampleWithPartialData: IParent = {
  id: 45958,
  name: '(E.M.U.-6) Tennessee',
  email: 'Pierre48@hotmail.com',
  phone: '884-795-5961 x423',
};

export const sampleWithFullData: IParent = {
  id: 51086,
  name: 'Reunion upward-trending relationships',
  email: 'Carolina.Wilderman55@yahoo.com',
  phone: '972.484.9672 x2427',
};

export const sampleWithNewData: NewParent = {
  name: 'Towels Digitized application',
  email: 'Alexane.Barrows@gmail.com',
  phone: '(885) 242-9575 x9951',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
