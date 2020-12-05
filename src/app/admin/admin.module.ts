import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NivelListComponent } from './nivel-list/nivel-list.component';
import { DemoMaterialModule } from 'app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuardService } from '../seguridad/services/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthInterceptor} from '../seguridad/auth-interceptor';
import { NivelEditComponent } from './nivel-edit/nivel-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralConfirmComponent } from './shared/components/general-confirm/general-confirm.component';
import { TemaListComponent } from './tema/tema-list/tema-list.component';
import { TemaEditComponent } from './tema/tema-edit/tema-edit.component';
import { DatageniaListComponent } from './datagenia/datagenia-list/datagenia-list.component';
import { DatageniaEditComponent } from './datagenia/datagenia-edit/datagenia-edit.component';
import { ArchivoEditComponent } from './archivo/archivo-edit/archivo-edit.component';
import { GrupoAdminComponent } from './grupo/grupo-admin/grupo-admin.component';
import { GrupoEditComponent } from './grupo/grupo-edit/grupo-edit.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GrupoNivelTemaAdminComponent } from './grupo-nivel-tema/grupo-nivel-tema-admin/grupo-nivel-tema-admin.component';
import { GrupoNivelTemaEditComponent } from './grupo-nivel-tema/grupo-nivel-tema-edit/grupo-nivel-tema-edit.component';
import { GrupoNivelEditComponent } from './grupo-nivel/grupo-nivel-edit/grupo-nivel-edit.component';
import { GrupoNivelAdminComponent } from './grupo-nivel/grupo-nivel-admin/grupo-nivel-admin.component';
import { LeccionAdminComponent } from './lecciones/leccion-admin/leccion-admin.component';
import { LeccionEditComponent } from './lecciones/leccion-edit/leccion-edit.component';
import { PreguntaEditComponent } from './preguntas/pregunta-edit/pregunta-edit.component';
import { DatageniaSelectComponent } from './datagenia/datagenia-select/datagenia-select.component';
import { OpcionRespuestaEditComponent } from './opcion-respuestas/opcion-respuesta-edit/opcion-respuesta-edit.component';
import { GrupoEstudianteAdminComponent } from './grupo-estudiante/grupo-estudiante-admin/grupo-estudiante-admin.component';
import { GrupoEstudianteEditComponent } from './grupo-estudiante/grupo-estudiante-edit/grupo-estudiante-edit.component';
import { HassPermissionDirective } from 'app/administracion/directivas/hass-permission.directive';
import { UsuarioAdminComponent } from './usuario/usuario-admin/usuario-admin.component';
import { UsuarioEditComponent } from './usuario/usuario-edit/usuario-edit.component';
import { ArrayListPipe } from './pipe/array-list.pipe';
import { DashboardAdminComponent } from './dashboard/dashboard-admin/dashboard-admin.component';
import { ChartistModule } from 'ng-chartist';

export const AdminRoutes: Routes = [
  {
    path: 'usuarios',
      component: UsuarioAdminComponent,
      canActivate: [AuthGuardService]
  },
  {
  path: 'nivel',
    component: NivelListComponent,
    canActivate: [AuthGuardService]
  },
  {
  path: 'tema',
    component: TemaListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'datagenia',
    component: DatageniaListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'grupo',
    component: GrupoAdminComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'grupo-nivel',
      component: GrupoNivelAdminComponent,
      canActivate: [AuthGuardService]
  },
  {
    path: 'grupo-nivel-tema',
      component: GrupoNivelTemaAdminComponent,
      canActivate: [AuthGuardService]
  },
  {
    path: 'lecciones',
      component: LeccionAdminComponent,
      canActivate: [AuthGuardService]
  },
  {
    path: 'grupo-estudiante',
      component: GrupoEstudianteAdminComponent,
      canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard-admin',
      component: DashboardAdminComponent,
      canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [
    NivelListComponent, NivelEditComponent, GeneralConfirmComponent,
    TemaListComponent, TemaEditComponent,
    DatageniaListComponent, DatageniaEditComponent,
    ArchivoEditComponent,
    GrupoAdminComponent, GrupoEditComponent, GrupoNivelTemaAdminComponent, GrupoNivelTemaEditComponent,
    GrupoNivelEditComponent, GrupoNivelAdminComponent, LeccionAdminComponent, LeccionEditComponent,
    PreguntaEditComponent, DatageniaSelectComponent, OpcionRespuestaEditComponent, GrupoEstudianteAdminComponent,
    GrupoEstudianteEditComponent, HassPermissionDirective, UsuarioAdminComponent, UsuarioEditComponent, ArrayListPipe, DashboardAdminComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule,
    ChartistModule,
    RouterModule.forChild(AdminRoutes)
  ]
})
export class AdminModule { }
