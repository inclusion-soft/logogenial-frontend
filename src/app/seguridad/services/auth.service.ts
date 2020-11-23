import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { UserLogin } from '../models/user-login';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  urlService = 'api/auth/login';
  constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }
  attemptAuth(credentials: UserLogin): Observable<any> {
    const endPoint = this.urlService;
    return this.http.post<any>(endPoint, credentials);
  }
}
