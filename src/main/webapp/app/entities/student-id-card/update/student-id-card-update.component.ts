import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { StudentIDCardFormService, StudentIDCardFormGroup } from './student-id-card-form.service';
import { IStudentIDCard } from '../student-id-card.model';
import { StudentIDCardService } from '../service/student-id-card.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

@Component({
  selector: 'jhi-student-id-card-update',
  templateUrl: './student-id-card-update.component.html',
})
export class StudentIDCardUpdateComponent implements OnInit {
  isSaving = false;
  studentIDCard: IStudentIDCard | null = null;

  studentsSharedCollection: IStudent[] = [];

  editForm: StudentIDCardFormGroup = this.studentIDCardFormService.createStudentIDCardFormGroup();

  constructor(
    protected studentIDCardService: StudentIDCardService,
    protected studentIDCardFormService: StudentIDCardFormService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentIDCard }) => {
      this.studentIDCard = studentIDCard;
      if (studentIDCard) {
        this.updateForm(studentIDCard);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const studentIDCard = this.studentIDCardFormService.getStudentIDCard(this.editForm);
    if (studentIDCard.id !== null) {
      this.subscribeToSaveResponse(this.studentIDCardService.update(studentIDCard));
    } else {
      this.subscribeToSaveResponse(this.studentIDCardService.create(studentIDCard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudentIDCard>>): void {
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

  protected updateForm(studentIDCard: IStudentIDCard): void {
    this.studentIDCard = studentIDCard;
    this.studentIDCardFormService.resetForm(this.editForm, studentIDCard);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      studentIDCard.student
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.studentIDCard?.student))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
