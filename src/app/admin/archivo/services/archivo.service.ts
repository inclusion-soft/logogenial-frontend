import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ArchivoModel } from '../models/archivo-model';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  urlService = 'v1/archivo-api';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }

  public getUrlBase() {
    return this.urlService;
  }

  create (archivo: File): Observable<ArchivoModel> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<ArchivoModel>(this.urlService, formData);
  }
}
