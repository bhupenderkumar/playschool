import dayjs from 'dayjs/esm';
import { ITeacher } from 'app/entities/teacher/teacher.model';
import { IStudent } from 'app/entities/student/student.model';
import { IParent } from 'app/entities/parent/parent.model';

export interface INote {
  id: number;
  subject?: string | null;
  message?: string | null;
  date?: dayjs.Dayjs | null;
  teacher?: Pick<ITeacher, 'id'> | null;
  student?: Pick<IStudent, 'id'> | null;
  parent?: Pick<IParent, 'id'> | null;
}

export type NewNote = Omit<INote, 'id'> & { id: null };
