import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

const USER_TOKEN_KEY = 'tokenUsuario';
const USER_NAME_KEY = 'nameUsuario';
const USER_NAMES_KEY = 'nameUsuario';
const USER_EMAIL_KEY = 'emailUsuario';
const USER_ROLES_KEY = 'rolesUsuario';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public setDatosUsuario(token: string): void {
    const data = JSON.parse(atob(token.split('.')[1]));
    window.sessionStorage.removeItem(USER_TOKEN_KEY);
    window.sessionStorage.setItem(USER_TOKEN_KEY, token);
    window.sessionStorage.removeItem(USER_NAME_KEY);
    window.sessionStorage.setItem(USER_NAME_KEY, data.sub);
    window.sessionStorage.removeItem(USER_NAMES_KEY);
    window.sessionStorage.setItem(USER_NAMES_KEY, data.nombre + ' ' + data.apellido);
    window.sessionStorage.removeItem(USER_EMAIL_KEY);
    window.sessionStorage.setItem(USER_EMAIL_KEY, data.correo);
    // Pendiente expiración token
    // data.exp
  }

  public getNameUser(): any {
    return window.sessionStorage.getItem(USER_NAME_KEY);
  }

  public setRolesUsuario(roles: string): void {
    window.sessionStorage.removeItem(USER_ROLES_KEY);
    window.sessionStorage.setItem(USER_ROLES_KEY, JSON.stringify(roles));
  }

  public getRolesUsuario(): any {
    return window.sessionStorage.getItem(USER_ROLES_KEY);
  }

  public setTokenUser(data: string): void {
    window.sessionStorage.removeItem(USER_TOKEN_KEY);
    window.sessionStorage.setItem(USER_TOKEN_KEY, data);
  }

  public getTokenUser(): any {
    return window.sessionStorage.getItem(USER_TOKEN_KEY);
  }

  public setEmail(data: string): void {
    window.sessionStorage.removeItem(USER_EMAIL_KEY);
    window.sessionStorage.setItem(USER_EMAIL_KEY, data);
  }

  public getEmailUser(): any {
    return window.sessionStorage.getItem(USER_EMAIL_KEY);
  }

  public signOut(): void {
    window.sessionStorage.clear();
    localStorage.clear();
  }

  public userHasRole(rol: string) {
    const roles = this.getRolesUsuario();
    const listaRoles = JSON.parse(roles) as string[];
    if (listaRoles.includes(rol)) {
      return true;
    }
    return false;
  }

}
