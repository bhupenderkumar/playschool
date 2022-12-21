import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { HomeFormService, HomeFormGroup } from './home-form.service';
import { IHome } from '../home.model';
import { HomeService } from '../service/home.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-home-update',
  templateUrl: './home-update.component.html',
})
export class HomeUpdateComponent implements OnInit {
  isSaving = false;
  home: IHome | null = null;

  editForm: HomeFormGroup = this.homeFormService.createHomeFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected homeService: HomeService,
    protected homeFormService: HomeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ home }) => {
      this.home = home;
      if (home) {
        this.updateForm(home);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('schoolApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const home = this.homeFormService.getHome(this.editForm);
    if (home.id !== null) {
      this.subscribeToSaveResponse(this.homeService.update(home));
    } else {
      this.subscribeToSaveResponse(this.homeService.create(home));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHome>>): void {
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

  protected updateForm(home: IHome): void {
    this.home = home;
    this.homeFormService.resetForm(this.editForm, home);
  }
}
