import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LeccionModel } from '../model/leccion-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LeccionService  {

  urlService = 'v1/lecciones-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  findAllByGrupoNivelTemaId(grupoNivelTemaId: number): Observable<LeccionModel[]> {
    const endpoint = this.urlService +  '/findAllByGrupoNivelTemaId/' + grupoNivelTemaId;
    return this.http.get<LeccionModel[]>(endpoint);
  }

  findAll(): Observable<LeccionModel[]> {
    const endpoint = this.urlService +  '/findAll';
    return this.http.get<LeccionModel[]>(endpoint);
  }

    create (niveles: LeccionModel): Observable<LeccionModel> {
      return this.http.post<LeccionModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: LeccionModel): Observable<LeccionModel> {
      return this.http.put<LeccionModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<LeccionModel> {
      return this.http.delete<LeccionModel>(this.urlService + '/' + nivelesId);
    }
}
