import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TemaCriteria } from '../models/tema-criteria';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { TemaModel } from '../models/tema-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  urlService = 'v1/tema-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

    search(criteria: TemaCriteria): Observable<CollectionResponse<TemaModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<TemaModel>>(endpoint);
    }

    findAll(): Observable<TemaModel[]> {
      const endpoint = this.urlService +  '/findAll';
      return this.http.get<TemaModel[]>(endpoint);
    }

    create (tema: TemaModel): Observable<TemaModel> {
      return this.http.post<TemaModel>(this.urlService, tema, httpOptions);
    }

    update (tema: TemaModel): Observable<TemaModel> {
      return this.http.put<TemaModel>(this.urlService, tema, httpOptions);
    }

    delete (temaId: number): Observable<TemaModel> {
      return this.http.delete<TemaModel>(this.urlService + '/' + temaId);
    }
}
