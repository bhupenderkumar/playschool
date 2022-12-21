import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHome } from '../home.model';
import { HomeService } from '../service/home.service';

@Injectable({ providedIn: 'root' })
export class HomeRoutingResolveService implements Resolve<IHome | null> {
  constructor(protected service: HomeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHome | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((home: HttpResponse<IHome>) => {
          if (home.body) {
            return of(home.body);
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
