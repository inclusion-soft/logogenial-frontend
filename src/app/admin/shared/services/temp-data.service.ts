import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const DATA_NIVEL1_KEY = 'paramsMenuNivel1';
const DATA_NIVEL2_KEY = 'paramsMenuNivel2';
const DATA_NIVEL3_KEY = 'paramsMenuNivel3';

@Injectable({
  providedIn: 'root'
})
export class TempDataService {
  constructor() {
  }
  public getDataNivel1(): any {
    return window.sessionStorage.getItem(DATA_NIVEL1_KEY);
  }

  public setDataNivel1(data: string): void {
    window.sessionStorage.removeItem(DATA_NIVEL1_KEY);
    window.sessionStorage.setItem(DATA_NIVEL1_KEY, data);
  }

  public getDataNivel2(): any {
    return window.sessionStorage.getItem(DATA_NIVEL2_KEY);
  }

  public setDataNivel2(data: string): void {
    window.sessionStorage.removeItem(DATA_NIVEL2_KEY);
    window.sessionStorage.setItem(DATA_NIVEL2_KEY, data);
  }

  public getDataNivel3(): any {
    return window.sessionStorage.getItem(DATA_NIVEL3_KEY);
  }


  public setDataNivel3(data: string): void {
    window.sessionStorage.removeItem(DATA_NIVEL3_KEY);
    window.sessionStorage.setItem(DATA_NIVEL3_KEY, data);
  }

  public getUrlPath() {
    return environment.apiUrl;
  }
}
