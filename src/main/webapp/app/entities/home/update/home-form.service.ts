import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHome, NewHome } from '../home.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHome for edit and NewHomeFormGroupInput for create.
 */
type HomeFormGroupInput = IHome | PartialWithRequiredKeyOf<NewHome>;

type HomeFormDefaults = Pick<NewHome, 'id'>;

type HomeFormGroupContent = {
  id: FormControl<IHome['id'] | NewHome['id']>;
  description: FormControl<IHome['description']>;
  sliders: FormControl<IHome['sliders']>;
  slidersContentType: FormControl<IHome['slidersContentType']>;
};

export type HomeFormGroup = FormGroup<HomeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HomeFormService {
  createHomeFormGroup(home: HomeFormGroupInput = { id: null }): HomeFormGroup {
    const homeRawValue = {
      ...this.getFormDefaults(),
      ...home,
    };
    return new FormGroup<HomeFormGroupContent>({
      id: new FormControl(
        { value: homeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(homeRawValue.description, {
        validators: [Validators.required],
      }),
      sliders: new FormControl(homeRawValue.sliders),
      slidersContentType: new FormControl(homeRawValue.slidersContentType),
    });
  }

  getHome(form: HomeFormGroup): IHome | NewHome {
    return form.getRawValue() as IHome | NewHome;
  }

  resetForm(form: HomeFormGroup, home: HomeFormGroupInput): void {
    const homeRawValue = { ...this.getFormDefaults(), ...home };
    form.reset(
      {
        ...homeRawValue,
        id: { value: homeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HomeFormDefaults {
    return {
      id: null,
    };
  }
}
