import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FeesFormService } from './fees-form.service';
import { FeesService } from '../service/fees.service';
import { IFees } from '../fees.model';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

import { FeesUpdateComponent } from './fees-update.component';

describe('Fees Management Update Component', () => {
  let comp: FeesUpdateComponent;
  let fixture: ComponentFixture<FeesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feesFormService: FeesFormService;
  let feesService: FeesService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FeesUpdateComponent],
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
      .overrideTemplate(FeesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feesFormService = TestBed.inject(FeesFormService);
    feesService = TestBed.inject(FeesService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const fees: IFees = { id: 456 };
      const student: IStudent = { id: 57081 };
      fees.student = student;

      const studentCollection: IStudent[] = [{ id: 68842 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fees });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining)
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fees: IFees = { id: 456 };
      const student: IStudent = { id: 1988 };
      fees.student = student;

      activatedRoute.data = of({ fees });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.fees).toEqual(fees);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFees>>();
      const fees = { id: 123 };
      jest.spyOn(feesFormService, 'getFees').mockReturnValue(fees);
      jest.spyOn(feesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fees });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fees }));
      saveSubject.complete();

      // THEN
      expect(feesFormService.getFees).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(feesService.update).toHaveBeenCalledWith(expect.objectContaining(fees));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFees>>();
      const fees = { id: 123 };
      jest.spyOn(feesFormService, 'getFees').mockReturnValue({ id: null });
      jest.spyOn(feesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fees: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fees }));
      saveSubject.complete();

      // THEN
      expect(feesFormService.getFees).toHaveBeenCalled();
      expect(feesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFees>>();
      const fees = { id: 123 };
      jest.spyOn(feesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fees });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feesService.update).toHaveBeenCalled();
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
