import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParent, NewParent } from '../parent.model';

export type PartialUpdateParent = Partial<IParent> & Pick<IParent, 'id'>;

export type EntityResponseType = HttpResponse<IParent>;
export type EntityArrayResponseType = HttpResponse<IParent[]>;

@Injectable({ providedIn: 'root' })
export class ParentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parent: NewParent): Observable<EntityResponseType> {
    return this.http.post<IParent>(this.resourceUrl, parent, { observe: 'response' });
  }

  update(parent: IParent): Observable<EntityResponseType> {
    return this.http.put<IParent>(`${this.resourceUrl}/${this.getParentIdentifier(parent)}`, parent, { observe: 'response' });
  }

  partialUpdate(parent: PartialUpdateParent): Observable<EntityResponseType> {
    return this.http.patch<IParent>(`${this.resourceUrl}/${this.getParentIdentifier(parent)}`, parent, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getParentIdentifier(parent: Pick<IParent, 'id'>): number {
    return parent.id;
  }

  compareParent(o1: Pick<IParent, 'id'> | null, o2: Pick<IParent, 'id'> | null): boolean {
    return o1 && o2 ? this.getParentIdentifier(o1) === this.getParentIdentifier(o2) : o1 === o2;
  }

  addParentToCollectionIfMissing<Type extends Pick<IParent, 'id'>>(
    parentCollection: Type[],
    ...parentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const parents: Type[] = parentsToCheck.filter(isPresent);
    if (parents.length > 0) {
      const parentCollectionIdentifiers = parentCollection.map(parentItem => this.getParentIdentifier(parentItem)!);
      const parentsToAdd = parents.filter(parentItem => {
        const parentIdentifier = this.getParentIdentifier(parentItem);
        if (parentCollectionIdentifiers.includes(parentIdentifier)) {
          return false;
        }
        parentCollectionIdentifiers.push(parentIdentifier);
        return true;
      });
      return [...parentsToAdd, ...parentCollection];
    }
    return parentCollection;
  }
}
