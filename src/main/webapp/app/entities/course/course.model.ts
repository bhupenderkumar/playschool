import { IStudent } from 'app/entities/student/student.model';

export interface ICourse {
  id: number;
  name?: string | null;
  credits?: number | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewCourse = Omit<ICourse, 'id'> & { id: null };
