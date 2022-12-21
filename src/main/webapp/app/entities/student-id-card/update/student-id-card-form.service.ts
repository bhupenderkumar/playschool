import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStudentIDCard, NewStudentIDCard } from '../student-id-card.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudentIDCard for edit and NewStudentIDCardFormGroupInput for create.
 */
type StudentIDCardFormGroupInput = IStudentIDCard | PartialWithRequiredKeyOf<NewStudentIDCard>;

type StudentIDCardFormDefaults = Pick<NewStudentIDCard, 'id'>;

type StudentIDCardFormGroupContent = {
  id: FormControl<IStudentIDCard['id'] | NewStudentIDCard['id']>;
  cardNumber: FormControl<IStudentIDCard['cardNumber']>;
  issueDate: FormControl<IStudentIDCard['issueDate']>;
  expiryDate: FormControl<IStudentIDCard['expiryDate']>;
  student: FormControl<IStudentIDCard['student']>;
};

export type StudentIDCardFormGroup = FormGroup<StudentIDCardFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentIDCardFormService {
  createStudentIDCardFormGroup(studentIDCard: StudentIDCardFormGroupInput = { id: null }): StudentIDCardFormGroup {
    const studentIDCardRawValue = {
      ...this.getFormDefaults(),
      ...studentIDCard,
    };
    return new FormGroup<StudentIDCardFormGroupContent>({
      id: new FormControl(
        { value: studentIDCardRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cardNumber: new FormControl(studentIDCardRawValue.cardNumber, {
        validators: [Validators.required],
      }),
      issueDate: new FormControl(studentIDCardRawValue.issueDate, {
        validators: [Validators.required],
      }),
      expiryDate: new FormControl(studentIDCardRawValue.expiryDate, {
        validators: [Validators.required],
      }),
      student: new FormControl(studentIDCardRawValue.student),
    });
  }

  getStudentIDCard(form: StudentIDCardFormGroup): IStudentIDCard | NewStudentIDCard {
    return form.getRawValue() as IStudentIDCard | NewStudentIDCard;
  }

  resetForm(form: StudentIDCardFormGroup, studentIDCard: StudentIDCardFormGroupInput): void {
    const studentIDCardRawValue = { ...this.getFormDefaults(), ...studentIDCard };
    form.reset(
      {
        ...studentIDCardRawValue,
        id: { value: studentIDCardRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StudentIDCardFormDefaults {
    return {
      id: null,
    };
  }
}
