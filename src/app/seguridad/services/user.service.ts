import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    urlService = 'v1/usuario-api';
    constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }
  register(data: UsuarioModel): Observable<any> {
    const endPoint = this.urlService + '/create';
    return this.http.post<any>(endPoint, data);
  }

  findAllEstudiantes(): Observable<UsuarioModel[]> {
    const endpoint = this.urlService +  '/findAllStudends';
    return this.http.get<UsuarioModel[]>(endpoint);
  }

  findAllDocentes(): Observable<UsuarioModel[]> {
    const endpoint = this.urlService +  '/findAllTeachers';
    return this.http.get<UsuarioModel[]>(endpoint);
  }
}
