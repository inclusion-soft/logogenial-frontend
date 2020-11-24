import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DatageniaCriteria } from '../models/datagenia-criteria';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'app/admin/shared/collection-response';
import { DatageniaModel } from '../models/datagenia-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DatageniaService {

  private urlService = 'v1/datagenia-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  getEndPoint() {
    return this.urlService;
  }

    search(criteria: DatageniaCriteria): Observable<CollectionResponse<DatageniaModel>> {
      const endpoint = this.urlService +  '/search?' + criteria.getUrlParameters();
      return this.http.get<CollectionResponse<DatageniaModel>>(endpoint);
    }

    create (tema: DatageniaModel): Observable<DatageniaModel> {
      return this.http.post<DatageniaModel>(this.urlService, tema, httpOptions);
    }

    update (tema: DatageniaModel): Observable<DatageniaModel> {
      return this.http.put<DatageniaModel>(this.urlService, tema, httpOptions);
    }

    delete (temaId: number): Observable<DatageniaModel> {
      return this.http.delete<DatageniaModel>(this.urlService + '/deleteById?id=' + temaId);
    }
}
