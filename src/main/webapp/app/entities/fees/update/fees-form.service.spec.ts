import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../fees.test-samples';

import { FeesFormService } from './fees-form.service';

describe('Fees Form Service', () => {
  let service: FeesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeesFormService);
  });

  describe('Service methods', () => {
    describe('createFeesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFeesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            dueDate: expect.any(Object),
            paid: expect.any(Object),
            student: expect.any(Object),
          })
        );
      });

      it('passing IFees should create a new form with FormGroup', () => {
        const formGroup = service.createFeesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            dueDate: expect.any(Object),
            paid: expect.any(Object),
            student: expect.any(Object),
          })
        );
      });
    });

    describe('getFees', () => {
      it('should return NewFees for default Fees initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFeesFormGroup(sampleWithNewData);

        const fees = service.getFees(formGroup) as any;

        expect(fees).toMatchObject(sampleWithNewData);
      });

      it('should return NewFees for empty Fees initial value', () => {
        const formGroup = service.createFeesFormGroup();

        const fees = service.getFees(formGroup) as any;

        expect(fees).toMatchObject({});
      });

      it('should return IFees', () => {
        const formGroup = service.createFeesFormGroup(sampleWithRequiredData);

        const fees = service.getFees(formGroup) as any;

        expect(fees).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFees should not enable id FormControl', () => {
        const formGroup = service.createFeesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFees should disable id FormControl', () => {
        const formGroup = service.createFeesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
