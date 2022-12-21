import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StudentIDCardFormService } from './student-id-card-form.service';
import { StudentIDCardService } from '../service/student-id-card.service';
import { IStudentIDCard } from '../student-id-card.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { StudentIDCardUpdateComponent } from './student-id-card-update.component';

describe('StudentIDCard Management Update Component', () => {
  let comp: StudentIDCardUpdateComponent;
  let fixture: ComponentFixture<StudentIDCardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentIDCardFormService: StudentIDCardFormService;
  let studentIDCardService: StudentIDCardService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StudentIDCardUpdateComponent],
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
      .overrideTemplate(StudentIDCardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentIDCardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentIDCardFormService = TestBed.inject(StudentIDCardFormService);
    studentIDCardService = TestBed.inject(StudentIDCardService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const studentIDCard: IStudentIDCard = { id: 456 };
      const student: IStudent = { id: 1261 };
      studentIDCard.student = student;

      const studentCollection: IStudent[] = [{ id: 8336 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studentIDCard });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining)
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const studentIDCard: IStudentIDCard = { id: 456 };
      const student: IStudent = { id: 95807 };
      studentIDCard.student = student;

      activatedRoute.data = of({ studentIDCard });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.studentIDCard).toEqual(studentIDCard);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentIDCard>>();
      const studentIDCard = { id: 123 };
      jest.spyOn(studentIDCardFormService, 'getStudentIDCard').mockReturnValue(studentIDCard);
      jest.spyOn(studentIDCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentIDCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentIDCard }));
      saveSubject.complete();

      // THEN
      expect(studentIDCardFormService.getStudentIDCard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentIDCardService.update).toHaveBeenCalledWith(expect.objectContaining(studentIDCard));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentIDCard>>();
      const studentIDCard = { id: 123 };
      jest.spyOn(studentIDCardFormService, 'getStudentIDCard').mockReturnValue({ id: null });
      jest.spyOn(studentIDCardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentIDCard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentIDCard }));
      saveSubject.complete();

      // THEN
      expect(studentIDCardFormService.getStudentIDCard).toHaveBeenCalled();
      expect(studentIDCardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentIDCard>>();
      const studentIDCard = { id: 123 };
      jest.spyOn(studentIDCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentIDCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentIDCardService.update).toHaveBeenCalled();
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
