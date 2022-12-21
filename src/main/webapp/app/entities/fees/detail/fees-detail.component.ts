import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFees } from '../fees.model';

@Component({
  selector: 'jhi-fees-detail',
  templateUrl: './fees-detail.component.html',
})
export class FeesDetailComponent implements OnInit {
  fees: IFees | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fees }) => {
      this.fees = fees;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
