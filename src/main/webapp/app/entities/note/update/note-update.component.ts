import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NoteFormService, NoteFormGroup } from './note-form.service';
import { INote } from '../note.model';
import { NoteService } from '../service/note.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITeacher } from 'app/entities/teacher/teacher.model';
import { TeacherService } from 'app/entities/teacher/service/teacher.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IParent } from 'app/entities/parent/parent.model';
import { ParentService } from 'app/entities/parent/service/parent.service';

@Component({
  selector: 'jhi-note-update',
  templateUrl: './note-update.component.html',
})
export class NoteUpdateComponent implements OnInit {
  isSaving = false;
  note: INote | null = null;

  teachersSharedCollection: ITeacher[] = [];
  studentsSharedCollection: IStudent[] = [];
  parentsSharedCollection: IParent[] = [];

  editForm: NoteFormGroup = this.noteFormService.createNoteFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected noteService: NoteService,
    protected noteFormService: NoteFormService,
    protected teacherService: TeacherService,
    protected studentService: StudentService,
    protected parentService: ParentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTeacher = (o1: ITeacher | null, o2: ITeacher | null): boolean => this.teacherService.compareTeacher(o1, o2);

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  compareParent = (o1: IParent | null, o2: IParent | null): boolean => this.parentService.compareParent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ note }) => {
      this.note = note;
      if (note) {
        this.updateForm(note);
      }

      this.loadRelationshipsOptions();
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
    const note = this.noteFormService.getNote(this.editForm);
    if (note.id !== null) {
      this.subscribeToSaveResponse(this.noteService.update(note));
    } else {
      this.subscribeToSaveResponse(this.noteService.create(note));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INote>>): void {
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

  protected updateForm(note: INote): void {
    this.note = note;
    this.noteFormService.resetForm(this.editForm, note);

    this.teachersSharedCollection = this.teacherService.addTeacherToCollectionIfMissing<ITeacher>(
      this.teachersSharedCollection,
      note.teacher
    );
    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      note.student
    );
    this.parentsSharedCollection = this.parentService.addParentToCollectionIfMissing<IParent>(this.parentsSharedCollection, note.parent);
  }

  protected loadRelationshipsOptions(): void {
    this.teacherService
      .query()
      .pipe(map((res: HttpResponse<ITeacher[]>) => res.body ?? []))
      .pipe(map((teachers: ITeacher[]) => this.teacherService.addTeacherToCollectionIfMissing<ITeacher>(teachers, this.note?.teacher)))
      .subscribe((teachers: ITeacher[]) => (this.teachersSharedCollection = teachers));

    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.note?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.parentService
      .query()
      .pipe(map((res: HttpResponse<IParent[]>) => res.body ?? []))
      .pipe(map((parents: IParent[]) => this.parentService.addParentToCollectionIfMissing<IParent>(parents, this.note?.parent)))
      .subscribe((parents: IParent[]) => (this.parentsSharedCollection = parents));
  }
}
