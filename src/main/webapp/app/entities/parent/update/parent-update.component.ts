import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ParentFormService, ParentFormGroup } from './parent-form.service';
import { IParent } from '../parent.model';
import { ParentService } from '../service/parent.service';

@Component({
  selector: 'jhi-parent-update',
  templateUrl: './parent-update.component.html',
})
export class ParentUpdateComponent implements OnInit {
  isSaving = false;
  parent: IParent | null = null;

  editForm: ParentFormGroup = this.parentFormService.createParentFormGroup();

  constructor(
    protected parentService: ParentService,
    protected parentFormService: ParentFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parent }) => {
      this.parent = parent;
      if (parent) {
        this.updateForm(parent);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parent = this.parentFormService.getParent(this.editForm);
    if (parent.id !== null) {
      this.subscribeToSaveResponse(this.parentService.update(parent));
    } else {
      this.subscribeToSaveResponse(this.parentService.create(parent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(parent: IParent): void {
    this.parent = parent;
    this.parentFormService.resetForm(this.editForm, parent);
  }
}
