import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../parent.test-samples';

import { ParentFormService } from './parent-form.service';

describe('Parent Form Service', () => {
  let service: ParentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentFormService);
  });

  describe('Service methods', () => {
    describe('createParentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createParentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            phone: expect.any(Object),
          })
        );
      });

      it('passing IParent should create a new form with FormGroup', () => {
        const formGroup = service.createParentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            phone: expect.any(Object),
          })
        );
      });
    });

    describe('getParent', () => {
      it('should return NewParent for default Parent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createParentFormGroup(sampleWithNewData);

        const parent = service.getParent(formGroup) as any;

        expect(parent).toMatchObject(sampleWithNewData);
      });

      it('should return NewParent for empty Parent initial value', () => {
        const formGroup = service.createParentFormGroup();

        const parent = service.getParent(formGroup) as any;

        expect(parent).toMatchObject({});
      });

      it('should return IParent', () => {
        const formGroup = service.createParentFormGroup(sampleWithRequiredData);

        const parent = service.getParent(formGroup) as any;

        expect(parent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IParent should not enable id FormControl', () => {
        const formGroup = service.createParentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewParent should disable id FormControl', () => {
        const formGroup = service.createParentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
