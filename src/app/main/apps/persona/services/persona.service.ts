import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Persona } from '../model/persona';
import { environment } from 'environments/environment';
import { CollectionResponse } from '../../shared/CollectionResponse';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
    urlService = '/persona-api';
    constructor(private http: HttpClient) { }
   
    // listTodos (request) {
    //   const endpoint = environment.apiUrl + this.urlService + '/search?pageIndex='
    //     + request.pageIndex +'&pageSize='+request.pageSize;
    //   const params = request;
    //   return this.http.get(endpoint);
    //   //return this.http.get(endpoint, { params });
    // }

    listTodos(request: any): Observable<CollectionResponse<Persona>> {
        const endpoint = environment.apiUrl + this.urlService + '/search?pageIndex='
         + request.pageIndex +'&pageSize='+request.pageSize
        return this.http.get<CollectionResponse<Persona>>(endpoint);
      }
  }