import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFees, NewFees } from '../fees.model';

export type PartialUpdateFees = Partial<IFees> & Pick<IFees, 'id'>;

type RestOf<T extends IFees | NewFees> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

export type RestFees = RestOf<IFees>;

export type NewRestFees = RestOf<NewFees>;

export type PartialUpdateRestFees = RestOf<PartialUpdateFees>;

export type EntityResponseType = HttpResponse<IFees>;
export type EntityArrayResponseType = HttpResponse<IFees[]>;

@Injectable({ providedIn: 'root' })
export class FeesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fees');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fees: NewFees): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fees);
    return this.http.post<RestFees>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(fees: IFees): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fees);
    return this.http
      .put<RestFees>(`${this.resourceUrl}/${this.getFeesIdentifier(fees)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(fees: PartialUpdateFees): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fees);
    return this.http
      .patch<RestFees>(`${this.resourceUrl}/${this.getFeesIdentifier(fees)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFees>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFees[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFeesIdentifier(fees: Pick<IFees, 'id'>): number {
    return fees.id;
  }

  compareFees(o1: Pick<IFees, 'id'> | null, o2: Pick<IFees, 'id'> | null): boolean {
    return o1 && o2 ? this.getFeesIdentifier(o1) === this.getFeesIdentifier(o2) : o1 === o2;
  }

  addFeesToCollectionIfMissing<Type extends Pick<IFees, 'id'>>(
    feesCollection: Type[],
    ...feesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const fees: Type[] = feesToCheck.filter(isPresent);
    if (fees.length > 0) {
      const feesCollectionIdentifiers = feesCollection.map(feesItem => this.getFeesIdentifier(feesItem)!);
      const feesToAdd = fees.filter(feesItem => {
        const feesIdentifier = this.getFeesIdentifier(feesItem);
        if (feesCollectionIdentifiers.includes(feesIdentifier)) {
          return false;
        }
        feesCollectionIdentifiers.push(feesIdentifier);
        return true;
      });
      return [...feesToAdd, ...feesCollection];
    }
    return feesCollection;
  }

  protected convertDateFromClient<T extends IFees | NewFees | PartialUpdateFees>(fees: T): RestOf<T> {
    return {
      ...fees,
      dueDate: fees.dueDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restFees: RestFees): IFees {
    return {
      ...restFees,
      dueDate: restFees.dueDate ? dayjs(restFees.dueDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFees>): HttpResponse<IFees> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFees[]>): HttpResponse<IFees[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
