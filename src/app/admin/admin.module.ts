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
import { NivelesDataSource } from './niveles/service/niveles-data-source';
import { NivelesEditComponent } from './niveles/niveles-edit/niveles-edit.component';
import { NivelesAdminComponent } from './niveles/niveles-admin/niveles-admin.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

export const AdminRoutes: Routes = [
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
    path: 'niveles',
      component: NivelesAdminComponent,
      canActivate: [AuthGuardService]
    },
];

@NgModule({
  declarations: [
    NivelListComponent, NivelEditComponent, GeneralConfirmComponent,
    TemaListComponent, TemaEditComponent,
    DatageniaListComponent, DatageniaEditComponent,
    ArchivoEditComponent,
    GrupoAdminComponent, GrupoEditComponent, NivelesEditComponent, NivelesAdminComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(AdminRoutes)
  ]
})
export class AdminModule { }
