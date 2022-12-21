import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AttendanceFormService, AttendanceFormGroup } from './attendance-form.service';
import { IAttendance } from '../attendance.model';
import { AttendanceService } from '../service/attendance.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

@Component({
  selector: 'jhi-attendance-update',
  templateUrl: './attendance-update.component.html',
})
export class AttendanceUpdateComponent implements OnInit {
  isSaving = false;
  attendance: IAttendance | null = null;

  studentsSharedCollection: IStudent[] = [];

  editForm: AttendanceFormGroup = this.attendanceFormService.createAttendanceFormGroup();

  constructor(
    protected attendanceService: AttendanceService,
    protected attendanceFormService: AttendanceFormService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attendance }) => {
      this.attendance = attendance;
      if (attendance) {
        this.updateForm(attendance);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attendance = this.attendanceFormService.getAttendance(this.editForm);
    if (attendance.id !== null) {
      this.subscribeToSaveResponse(this.attendanceService.update(attendance));
    } else {
      this.subscribeToSaveResponse(this.attendanceService.create(attendance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttendance>>): void {
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

  protected updateForm(attendance: IAttendance): void {
    this.attendance = attendance;
    this.attendanceFormService.resetForm(this.editForm, attendance);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      attendance.student
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.attendance?.student))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
