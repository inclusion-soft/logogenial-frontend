import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  OnInit,
  Attribute
} from '@angular/core';
import { TokenStorageService } from 'app/seguridad/services/token-storage.service';

@Directive({
  selector: '[userHassPermission]'
})
export class HassPermissionDirective {
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
      debugger;
      // this.tokenStorageService.getRolesUsuario()
      //     .pipe(
      //      //   pluck('state'),
      //     ).subscribe((can: any) => {
      //         if (typeof can !== 'undefined') {
      //             if (can && !this.hasView) {
      //                 this.viewContainer.createEmbeddedView(this.templateRef);
      //                 this.hasView = true;
      //             } else if (!can && this.hasView) {
      //                 this.viewContainer.clear();
      //                 this.hasView = false;
      //             }
      //         }

      //     });
  }

}
