import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PreguntaModel } from '../model/pregunta-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PreguntaService  {

  urlService = 'v1/preguntas-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  findAllByLeccionId(leccionId: number): Observable<PreguntaModel[]> {
    const endpoint = this.urlService +  '/findAllByLeccionId/' + leccionId;
    return this.http.get<PreguntaModel[]>(endpoint);
  }

  findAll(): Observable<PreguntaModel[]> {
    const endpoint = this.urlService +  '/findAll';
    return this.http.get<PreguntaModel[]>(endpoint);
  }

    create (niveles: PreguntaModel): Observable<PreguntaModel> {
      return this.http.post<PreguntaModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: PreguntaModel): Observable<PreguntaModel> {
      return this.http.put<PreguntaModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<PreguntaModel> {
      return this.http.delete<PreguntaModel>(this.urlService + '/' + nivelesId);
    }
}
