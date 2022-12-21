import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';

export interface IFees {
  id: number;
  amount?: number | null;
  dueDate?: dayjs.Dayjs | null;
  paid?: boolean | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewFees = Omit<IFees, 'id'> & { id: null };
