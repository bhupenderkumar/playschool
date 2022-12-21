import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParent } from '../parent.model';

@Component({
  selector: 'jhi-parent-detail',
  templateUrl: './parent-detail.component.html',
})
export class ParentDetailComponent implements OnInit {
  parent: IParent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parent }) => {
      this.parent = parent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
