import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FeesFormService, FeesFormGroup } from './fees-form.service';
import { IFees } from '../fees.model';
import { FeesService } from '../service/fees.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

@Component({
  selector: 'jhi-fees-update',
  templateUrl: './fees-update.component.html',
})
export class FeesUpdateComponent implements OnInit {
  isSaving = false;
  fees: IFees | null = null;

  studentsSharedCollection: IStudent[] = [];

  editForm: FeesFormGroup = this.feesFormService.createFeesFormGroup();

  constructor(
    protected feesService: FeesService,
    protected feesFormService: FeesFormService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fees }) => {
      this.fees = fees;
      if (fees) {
        this.updateForm(fees);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fees = this.feesFormService.getFees(this.editForm);
    if (fees.id !== null) {
      this.subscribeToSaveResponse(this.feesService.update(fees));
    } else {
      this.subscribeToSaveResponse(this.feesService.create(fees));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFees>>): void {
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

  protected updateForm(fees: IFees): void {
    this.fees = fees;
    this.feesFormService.resetForm(this.editForm, fees);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      fees.student
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.fees?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
