import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from '../../shared/collection-response';
import { environment } from '../../../../environments/environment';
import { GrupoNivelTemaCriteria } from '../model/grupo-nivel-tema-criteria';
import { GrupoNivelTemaModel } from '../model/grupo-nivel-tema-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GrupoNivelTemaService {

  urlService = 'v1/grupo-nivel-tema-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

    search(criteria: GrupoNivelTemaCriteria): Observable<CollectionResponse<GrupoNivelTemaModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<GrupoNivelTemaModel>>(endpoint);
    }

    create (niveles: GrupoNivelTemaModel): Observable<GrupoNivelTemaModel> {
      return this.http.post<GrupoNivelTemaModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: GrupoNivelTemaModel): Observable<GrupoNivelTemaModel> {
      return this.http.put<GrupoNivelTemaModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<GrupoNivelTemaModel> {
      return this.http.delete<GrupoNivelTemaModel>(this.urlService + '/' + nivelesId);
    }
}
