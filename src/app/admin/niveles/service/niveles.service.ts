import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { CollectionResponse } from '../../shared/collection-response';
import { environment } from '../../../../environments/environment';
import { NivelesCriteria } from '../model/niveles-criteria';
import { NivelesModel } from '../model/niveles-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NivelesService {

  urlService = 'v1/niveles-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

    search(criteria: NivelesCriteria): Observable<CollectionResponse<NivelesModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<NivelesModel>>(endpoint);
    }

    create (niveles: NivelesModel): Observable<NivelesModel> {
      return this.http.post<NivelesModel>(this.urlService, niveles, httpOptions);
    }

    update (niveles: NivelesModel): Observable<NivelesModel> {
      return this.http.put<NivelesModel>(this.urlService, niveles, httpOptions);
    }

    delete (nivelesId: number): Observable<NivelesModel> {
      return this.http.delete<NivelesModel>(this.urlService + '/' + nivelesId);
    }
}
