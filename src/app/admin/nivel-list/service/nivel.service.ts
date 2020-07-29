import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { NivelCriteria } from 'app/admin/nivel/models/nivel-criteria';
import { environment } from 'environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NivelService {

  urlService = '/nivel-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

    search(criteria: NivelCriteria): Observable<CollectionResponse<NivelModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<NivelModel>>(endpoint);
    }

    create (nivel: NivelModel): Observable<NivelModel> {
      const endpoint = this.urlService;
      return this.http.post<NivelModel>(endpoint, nivel, httpOptions);
    }

    update (nivel: NivelModel): Observable<NivelModel> {
      const endpoint = this.urlService;
      return this.http.put<NivelModel>(endpoint, nivel, httpOptions);
    }

    delete (nivelId: number): Observable<NivelModel> {
      const endpoint = this.urlService;
      return this.http.delete<NivelModel>(endpoint + '/' + nivelId);
    }
}
