import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { environment } from 'environments/environment';
import { GrupoCriteria } from '../model/grupo-criteria';
import { GrupoModel } from '../model/grupo-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GrupoService  {

  urlService = 'v1/grupo-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  getUrlService(): string {
    return this.urlService;
  }

    search(criteria: GrupoCriteria): Observable<CollectionResponse<GrupoModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<GrupoModel>>(endpoint);
    }

    create (grupo: GrupoModel): Observable<GrupoModel> {
      return this.http.post<GrupoModel>(this.urlService, grupo, httpOptions);
    }

    update (grupo: GrupoModel): Observable<GrupoModel> {
      return this.http.put<GrupoModel>(this.urlService, grupo, httpOptions);
    }

    delete (grupoId: number): Observable<GrupoModel> {
      return this.http.delete<GrupoModel>(this.urlService + '/' + grupoId);
    }

    findAllByDocenteId(id: number): Observable<GrupoModel[]> {
      const endpoint = this.urlService +  '/findAllByDocenteId/'+ id;
      return this.http.get<GrupoModel[]>(endpoint);
    }
}
