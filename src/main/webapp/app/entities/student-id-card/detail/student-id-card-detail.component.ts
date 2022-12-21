import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudentIDCard } from '../student-id-card.model';

@Component({
  selector: 'jhi-student-id-card-detail',
  templateUrl: './student-id-card-detail.component.html',
})
export class StudentIDCardDetailComponent implements OnInit {
  studentIDCard: IStudentIDCard | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentIDCard }) => {
      this.studentIDCard = studentIDCard;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
