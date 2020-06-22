import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

    constructor(private tokenService: TokenStorageService, private router: Router, private authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      debugger;
    if (this.tokenService.getTokenUser() != null) {
      return true;
    } else {
      this.router.navigate(['/pages/auth/login-2'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }
}
