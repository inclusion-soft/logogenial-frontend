import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ResultadoPreguntaModel } from '../model/resultado-pregunta-model';

@Injectable({
  providedIn: 'root'
})
export class ResultadosPreguntaService {

  urlService = 'v1/resultado-pregunta-api';
  constructor(private http: HttpClient) {
    //this.urlService = environment.url + this.urlService;
  }

  findAllByUsuarioId(usuarioId: number): Observable<any> {
    const endpoint = this.urlService + '/findAllPuntajeByUsuarioEstudianteId/' + usuarioId;
    return this.http.get<ResultadoPreguntaModel[]>(endpoint);
  }

  findLastHitsByFechaAndUsuarioId(usuarioId: number, cantidad: number): Observable<any> {
    const endpoint = this.urlService + '/findLastHitsByFechaAndUsuarioId/' + usuarioId + '/' + cantidad;
    return this.http.get<ResultadoPreguntaModel[]>(endpoint);
  }
}
