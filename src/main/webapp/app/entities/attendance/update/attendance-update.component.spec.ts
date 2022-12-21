import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttendanceFormService } from './attendance-form.service';
import { AttendanceService } from '../service/attendance.service';
import { IAttendance } from '../attendance.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { AttendanceUpdateComponent } from './attendance-update.component';

describe('Attendance Management Update Component', () => {
  let comp: AttendanceUpdateComponent;
  let fixture: ComponentFixture<AttendanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attendanceFormService: AttendanceFormService;
  let attendanceService: AttendanceService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AttendanceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AttendanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttendanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attendanceFormService = TestBed.inject(AttendanceFormService);
    attendanceService = TestBed.inject(AttendanceService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const attendance: IAttendance = { id: 456 };
      const student: IStudent = { id: 15206 };
      attendance.student = student;

      const studentCollection: IStudent[] = [{ id: 92158 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining)
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attendance: IAttendance = { id: 456 };
      const student: IStudent = { id: 10802 };
      attendance.student = student;

      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.attendance).toEqual(attendance);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendance>>();
      const attendance = { id: 123 };
      jest.spyOn(attendanceFormService, 'getAttendance').mockReturnValue(attendance);
      jest.spyOn(attendanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attendance }));
      saveSubject.complete();

      // THEN
      expect(attendanceFormService.getAttendance).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attendanceService.update).toHaveBeenCalledWith(expect.objectContaining(attendance));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendance>>();
      const attendance = { id: 123 };
      jest.spyOn(attendanceFormService, 'getAttendance').mockReturnValue({ id: null });
      jest.spyOn(attendanceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendance: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attendance }));
      saveSubject.complete();

      // THEN
      expect(attendanceFormService.getAttendance).toHaveBeenCalled();
      expect(attendanceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendance>>();
      const attendance = { id: 123 };
      jest.spyOn(attendanceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attendanceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
