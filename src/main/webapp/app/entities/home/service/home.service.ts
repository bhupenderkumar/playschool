import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHome, NewHome } from '../home.model';

export type PartialUpdateHome = Partial<IHome> & Pick<IHome, 'id'>;

export type EntityResponseType = HttpResponse<IHome>;
export type EntityArrayResponseType = HttpResponse<IHome[]>;

@Injectable({ providedIn: 'root' })
export class HomeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/homes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(home: NewHome): Observable<EntityResponseType> {
    return this.http.post<IHome>(this.resourceUrl, home, { observe: 'response' });
  }

  update(home: IHome): Observable<EntityResponseType> {
    return this.http.put<IHome>(`${this.resourceUrl}/${this.getHomeIdentifier(home)}`, home, { observe: 'response' });
  }

  partialUpdate(home: PartialUpdateHome): Observable<EntityResponseType> {
    return this.http.patch<IHome>(`${this.resourceUrl}/${this.getHomeIdentifier(home)}`, home, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHome>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHome[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHomeIdentifier(home: Pick<IHome, 'id'>): number {
    return home.id;
  }

  compareHome(o1: Pick<IHome, 'id'> | null, o2: Pick<IHome, 'id'> | null): boolean {
    return o1 && o2 ? this.getHomeIdentifier(o1) === this.getHomeIdentifier(o2) : o1 === o2;
  }

  addHomeToCollectionIfMissing<Type extends Pick<IHome, 'id'>>(
    homeCollection: Type[],
    ...homesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const homes: Type[] = homesToCheck.filter(isPresent);
    if (homes.length > 0) {
      const homeCollectionIdentifiers = homeCollection.map(homeItem => this.getHomeIdentifier(homeItem)!);
      const homesToAdd = homes.filter(homeItem => {
        const homeIdentifier = this.getHomeIdentifier(homeItem);
        if (homeCollectionIdentifiers.includes(homeIdentifier)) {
          return false;
        }
        homeCollectionIdentifiers.push(homeIdentifier);
        return true;
      });
      return [...homesToAdd, ...homeCollection];
    }
    return homeCollection;
  }
}
