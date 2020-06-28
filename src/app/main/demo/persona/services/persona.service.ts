import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Persona } from '../model/persona';
import { environment } from 'environments/environment';
import { CollectionResponse } from '../../shared/CollectionResponse';
import { PersonaCriteria } from '../model/persona-criteria';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
    urlService = '/persona-api';
    constructor(private http: HttpClient) { }

      search(criteria: PersonaCriteria): Observable<CollectionResponse<Persona>> {
        const endpoint = environment.apiUrl + this.urlService +  '/search?' + criteria.getUrlParameters();
        return this.http.get<CollectionResponse<Persona>>(endpoint);
      }
  }