import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario-model';
import { UsuarioCriteria } from 'app/admin/usuario/model/usuario-criteria';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'app/admin/shared/collection-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    urlService = 'v1/usuario-api';
    constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }
  register(data: UsuarioModel): Observable<any> {
    const endPoint = this.urlService + '/createSecure';
    return this.http.post<any>(endPoint, data);
  }

  update(data: UsuarioModel): Observable<any> {
    const endPoint = this.urlService + '/update';
    return this.http.put<any>(endPoint, data);
  }

  findAllEstudiantes(): Observable<UsuarioModel[]> {
    const endpoint = this.urlService +  '/findAllStudends';
    return this.http.get<UsuarioModel[]>(endpoint);
  }

  findAllDocentes(): Observable<UsuarioModel[]> {
    const endpoint = this.urlService +  '/findAllTeachers';
    return this.http.get<UsuarioModel[]>(endpoint);
  }

  public getRoles(): Observable<any> {
    const endpoint = this.urlService +  '/getRoles';
    return this.http.get(endpoint);
  }

  search(criteria: UsuarioCriteria): Observable<CollectionResponse<UsuarioModel>> {
    const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
    return this.http.get<CollectionResponse<UsuarioModel>>(endpoint);
  }
}
