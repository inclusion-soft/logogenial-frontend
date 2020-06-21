import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin } from '../model/user-login';
import { TokenResultData } from '../model/token-result-data';
import { environment } from 'environments/environment';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    urlService = '/oauth/token';
    constructor(private http: HttpClient) {
    this.urlService = environment.apiUrl + this.urlService;
  }
  attemptAuth(credentials: UserLogin): Observable<TokenResultData> {
    const endPoint = this.urlService;
    return this.http.post<TokenResultData>(endPoint, credentials);
  }
}
