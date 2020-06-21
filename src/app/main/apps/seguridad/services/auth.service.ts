import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
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
  attemptAuth(credentials: UserLogin): Observable<any> {
    const params = new FormData();
    const headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa('angularapp' + ':' + '12345') });
    //httpOptions.headers = httpOptions.headers.set('Authorization', 'Basic ' + btoa('Username: angularapp' + ' Password=12345'));
    // params.append('username', credentials.username);
    // params.append('password', credentials.password);    
    // params.append('grant_type', 'password');
    const endPoint = this.urlService;
    return this.http.post<any>(endPoint, credentials, {headers});
  }
}
