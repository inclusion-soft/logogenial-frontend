import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from '../../shared/collection-response';
import { environment } from '../../../../environments/environment';
import { GrupoNivelCriteria } from '../model/grupo-nivel-criteria';
import { GrupoNivelModel } from '../model/grupo-nivel-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GrupoNivelService {

  urlService = 'v1/grupo-nivel-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

    search(criteria: GrupoNivelCriteria): Observable<CollectionResponse<GrupoNivelModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<GrupoNivelModel>>(endpoint);
    }

    create (niveles: GrupoNivelModel): Observable<GrupoNivelModel> {
      return this.http.post<GrupoNivelModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: GrupoNivelModel): Observable<GrupoNivelModel> {
      return this.http.put<GrupoNivelModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<GrupoNivelModel> {
      return this.http.delete<GrupoNivelModel>(this.urlService + '/' + nivelesId);
    }
}
