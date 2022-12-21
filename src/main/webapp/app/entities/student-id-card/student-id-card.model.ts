import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';

export interface IStudentIDCard {
  id: number;
  cardNumber?: string | null;
  issueDate?: dayjs.Dayjs | null;
  expiryDate?: dayjs.Dayjs | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewStudentIDCard = Omit<IStudentIDCard, 'id'> & { id: null };
