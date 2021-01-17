import { Injectable } from '@angular/core';
import { TokenStorageService } from 'app/seguridad/services/token-storage.service';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  permission: string;
}

const MENUITEMS = [
  { state: 'usuarios', name: 'Gestión usuarios', type: 'link', icon: 'supervisor_account', permission: 'ADMINISTRADOR' },
  { state: 'grupo-estudiante', name: 'Asignación estudiantes', type: 'link', icon: 'face', permission: 'TUTOR' },
  { state: 'lecciones', name: 'Lecciones', type: 'link', icon: 'account_tree', permission: 'TUTOR' },
  { state: 'grupo-nivel-tema', name: 'Temas por nivel', type: 'link', icon: 'alt_route', permission: 'TUTOR' },
  { state: 'grupo-nivel', name: 'Niveles por grupo', type: 'link', icon: 'alt_route', permission: 'TUTOR' },
  { state: 'grupo', name: 'Grupos', type: 'link', icon: 'group', permission: 'TUTOR' },
  { state: 'nivel', name: 'Niveles', type: 'link', icon: 'calendar_view_day', permission: 'TUTOR'},
  { state: 'tema', name: 'Temas', type: 'link', icon: 'batch_prediction', permission: 'TUTOR' },
  { state: 'datagenia', name: 'Datagenias', type: 'link', icon: 'image_search', permission: 'TUTOR' },
  // { state: 'dashboard', name: 'Dashboard', type: 'link', icon: 'av_timer', permission: 'TUTOR' },
  { state: 'dashboard-admin', name: 'Dashboard', type: 'link', icon: 'av_timer', permission: 'TUTOR' },
];

@Injectable()
export class MenuItems {
  constructor(private tokenStorage: TokenStorageService) {
  }
  getMenuitem(){
    const roles = this.tokenStorage.getRolesUsuario() as string[];
    let itemsMenuConfirmados: ({ state: string; name: string; type: string; icon: string; permission: string; } | { state: string; name: string; type: string; icon: string; permission?: undefined; })[] = [];
    if(roles !== null) {
      MENUITEMS.forEach(element => {
        if( roles.includes(element.permission + '')) {
          itemsMenuConfirmados.push(element);
        }
      });
    }
    return itemsMenuConfirmados;
  }
}
