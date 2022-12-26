import dayjs from 'dayjs/esm';
import { IParent } from 'app/entities/parent/parent.model';

export interface IStudent {
  id: number;
  name?: string | null;
  enrollmentDate?: dayjs.Dayjs | null;
  graduationDate?: dayjs.Dayjs | null;
  photo?: string | null;
  photoContentType?: string | null;
  homeAddress?: string | null;
  emergencyContact?: string | null;
  parent?: Pick<IParent, 'id' | 'name'> | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
