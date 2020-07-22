import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { TokenStorageService } from './services/token-storage.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private urlApp: string;

    constructor(private token: TokenStorageService) {
        this.urlApp = environment.apiUrl;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      let authReq = req;
        const token = this.token.getTokenUser();
        if (token != null && req.url.indexOf('oauth/token') < 0) {
            if (req.url.indexOf(this.urlApp) > -1) {
                authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
            }
        }
        return next.handle(authReq);
    }
}
