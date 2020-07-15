import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatageniaAdminComponent } from './datagenia/datagenia-admin/datagenia-admin.component';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuardService } from '../demo/seguridad/services/auth-guard.service';

const routes = [
    {
        path        : 'contenidos/datagenia/datagenia', component: DatageniaAdminComponent, canActivate: [AuthGuardService],
        //loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    }
];

@NgModule({
  declarations: [DatageniaAdminComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    CommonModule
  ],
  exports:[
      CommonModule
  ]
})
export class ContenidoModule { }
