import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFees, NewFees } from '../fees.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFees for edit and NewFeesFormGroupInput for create.
 */
type FeesFormGroupInput = IFees | PartialWithRequiredKeyOf<NewFees>;

type FeesFormDefaults = Pick<NewFees, 'id' | 'paid'>;

type FeesFormGroupContent = {
  id: FormControl<IFees['id'] | NewFees['id']>;
  amount: FormControl<IFees['amount']>;
  dueDate: FormControl<IFees['dueDate']>;
  paid: FormControl<IFees['paid']>;
  student: FormControl<IFees['student']>;
};

export type FeesFormGroup = FormGroup<FeesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FeesFormService {
  createFeesFormGroup(fees: FeesFormGroupInput = { id: null }): FeesFormGroup {
    const feesRawValue = {
      ...this.getFormDefaults(),
      ...fees,
    };
    return new FormGroup<FeesFormGroupContent>({
      id: new FormControl(
        { value: feesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      amount: new FormControl(feesRawValue.amount, {
        validators: [Validators.required],
      }),
      dueDate: new FormControl(feesRawValue.dueDate, {
        validators: [Validators.required],
      }),
      paid: new FormControl(feesRawValue.paid, {
        validators: [Validators.required],
      }),
      student: new FormControl(feesRawValue.student),
    });
  }

  getFees(form: FeesFormGroup): IFees | NewFees {
    return form.getRawValue() as IFees | NewFees;
  }

  resetForm(form: FeesFormGroup, fees: FeesFormGroupInput): void {
    const feesRawValue = { ...this.getFormDefaults(), ...fees };
    form.reset(
      {
        ...feesRawValue,
        id: { value: feesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FeesFormDefaults {
    return {
      id: null,
      paid: false,
    };
  }
}
