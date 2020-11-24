
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from '../../shared/collection-response';
import { environment } from '../../../../environments/environment';
import { GrupoEstudianteModel } from '../model/grupo-estudiante-model';
import { GrupoEstudianteCriteria } from '../model/grupo-estudiante-criteria';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GrupoEstudianteService {

  urlService = 'v1/grupo-estudiante-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

    search(criteria: GrupoEstudianteCriteria): Observable<CollectionResponse<GrupoEstudianteModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<GrupoEstudianteModel>>(endpoint);
    }

    create (niveles: GrupoEstudianteModel): Observable<GrupoEstudianteModel> {
      return this.http.post<GrupoEstudianteModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: GrupoEstudianteModel): Observable<GrupoEstudianteModel> {
      return this.http.put<GrupoEstudianteModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<GrupoEstudianteModel> {
      return this.http.delete<GrupoEstudianteModel>(this.urlService + '/' + nivelesId);
    }
}
