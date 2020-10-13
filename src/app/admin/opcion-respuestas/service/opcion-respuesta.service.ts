import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { OpcionRespuestaModel } from '../model/opcion-respuesta-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OpcionRespuestaService {

  urlService = 'v1/opcion-respuestas-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  findAllByPreguntaId(leccionId: number): Observable<OpcionRespuestaModel[]> {
    const endpoint = this.urlService +  '/findAllByPreguntaId/' + leccionId;
    return this.http.get<OpcionRespuestaModel[]>(endpoint);
  }

  findAll(): Observable<OpcionRespuestaModel[]> {
    const endpoint = this.urlService +  '/findAll';
    return this.http.get<OpcionRespuestaModel[]>(endpoint);
  }

    create (niveles: OpcionRespuestaModel): Observable<OpcionRespuestaModel> {
      return this.http.post<OpcionRespuestaModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: OpcionRespuestaModel): Observable<OpcionRespuestaModel> {
      return this.http.put<OpcionRespuestaModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<OpcionRespuestaModel> {
      return this.http.delete<OpcionRespuestaModel>(this.urlService + '/' + nivelesId);
    }
}
