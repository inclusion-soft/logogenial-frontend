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

export const AdminRoutes: Routes = [
  {
  path: 'nivel',
  component: NivelListComponent,
  //canActivate: [AuthGuardService]
  },
  {
  path: 'tema',
  component: TemaListComponent,
  //canActivate: [AuthGuardService]
  },
  {
    path: 'datagenia',
    component: DatageniaListComponent,
    //canActivate: [AuthGuardService]
  }
];

@NgModule({
  declarations: [NivelListComponent, NivelEditComponent, GeneralConfirmComponent, TemaListComponent, TemaEditComponent, DatageniaListComponent, DatageniaEditComponent, ArchivoEditComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(AdminRoutes)
  ]
})
export class AdminModule { }
