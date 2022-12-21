import { IHome, NewHome } from './home.model';

export const sampleWithRequiredData: IHome = {
  id: 31305,
  description: 'quantify Solutions',
};

export const sampleWithPartialData: IHome = {
  id: 93971,
  description: 'infomediaries Usability',
};

export const sampleWithFullData: IHome = {
  id: 52279,
  description: 'Heights withdrawal Configuration',
  sliders: '../fake-data/blob/hipster.png',
  slidersContentType: 'unknown',
};

export const sampleWithNewData: NewHome = {
  description: 'Pizza',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
