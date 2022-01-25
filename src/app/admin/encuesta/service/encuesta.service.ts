import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from  'app/admin/shared/collection-response';
import { environment } from 'environments/environment';
import { EncuestaCriteria } from '../model/encuesta-criteria';
import { EncuestaModel } from '../model/encuesta-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EncuestaService  {

  urlService = 'v1/encuesta-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  getUrlService(): string {
    return this.urlService;
  }

    search(criteria: EncuestaCriteria): Observable<CollectionResponse<EncuestaModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<EncuestaModel>>(endpoint);
    }

    create (encuesta: EncuestaModel): Observable<EncuestaModel> {
      return this.http.post<EncuestaModel>(this.urlService, encuesta, httpOptions);
    }

    update (encuesta: EncuestaModel): Observable<EncuestaModel> {
      return this.http.put<EncuestaModel>(this.urlService, encuesta, httpOptions);
    }

    delete (encuestaId: number): Observable<EncuestaModel> {
      return this.http.delete<EncuestaModel>(this.urlService + '/' + encuestaId);
    }

    findAllByDocenteId(id: number): Observable<EncuestaModel[]> {
      const endpoint = this.urlService +  '/findAllByDocenteId/'+ id;
      return this.http.get<EncuestaModel[]>(endpoint);
    }
}

