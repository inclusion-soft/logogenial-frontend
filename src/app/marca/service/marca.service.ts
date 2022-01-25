import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MarcaModel } from 'app/admin/encuesta/model/marca-model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MarcaService  {

  urlService = 'v1/marca-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  getUrlService(): string {
    return this.urlService;
  }

    findAll(): Observable<MarcaModel[]> {
      const endpoint = this.urlService +  '/findAll';
      return this.http.get<MarcaModel[]>(endpoint);
    }
}

