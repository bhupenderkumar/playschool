import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudentIDCard, NewStudentIDCard } from '../student-id-card.model';

export type PartialUpdateStudentIDCard = Partial<IStudentIDCard> & Pick<IStudentIDCard, 'id'>;

type RestOf<T extends IStudentIDCard | NewStudentIDCard> = Omit<T, 'issueDate' | 'expiryDate'> & {
  issueDate?: string | null;
  expiryDate?: string | null;
};

export type RestStudentIDCard = RestOf<IStudentIDCard>;

export type NewRestStudentIDCard = RestOf<NewStudentIDCard>;

export type PartialUpdateRestStudentIDCard = RestOf<PartialUpdateStudentIDCard>;

export type EntityResponseType = HttpResponse<IStudentIDCard>;
export type EntityArrayResponseType = HttpResponse<IStudentIDCard[]>;

@Injectable({ providedIn: 'root' })
export class StudentIDCardService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/student-id-cards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(studentIDCard: NewStudentIDCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studentIDCard);
    return this.http
      .post<RestStudentIDCard>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(studentIDCard: IStudentIDCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studentIDCard);
    return this.http
      .put<RestStudentIDCard>(`${this.resourceUrl}/${this.getStudentIDCardIdentifier(studentIDCard)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(studentIDCard: PartialUpdateStudentIDCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(studentIDCard);
    return this.http
      .patch<RestStudentIDCard>(`${this.resourceUrl}/${this.getStudentIDCardIdentifier(studentIDCard)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStudentIDCard>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStudentIDCard[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStudentIDCardIdentifier(studentIDCard: Pick<IStudentIDCard, 'id'>): number {
    return studentIDCard.id;
  }

  compareStudentIDCard(o1: Pick<IStudentIDCard, 'id'> | null, o2: Pick<IStudentIDCard, 'id'> | null): boolean {
    return o1 && o2 ? this.getStudentIDCardIdentifier(o1) === this.getStudentIDCardIdentifier(o2) : o1 === o2;
  }

  addStudentIDCardToCollectionIfMissing<Type extends Pick<IStudentIDCard, 'id'>>(
    studentIDCardCollection: Type[],
    ...studentIDCardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const studentIDCards: Type[] = studentIDCardsToCheck.filter(isPresent);
    if (studentIDCards.length > 0) {
      const studentIDCardCollectionIdentifiers = studentIDCardCollection.map(
        studentIDCardItem => this.getStudentIDCardIdentifier(studentIDCardItem)!
      );
      const studentIDCardsToAdd = studentIDCards.filter(studentIDCardItem => {
        const studentIDCardIdentifier = this.getStudentIDCardIdentifier(studentIDCardItem);
        if (studentIDCardCollectionIdentifiers.includes(studentIDCardIdentifier)) {
          return false;
        }
        studentIDCardCollectionIdentifiers.push(studentIDCardIdentifier);
        return true;
      });
      return [...studentIDCardsToAdd, ...studentIDCardCollection];
    }
    return studentIDCardCollection;
  }

  protected convertDateFromClient<T extends IStudentIDCard | NewStudentIDCard | PartialUpdateStudentIDCard>(studentIDCard: T): RestOf<T> {
    return {
      ...studentIDCard,
      issueDate: studentIDCard.issueDate?.format(DATE_FORMAT) ?? null,
      expiryDate: studentIDCard.expiryDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restStudentIDCard: RestStudentIDCard): IStudentIDCard {
    return {
      ...restStudentIDCard,
      issueDate: restStudentIDCard.issueDate ? dayjs(restStudentIDCard.issueDate) : undefined,
      expiryDate: restStudentIDCard.expiryDate ? dayjs(restStudentIDCard.expiryDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStudentIDCard>): HttpResponse<IStudentIDCard> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStudentIDCard[]>): HttpResponse<IStudentIDCard[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
