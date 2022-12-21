import dayjs from 'dayjs/esm';

export interface ITeacher {
  id: number;
  name?: string | null;
  subject?: string | null;
  hireDate?: dayjs.Dayjs | null;
}

export type NewTeacher = Omit<ITeacher, 'id'> & { id: null };
