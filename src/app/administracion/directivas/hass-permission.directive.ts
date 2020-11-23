import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import { TokenStorageService } from 'app/seguridad/services/token-storage.service';

@Directive({
  selector: '[userHassPermission]'
})
export class HassPermissionDirective implements OnDestroy {
  private alive = true;
  private hasView = false;
  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenStorageService: TokenStorageService) { }

    @Input() set userHassPermission(rol: string) {
      //LINEAS TEMPORALES
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      // DEVOLVER A LA NORMALIDAD CUANDO SE AGREGUE EL ROL Y USUARIO
      const roles = this.tokenStorageService.getRolesUsuario();
      const listaRoles = JSON.parse(roles) as string[];
      if( listaRoles.includes(rol)) {
        //this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else {
        this.hasView = false;
        this.viewContainer.clear();
      }
  }

  ngOnDestroy() {
    this.alive = false;
}

}
