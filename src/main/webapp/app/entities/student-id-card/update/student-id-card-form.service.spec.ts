import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../student-id-card.test-samples';

import { StudentIDCardFormService } from './student-id-card-form.service';

describe('StudentIDCard Form Service', () => {
  let service: StudentIDCardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentIDCardFormService);
  });

  describe('Service methods', () => {
    describe('createStudentIDCardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStudentIDCardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardNumber: expect.any(Object),
            issueDate: expect.any(Object),
            expiryDate: expect.any(Object),
            student: expect.any(Object),
          })
        );
      });

      it('passing IStudentIDCard should create a new form with FormGroup', () => {
        const formGroup = service.createStudentIDCardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardNumber: expect.any(Object),
            issueDate: expect.any(Object),
            expiryDate: expect.any(Object),
            student: expect.any(Object),
          })
        );
      });
    });

    describe('getStudentIDCard', () => {
      it('should return NewStudentIDCard for default StudentIDCard initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStudentIDCardFormGroup(sampleWithNewData);

        const studentIDCard = service.getStudentIDCard(formGroup) as any;

        expect(studentIDCard).toMatchObject(sampleWithNewData);
      });

      it('should return NewStudentIDCard for empty StudentIDCard initial value', () => {
        const formGroup = service.createStudentIDCardFormGroup();

        const studentIDCard = service.getStudentIDCard(formGroup) as any;

        expect(studentIDCard).toMatchObject({});
      });

      it('should return IStudentIDCard', () => {
        const formGroup = service.createStudentIDCardFormGroup(sampleWithRequiredData);

        const studentIDCard = service.getStudentIDCard(formGroup) as any;

        expect(studentIDCard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStudentIDCard should not enable id FormControl', () => {
        const formGroup = service.createStudentIDCardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStudentIDCard should disable id FormControl', () => {
        const formGroup = service.createStudentIDCardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
