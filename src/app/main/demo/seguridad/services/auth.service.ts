import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
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
 
    const headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa('angularapp' + ':' + '12345') });
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", 'Basic ' + btoa('angularapp' + ':' + '12345') );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("username", "andres");
    urlencoded.append("password", "12345");
    urlencoded.append("grant_type", "password");

    const params = new HttpParams({
        fromObject: {
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password,
        }
      });

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('angularapp' + ':' + '12345')
        })
      };

    const endPoint = this.urlService;
    return this.http.post<any>(endPoint, params, httpOptions);
  }
}
