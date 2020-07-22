import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { NivelCriteria } from 'app/admin/nivel/models/nivel-criteria';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NivelService {

  urlService = '/nivel-api';
  constructor(private http: HttpClient) { }

    search(criteria: NivelCriteria): Observable<CollectionResponse<NivelModel>> {
      const endpoint = environment.apiUrl + this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<NivelModel>>(endpoint);
    }
}
