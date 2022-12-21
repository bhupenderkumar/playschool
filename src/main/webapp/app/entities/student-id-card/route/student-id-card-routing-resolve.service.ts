import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStudentIDCard } from '../student-id-card.model';
import { StudentIDCardService } from '../service/student-id-card.service';

@Injectable({ providedIn: 'root' })
export class StudentIDCardRoutingResolveService implements Resolve<IStudentIDCard | null> {
  constructor(protected service: StudentIDCardService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStudentIDCard | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((studentIDCard: HttpResponse<IStudentIDCard>) => {
          if (studentIDCard.body) {
            return of(studentIDCard.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
