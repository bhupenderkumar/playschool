import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../home.test-samples';

import { HomeFormService } from './home-form.service';

describe('Home Form Service', () => {
  let service: HomeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeFormService);
  });

  describe('Service methods', () => {
    describe('createHomeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHomeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            sliders: expect.any(Object),
          })
        );
      });

      it('passing IHome should create a new form with FormGroup', () => {
        const formGroup = service.createHomeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            sliders: expect.any(Object),
          })
        );
      });
    });

    describe('getHome', () => {
      it('should return NewHome for default Home initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHomeFormGroup(sampleWithNewData);

        const home = service.getHome(formGroup) as any;

        expect(home).toMatchObject(sampleWithNewData);
      });

      it('should return NewHome for empty Home initial value', () => {
        const formGroup = service.createHomeFormGroup();

        const home = service.getHome(formGroup) as any;

        expect(home).toMatchObject({});
      });

      it('should return IHome', () => {
        const formGroup = service.createHomeFormGroup(sampleWithRequiredData);

        const home = service.getHome(formGroup) as any;

        expect(home).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHome should not enable id FormControl', () => {
        const formGroup = service.createHomeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHome should disable id FormControl', () => {
        const formGroup = service.createHomeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
